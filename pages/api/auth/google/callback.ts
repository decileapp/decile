import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { Source } from "../../../../types/Sources";
import { encrypt } from "../../../../utils/encryption";
import { getServiceSupabase, supabase } from "../../../../utils/supabaseClient";
import { authoriseGoogle, getNewToken } from "../../../../utils/google/auth";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CREATE NEW SOURCE
  if (req.method === "GET") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);

      const { code } = req.query;

      if (!code) {
        res.status(400).json({ error: "Something went wrong" });
        return;
      } else {
        const tokenData = await getNewToken(code as string);
        const serviceSupabase = getServiceSupabase();
        // Store data in DB
        const { data, error } = await serviceSupabase
          .from("integration_credentials")
          .insert({
            user_id: user?.id,
            access_token: encrypt(tokenData.credentials.access_token || ""),
            refresh_token: encrypt(tokenData.credentials.refresh_token || ""),
            expiry_date: tokenData.credentials.expiry_date,
            scope: tokenData.credentials.scope,
            provider: "google",
          });
        res.redirect("/google").json({});
      }

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
