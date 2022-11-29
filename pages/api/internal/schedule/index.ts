import type { NextApiRequest, NextApiResponse } from "next";
import { checkExistingToken } from "../../../../utils/google/auth";
import { writeOnSpreadsheet } from "../../../../utils/google/sheets";
import formatForSheets from "../../../../utils/postgres/formatForSheets";
import queryById from "../../../../utils/postgres/queryById";
import { getServiceSupabase } from "../../../../utils/supabaseClient";
import { DateTime } from "luxon";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import emailHelper from "../../../../utils/emailHelper";
import { Database } from "../../../../types/database.types";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const currentTime = DateTime.utc();
      const currentHour = currentTime.hour;
      const currentDay = currentTime.weekday;
      const currentDate = currentTime.day;

      const serviceSupabase = await getServiceSupabase();
      let query = serviceSupabase
        .from("schedule")
        .select(
          "*,  export:export_id(id, query_id, spreadsheet), user:user_id(id, email)"
        )
        .or(`run_at_time.eq.-1, run_at_time.eq.${currentHour}`)
        .or(
          `periodicity.eq.hour, periodicity.eq.day, and(periodicity.eq.week,run_at_day.eq.${currentDay}), and(periodicity.eq.month,run_at_month_date.eq.${currentDate})`
        );
      const { data, error } = await query;

      if (!data) {
        res.status(200).json({});
        return;
      }

      if (data && data.length == 0) {
        res.status(200).json({});
        return;
      }

      // Run all queries
      const runQueries = data.map(async (singleQuery) => {
        const data = await queryById({
          queryId: singleQuery.export.query_id,
          userId: singleQuery.user.id,
          orgId: singleQuery.org_id,
        });
        // Export to GSheets
        // Check if token exists
        const auth = await checkExistingToken(singleQuery.user.id);

        // If no auth redir
        if (!auth) {
          return;
        } else {
          const rowData = await formatForSheets(data);
          const updatedSheet = await writeOnSpreadsheet({
            auth: auth,
            range: "From_Decile",
            data: rowData,
            spreadsheet: singleQuery.export.spreadsheet,
          });

          // Send email notification
          if (updatedSheet && singleQuery.notify_email) {
            const send = await emailHelper({
              from: process.env.FROM_EMAIL || "",
              to: singleQuery.user.email,
              templateId: process.env.COURIER_NOTIFICATION_EMAIL || "",
              vars: {
                link: `https://docs.google.com/spreadsheets/d/${updatedSheet}/edit#gid=0`,
              },
            });
          }

          return updatedSheet;
        }
      });

      const runAllQueries = await Promise.all(runQueries);
      res.status(200).json({ success: true });
      return;
    } catch (e: any) {
      console.error(e);
      throw new Error(`Something went wrong.`);
    }
  }

  // GET ALL LINKS
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
