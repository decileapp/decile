import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../../utils/supabaseClient";
import {
  authoriseGoogle,
  checkExistingToken,
} from "../../../../../utils/google/auth";
import protectServerRoute from "../../../../../utils/auth/protectServerRoute";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  // CHECK CREDS
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

      // Check if token exists
      const auth = await checkExistingToken(user.id);
      if (auth) {
        res.status(200).json({ authenticated: true });
      } else {
        // Check
        const link = await authoriseGoogle();

        res.status(200).json({ link: link });
      }

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
