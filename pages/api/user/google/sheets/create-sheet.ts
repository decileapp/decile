import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../../utils/supabaseClient";
import {
  authoriseGoogle,
  checkExistingToken,
} from "../../../../../utils/google/auth";
import { createAndWriteSpreadsheet } from "../../../../../utils/google/sheets";
import queryById from "../../../../../utils/postgres/queryById";
import formatForSheets from "../../../../../utils/postgres/formatForSheets";
import protectServerRoute from "../../../../../utils/auth/protectServerRoute";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  // CHECK CREDS
  if (req.method === "POST") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);

      if (!user || !token) {
        return res.status(401);
      }

      supabase.auth.setAuth(token);

      const { title, queryId, range } = req.body;

      // Check if token exists
      const auth = await checkExistingToken(user.id);

      // If no auth redir
      if (!auth) {
        const link = await authoriseGoogle();
        res.status(200).json({ link: link });
        return;
      } else {
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
          const createdSheet = await createAndWriteSpreadsheet({
            auth: auth,
            title: title,
            range: range,
            data: rowData,
          });

          // Add to DB
          const { data, error } = await supabase.from("export").insert({
            query_id: queryId,
            spreadsheet: createdSheet,
            user_id: user.id,
            org_id: user.user_metadata.org_id,
          });
          res.status(200).json({ spreadsheetId: createdSheet });
          return;
        }
      }
      res.status(200).json({});
      return;
    } catch (e: any) {
      console.log(e);

      throw new Error(`Something went wrong.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};
export default protectServerRoute(handle);
