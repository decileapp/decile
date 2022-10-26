import { NextApiRequest, NextApiResponse } from "next";
import protectServerRoute from "../../../utils/auth/protectServerRoute";
import updateOrgForSession from "../../../utils/organisation/updateOrgForSession";
import { supabase } from "../../../utils/supabaseClient";

// Adds org meta data to user object
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { user, token } = await supabase.auth.api.getUserByCookie(req);
      if (!user || !token) {
        res.status(401).json({ error: "Not authorised" });
        return;
      }

      supabase.auth.setAuth(token);
      const data = await updateOrgForSession(user);

      if (data) {
        res.status(200).json({ success: true });
        return;
      }
      res.status(200).json({ success: false });
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
};

export default protectServerRoute(handle);
