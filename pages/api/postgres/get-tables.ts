import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { dbUser, host, database, password, port, ssl, special } = req.body;

      const pool = new Pool({
        user: dbUser,
        host: host,
        database: database,
        password: special,
        port: port,
        ssl: ssl,
      });
      const tables = await pool.query(
        "SELECT table_name FROM information_schema.tables where table_schema = 'public'"
      );

      return res
        .status(200)
        .json({ tables: tables.rows.map((r) => r.table_name) });
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
