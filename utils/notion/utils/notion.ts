import { Client, isFullPage } from "@notionhq/client";
import {
  GetPagePropertyResponse,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { ListBlockChildrenResponseResults } from "../types";

export const getBlockChildren = async (
  notionClient: Client,
  block_id: string,
  totalPage: number | null
) => {
  try {
    let result: ListBlockChildrenResponseResults = [];
    let pageCount = 0;
    let start_cursor = undefined;

    do {
      const response = (await notionClient.blocks.children.list({
        start_cursor: start_cursor,
        block_id: block_id,
      })) as ListBlockChildrenResponse;
      result.push(...response.results);

      start_cursor = response?.next_cursor;
      pageCount += 1;
    } while (
      start_cursor != null &&
      (totalPage == null || pageCount < totalPage)
    );

    modifyNumberedListObject(result);
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const modifyNumberedListObject = (
  blocks: ListBlockChildrenResponseResults
) => {
  let numberedListIndex = 0;

  for (const block of blocks) {
    if ("type" in block && block.type === "numbered_list_item") {
      // add numbers
      // @ts-ignore
      block.numbered_list_item.number = ++numberedListIndex;
    } else {
      numberedListIndex = 0;
    }
  }
};

export const getPageProperties = async (
  notionClient: Client,
  page_id: string
) => {
  const response = await notionClient.pages.retrieve({ page_id: page_id });
  if (!isFullPage(response)) {
    return;
  }
  return response;
};
