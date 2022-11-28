import type { NextApiRequest, NextApiResponse } from "next";
import { encrypt } from "../../../../utils/encryption";
import { getServiceSupabase, supabase } from "../../../../utils/supabaseClient";
import { getNewToken } from "../../../../utils/google/auth";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      // Check user
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return res.status(401);
      }
      const { user } = session;

      const { code } = req.query;

      if (!code) {
        res.status(400).json({ error: "Something went wrong" });
        return;
      }

      const tokenData = await getNewToken(code as string);
      const serviceSupabase = getServiceSupabase();

      if (!tokenData) {
        throw new Error("Something went wrong.");
      }

      // Delete existing tokens
      const { data: deleted } = await serviceSupabase
        .from("integration_credentials")
        .delete()
        .match({ user_id: user?.id });

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
      res.redirect("/google");
      return;
    } catch (e: any) {
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
