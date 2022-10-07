import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { Source } from "../../../types/Sources";
import { encrypt } from "../../../utils/encryption";
import getResponse from "../../../utils/openai";
import { getServiceSupabase, supabase } from "../../../utils/supabaseClient";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CREATE NEW SOURCE
  if (req.method === "POST") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);

      if (!user || !token) {
        res.status(401);
        return;
      }

      supabase.auth.setAuth(token);

      const { query } = req.body;

      // Get text and convert to sql
      const response = await getResponse(query);
      console.log(response);
      if (response) {
        if (response.choices)
          res.status(200).json({ sql: response.choices[0].text });
        return;
      }

      res.status(400).json({});
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
