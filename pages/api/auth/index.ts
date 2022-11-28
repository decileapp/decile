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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Update the creds on cookie
      if (user) {
        const data = await updateOrgForSession(user);
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
}
