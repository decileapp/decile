import type { NextApiRequest, NextApiResponse } from "next";
import protectServerRoute from "../../../../../utils/auth/protectServerRoute";
import {} from "@supabase/auth-helpers-nextjs";
import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "../../../../../utils/notion";
import { Post } from "../../../../../types/Post";
import { getPageProperties } from "../../../../../utils/notion/utils/notion";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (!id) {
        res.status(400).json({ error: "No post id" });
        return;
      }

      const notion = new Client({
        auth: process.env.NOTION_API_KEY,
      });

      // passing notion client to the option
      const n2m = new NotionToMarkdown({ notionClient: notion });

      // Get data
      const getPage = await n2m.pageToMarkdown(id as string);
      const mdString = n2m.toMarkdownString(getPage.content);

      res.status(200).json({ content: mdString });
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
