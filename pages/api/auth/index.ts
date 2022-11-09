// pages/pages/api/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import updateOrgForSession from "../../../utils/organisation/updateOrgForSession";
import { supabase } from "../../../utils/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set the auth cookie.
  if (req.method === "POST") {
    try {
      supabase.auth.api.setAuthCookie(req, res);

      const { user, token } = await supabase.auth.api.getUserByCookie(req);
      // Update the creds on cookie
      if (user && token) {
        supabase.auth.setAuth(token);
        const data = await updateOrgForSession(user);
      }

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
