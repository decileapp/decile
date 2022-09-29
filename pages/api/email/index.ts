import type { NextApiRequest, NextApiResponse } from "next";
import emailHelper from "../../../utils/emailHelper";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, admin, link } = req.body;
      const send = await emailHelper({
        from: "krishna@subtable.app",
        to: email,
        templateId: "Z6V0E3HEAHM63SKRA3B05RKVR9AE",
        vars: {
          user: "User",
          admin: admin,
          link: link,
        },
      });
      res.status(200).json({});
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
