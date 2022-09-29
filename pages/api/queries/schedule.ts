import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { Source } from "../../../types/Sources";
import { encrypt } from "../../../utils/encryption";
import { checkExistingToken } from "../../../utils/google/auth";
import { createAndWriteSpreadsheet } from "../../../utils/google/sheets";
import formatForSheets from "../../../utils/postgres/formatForSheets";
import queryById from "../../../utils/postgres/queryById";
import { getServiceSupabase, supabase } from "../../../utils/supabaseClient";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers.bearer?.toString() !== process.env.BEARER_TOKEN) {
    res.status(401).json({});
    return;
  } else if (req.method === "GET") {
    try {
      const serviceSupabase = await getServiceSupabase();
      const { data, error } = await serviceSupabase
        .from("schedule")
        .select("run_at, query_id, user_id, org_id");
      if (!data) {
        res.status(200).json({});
        return;
      }

      if (data && data.length == 0) {
        res.status(200).json({});
        return;
      }

      // Run all queries
      const runQueries = data.concat(data).map(async (singleQuery) => {
        const data = await queryById({
          queryId: singleQuery.query_id,
          userId: singleQuery.user_id,
          orgId: singleQuery.org_id,
        });
        // Export to GSheets
        // Check if token exists
        const auth = await checkExistingToken(singleQuery.user_id);

        // If no auth redir
        if (!auth) {
          return;
        } else {
          const rowData = await formatForSheets(data);
          const createdSheet = await createAndWriteSpreadsheet({
            auth: auth,
            title: `NewSample-${new Date(Date.now())}`,
            range: "Sheet1",
            data: rowData,
          });
          return createdSheet;
        }
      });

      const runAllQueries = await Promise.all(runQueries);
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
