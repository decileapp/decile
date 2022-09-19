import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { Session } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const afterCallback = async ({
  req,
  res,
  session,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  session: any;
}) => {
  const payload = {
    userId: session.user.sub,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  session.user.accessToken = jwt.sign(
    payload,
    process.env.SUPABASE_SIGNING_SECRET || ""
  );

  return session;
};

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { ...afterCallback });
    } catch (error: any) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
