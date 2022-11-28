import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { decrypt } from "../../../../utils/encryption";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import axios from "axios";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const {
        queryText,
        schema,
        body,
        dbUser,
        host,
        database,
        password,
        port,
        ssl,
      } = req.body;

      if (!queryText || !schema) {
        res.status(400).json({ error: "Query or schema are missing." });
        return;
      }

      const response = await axios.post(
        `${process.env.AI_API_ORIGIN}/generate-sql`,
        { query: queryText, schema: schema },
        {
          headers: {
            Authorization: `Bearer ${process.env.AI_API_BEARER_TOKEN}`,
          },
        }
      );
      if (response.data) {
        // Finalise query
        const finalQuery = "SELECT " + response.data.text;

        // Get results
        const pool = new Pool({
          user: dbUser,
          host: host,
          database: database,
          password: decrypt(password),
          port: port,
          ssl: ssl,
        });
        const result = await pool.query(finalQuery);
        return res.status(200).json({
          rows: result.rows,
          fields: result.fields,
          sqlQuery: finalQuery,
        });
      } else {
        res.status(400).json({ error: "Failed to generate query." });
      }
    } catch (e) {
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
