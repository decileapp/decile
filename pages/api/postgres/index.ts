import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { decrypt } from "../../../utils/encryption";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { query, dbUser, host, database, password, port, ssl } = req.body;

      const decrypytedPassword = decrypt(password);

      const pool = new Pool({
        user: dbUser,
        host: host,
        database: database,
        password: decrypytedPassword,
        port: port,
        ssl: ssl,
      });

      const result = await pool.query(query);

      return res.status(200).json({ result: result });
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
