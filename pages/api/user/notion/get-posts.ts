import type { NextApiRequest, NextApiResponse } from "next";
import protectServerRoute from "../../../../utils/auth/protectServerRoute";
import { Client, isFullPage } from "@notionhq/client";
import { Post, PostHeading } from "../../../../types/Post";
import { format } from "path";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const notion = new Client({
        auth: process.env.NOTION_API_KEY,
      });

      const data = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_KEY || "",
        filter: { or: [{ property: "Public", checkbox: { equals: true } }] },
        sorts: [{ property: "Order", direction: "ascending" }],
      });

      // TODO: Better typing
      // Format notion object
      const _buildPost = (pageObject: any) => {
        const prop = pageObject.properties;
        const post: PostHeading = {
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
          order: prop.Order.number ? prop.Order.number : -1,
          questions:
            prop.Questions && prop.Questions.rich_text[0]
              ? JSON.parse(prop.Questions.rich_text[0].plain_text)
              : [],
        };
        return post;
      };

      let formattedData: PostHeading[] = [];
      for (const page of data.results) {
        if (isFullPage(page)) {
          formattedData.push(_buildPost(page));
        }
      }
      res.status(200).json({ posts: formattedData });
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
