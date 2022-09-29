import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { decrypt } from "../../../utils/encryption";
import { supabase } from "../../../utils/supabaseClient";
import utf from "utf8";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { dbUser, host, database, password, port, ssl, table } = req.body;

      const pool = new Pool({
        user: dbUser,
        host: host,
        database: database,
        password: decrypt(password),
        port: port,
        ssl: ssl,
      });

      const columns = await pool.query(
        `SELECT *
        FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name   = '${table}'
           ;`
      );

      return res.status(200).json({
        columns: columns.rows.map((r) => {
          return { type: r.data_type, name: r.column_name };
        }),
      });
    } catch (e) {
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
