import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import protectServerRoute from "../../../utils/auth/protectServerRoute";
import updateOrgForSession from "../../../utils/organisation/updateOrgForSession";

// Adds org meta data to user object
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        res.status(401).json({ error: "Not authorised" });
        return;
      }

      const data = await updateOrgForSession(session.user);
      if (data) {
        res.status(200).json({ success: true });
        return;
      }
      res.status(200).json({});
      return;
    } catch (e) {
      console.error(e);
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};

export default protectServerRoute(handle);
