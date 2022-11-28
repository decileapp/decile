import type { NextApiRequest, NextApiResponse } from "next";
import {
  getServiceSupabase,
  supabase,
} from "../../../../../utils/supabaseClient";
import {
  authoriseGoogle,
  checkExistingToken,
} from "../../../../../utils/google/auth";
import { writeOnSpreadsheet } from "../../../../../utils/google/sheets";
import queryById from "../../../../../utils/postgres/queryById";
import formatForSheets from "../../../../../utils/postgres/formatForSheets";
import protectServerRoute from "../../../../../utils/auth/protectServerRoute";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  // CHECK CREDS
  if (req.method === "POST") {
    try {
      // Check user
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return res.status(401);
      }
      const { user } = session;

      const { spreadsheet, queryId, range } = req.body;

      const auth = await checkExistingToken(user.id);

      // If no auth redir
      if (!auth) {
        const link = await authoriseGoogle();
        res.status(200).json({ link: link });
        return;
      } else {
        try {
          // Get data
          const queryData = await queryById({
            queryId: queryId,
            userId: user.id,
            orgId: user.user_metadata.org_id,
          });

          // If data available
          if (queryData) {
            // Format data for google sheets
            const rowData = formatForSheets(queryData);
            // Export to Google sheet
            const createdSheet = await writeOnSpreadsheet({
              auth: auth,
              spreadsheet: spreadsheet,
              range: range,
              data: rowData,
            });
            res.status(200).json({ spreadsheetId: createdSheet });
            return;
          } else {
            throw new Error("No query found");
          }
        } catch (e) {
          const link = await authoriseGoogle();
          res.status(200).json({ link: link });
          return;
        }
      }
    } catch (e: any) {
      console.error(e);

      throw new Error(`Something went wrong.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
