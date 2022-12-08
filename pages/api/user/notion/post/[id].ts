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
      const pageObject: any = getPage.pageProperties;

      if (!pageObject) {
        const post: Post = {
          id: id as string,
          title: "",
          description: "",
          createdAt: new Date(pageObject.created_time),
          updatedAt: new Date(pageObject.last_edited_time),
          image: "",
          tags: [],
          body: mdString,
          order: -1,
        };
        res.status(200).json({ post: post });
      }

      const prop: any = pageObject.properties;

      const post: Post = {
        id: pageObject.id,
        title:
          prop.Name.title && prop.Name.title.length > 0
            ? prop.Name.title[0].plain_text
            : "",
        description:
          prop.Description && prop.Description.rich_text[0]
            ? prop.Description.rich_text[0].plain_text
            : "",
        createdAt: new Date(pageObject.created_time),
        updatedAt: new Date(pageObject.last_edited_time),
        image:
          pageObject.cover && pageObject.cover.external
            ? pageObject.cover.external.url
            : "",
        tags: prop.Tags.multi_select
          ? prop.Tags.multi_select.map((opt: any) => opt.name)
          : [],
        body: mdString,
        order: prop.Order.number ? prop.Order.number : -1,
      };
      res.status(200).json({ post: post });
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
