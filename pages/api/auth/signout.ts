// pages/pages/api/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set the auth cookie.
  if (req.method === "GET") {
    try {
      supabase.auth.api.deleteAuthCookie(req, res, {
        redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}auth/signin`,
      });
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
