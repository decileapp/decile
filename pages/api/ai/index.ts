// pages/pages/api/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import postgresQuery from "../../../utils/postgresQuery";
import { supabase } from "../../../utils/supabaseClient";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set the auth cookie.
  if (req.method === "POST") {
    // Function to get answer
    const askSql = async (data: {
      inputs: {
        query: string;
        table: any;
      };
    }) => {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/tapas-base-finetuned-wikisql-supervised",
        {
          headers: { Authorization: `Bearer ${process.env.HUGGING_FACE}` },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log(JSON.stringify(response));
      res.status(200).json({ data: data });
      return result;
    };

    try {
      console.log(req.body);

      const {
        body,
        dbUser,
        host,
        database,
        password,
        port,
        ssl,
        special,
        table,
        question,
      } = req.body;
      const data = await postgresQuery({
        setup: {
          user: dbUser,
          host: host,
          database: database,
          password: special,
          port: port,
          ssl: ssl,
        },
        body: `select * from ${table} limit 10`,
      });

      // const answer = await askSql({
      //   inputs: { query: question, table: data.rows },
      // });
      // console.log(answer);

      res.status(200).json({});
      return;
    } catch (e) {
      console.log(e);
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
