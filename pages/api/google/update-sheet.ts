import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";
import {
  authoriseGoogle,
  checkExistingToken,
} from "../../../utils/google/auth";
import postgresQuery from "../../../utils/postgresQuery";
import {
  createAndWriteSpreadsheet,
  createSpreadsheet,
  writeOnSpreadsheet,
} from "../../../utils/google/sheets";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CHECK CREDS
  if (req.method === "POST") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);

      if (!user || !token) {
        return res.status(401);
      }

      supabase.auth.setAuth(token);

      const { spreadsheet, queryId, range } = req.body;

      // Check if token exists
      const auth = await checkExistingToken(user.id);

      // If no auth redir
      if (!auth) {
        const link = await authoriseGoogle();
        res.status(200).json({ link: link });
        return;
      } else {
        // Get data
        const { data, error } = await supabase
          .from("queries")
          .select(
            "id, database(dbUser, host, database, password, port, ssl), body"
          )
          .match({ id: queryId })
          .single();
        const queryData = await postgresQuery({
          setup: data.database,
          body: data.body,
        });

        // If data available
        if (queryData) {
          // Format data for google sheets
          const rowData = [Object.keys(queryData.rows[0])].concat(
            queryData.rows.map((r: any) => Object.values(r))
          );
          // Export to Google sheet
          const createdSheet = await writeOnSpreadsheet({
            auth: auth,
            spreadsheet: spreadsheet,
            range: range,
            data: rowData,
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
  }

  // GET ALL LINKS
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
