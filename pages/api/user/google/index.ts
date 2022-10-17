import type { NextApiRequest, NextApiResponse } from "next";
import { getServiceSupabase, supabase } from "../../../../utils/supabaseClient";
import { authoriseGoogle } from "../../../../utils/google/auth";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);
      if (!user) {
        res.status(401).json({});
        return;
      }

      // Check if creds are valid
      const serviceSupabase = getServiceSupabase();
      const { data, error } = await serviceSupabase
        .from("integration_credentials")
        .select("id")
        .match({
          user_id: user?.id,
          provider: "google",
        })
        .single();

      if (data) {
        res.status(200).json({});
        return;
      }

      const auth = await authoriseGoogle();
      res.status(200).json({ link: auth });
      return;
    } catch (e: any) {
      console.log(e);

      throw new Error(`Something went wrong.`);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
