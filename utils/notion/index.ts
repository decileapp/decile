import { Client } from "@notionhq/client";
import {
  GetPagePropertyResponse,
  GetPageResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  Annotations,
  ListBlockChildrenResponseResult,
  ListBlockChildrenResponseResults,
  MdBlock,
  Text,
  NotionToMarkdownOptions,
  CustomTransformer,
} from "./types";
import * as md from "./utils/md";
import { getBlockChildren, getPageProperties } from "./utils/notion";

/**
 * Converts a Notion page to Markdown.
 */
export class NotionToMarkdown {
  private notionClient: Client;
  private customTransformers: Record<string, CustomTransformer>;
  constructor(options: NotionToMarkdownOptions) {
    this.notionClient = options.notionClient;
    this.customTransformers = {};
  }
  setCustomTransformer(
    type: string,
    transformer: CustomTransformer
  ): NotionToMarkdown {
    this.customTransformers[type] = transformer;

    return this;
  }
  /**
   * Converts Markdown Blocks to string
   * @param {MdBlock[]} mdBlocks - Array of markdown blocks
   * @param {number} nestingLevel - Defines max depth of nesting
   * @returns {string} - Returns markdown string
   */
  toMarkdownString(mdBlocks: MdBlock[] = [], nestingLevel: number = 0): string {
    let mdString = "";
    mdBlocks.forEach((mdBlocks) => {
      // process parent blocks
      if (mdBlocks.parent) {
        if (
          mdBlocks.type !== "to_do" &&
          mdBlocks.type !== "bulleted_list_item" &&
          mdBlocks.type !== "numbered_list_item"
        ) {
          // add extra line breaks non list blocks
          mdString += `\n${md.addTabSpace(mdBlocks.parent, nestingLevel)}\n\n`;
        } else {
          mdString += `${md.addTabSpace(mdBlocks.parent, nestingLevel)}\n`;
        }
      }

      // process child blocks
      if (mdBlocks.children && mdBlocks.children.length > 0) {
        if (mdBlocks.type === "synced_block") {
          mdString += this.toMarkdownString(mdBlocks.children, nestingLevel);
        } else {
          mdString += this.toMarkdownString(
            mdBlocks.children,
            nestingLevel + 1
          );
        }
      }
    });
    return mdString;
  }

  /**
   * Retrieves Notion Blocks based on ID and converts them to Markdown Blocks
   * @param {string} id - notion page id (not database id)
   * @param {number} totalPage - Retrieve block children request number, page_size Maximum = totalPage * 100 (Default=null)
   * @returns {Promise<MdBlock[]>} - List of markdown blocks
   */
  async pageToMarkdown(
    id: string,
    totalPage: number | null = null
  ): Promise<{
    pageProperties: PageObjectResponse | undefined;
    content: MdBlock[];
  }> {
    if (!this.notionClient) {
      throw new Error(
        "notion client is not provided, for more details check out https://github.com/souvikinator/notion-to-md"
      );
    }

    // Page properties
    const pageProperties = await getPageProperties(this.notionClient, id);

    const blocks = await getBlockChildren(this.notionClient, id, totalPage);

    const parsedData = await this.blocksToMarkdown(blocks);
    return { pageProperties: pageProperties, content: parsedData };
  }

  /**
   * Converts list of Notion Blocks to Markdown Blocks
   * @param {ListBlockChildrenResponseResults | undefined} blocks - List of notion blocks
   * @param {number} totalPage - Retrieve block children request number, page_size Maximum = totalPage * 100
   * @param {MdBlock[]} mdBlocks - Defines max depth of nesting
   * @returns {Promise<MdBlock[]>} - Array of markdown blocks with their children
   */
  async blocksToMarkdown(
    blocks?: ListBlockChildrenResponseResults,
    totalPage: number | null = null,
    mdBlocks: MdBlock[] = []
  ): Promise<MdBlock[]> {
    if (!this.notionClient) {
      throw new Error(
        "notion client is not provided, for more details check out https://github.com/souvikinator/notion-to-md"
      );
    }

    if (!blocks) return mdBlocks;

    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      if (
        "has_children" in block &&
        block.has_children &&
        block.type !== "column_list" &&
        block.type !== "toggle" &&
        block.type !== "callout"
      ) {
        let child_blocks = await getBlockChildren(
          this.notionClient,
          block.id,
          totalPage
        );
        mdBlocks.push({
          type: block.type,
          parent: await this.blockToMarkdown(block),
          children: [],
        });

        let l = mdBlocks.length;
        await this.blocksToMarkdown(
          child_blocks,
          totalPage,
          mdBlocks[l - 1].children
        );
        continue;
      }
      let tmp = await this.blockToMarkdown(block);
      // @ts-ignore
      mdBlocks.push({ type: block.type, parent: tmp, children: [] });
    }
    return mdBlocks;
  }

  /**
   * Converts a Notion Block to a Markdown Block
   * @param {ListBlockChildrenResponseResult} block - single notion block
   * @returns {string} corresponding markdown string of the passed block
   */
  async blockToMarkdown(block: ListBlockChildrenResponseResult) {
    if (typeof block !== "object" || !("type" in block)) return "";

    let parsedData = "";
    const { type } = block;
    if (type in this.customTransformers && !!this.customTransformers[type])
      return await this.customTransformers[type](block);

    switch (type) {
      case "image":
        {
          let blockContent = block.image;
          const image_caption_plain = blockContent.caption
            .map((item) => item.plain_text)
            .join("");
          const image_type = blockContent.type;
          if (image_type === "external")
            return md.image(image_caption_plain, blockContent.external.url);
          if (image_type === "file")
            return md.image(image_caption_plain, blockContent.file.url);
        }
        break;

      case "divider": {
        return md.divider();
      }

      case "equation": {
        return md.codeBlock(block.equation.expression);
      }

      case "video":
      case "file":
      case "pdf":
        {
          let blockContent;
          if (type === "video") blockContent = block.video;
          if (type === "file") blockContent = block.file;
          if (type === "pdf") blockContent = block.pdf;
          if (blockContent) {
            const file_type = blockContent.type;
            if (file_type === "external")
              return md.link("image", blockContent.external.url);
            if (file_type === "file")
              return md.link("image", blockContent.file.url);
          }
        }
        break;

      case "bookmark":
      case "embed":
      case "link_preview":
      case "link_to_page":
      case "child_page":
      case "child_database":
        {
          let blockContent;
          let title: string = type;
          if (type === "bookmark") blockContent = block.bookmark;
          if (type === "embed") blockContent = block.embed;
          if (type === "link_preview") blockContent = block.link_preview;
          if (
            type === "link_to_page" &&
            block.link_to_page.type === "page_id"
          ) {
            blockContent = { url: block.link_to_page.page_id };
          }

          if (type === "child_page") {
            blockContent = { url: block.id };
            title = block.child_page.title;
          }

          if (type === "child_database") {
            blockContent = { url: block.id };
            title = block.child_database.title || "child_database";
          }

          if (blockContent) return md.link(title, blockContent.url);
        }
        break;

      case "table": {
        const { id, has_children } = block;
        let tableArr: string[][] = [];
        if (has_children) {
          const tableRows = await getBlockChildren(this.notionClient, id, 100);
          let rowsPromise = tableRows?.map(async (row) => {
            const { type } = row as any;
            const cells = (row as any)[type]["cells"];

            /**
             * this is more like a hack since matching the type text was
             * difficult. So converting each cell to paragraph type to
             * reuse the blockToMarkdown function
             */
            let cellStringPromise = cells.map(
              async (cell: any) =>
                await this.blockToMarkdown({
                  type: "paragraph",
                  paragraph: { rich_text: cell },
                } as ListBlockChildrenResponseResult)
            );

            const cellStringArr = await Promise.all(cellStringPromise);
            tableArr.push(cellStringArr);
          });
          await Promise.all(rowsPromise || []);
        }
        return md.table(tableArr);
      }

      case "column_list": {
        const { id, has_children } = block;

        if (!has_children) return "";

        const column_list_children = await getBlockChildren(
          this.notionClient,
          id,
          100
        );

        let column_list_promise = column_list_children.map(
          async (column) => await this.blockToMarkdown(column)
        );

        let column_list: string[] = await Promise.all(column_list_promise);

        return column_list.join("\n\n");
      }

      case "column": {
        const { id, has_children } = block;
        if (!has_children) return "";

        const column_children = await getBlockChildren(
          this.notionClient,
          id,
          100
        );

        const column_children_promise = column_children.map(
          async (column_child) => await this.blockToMarkdown(column_child)
        );

        let column: string[] = await Promise.all(column_children_promise);
        return column.join("\n\n");
      }

      case "toggle": {
        const { id, has_children } = block;

        const toggle_summary = block.toggle.rich_text[0]?.plain_text;

        // empty toggle
        if (!has_children) {
          return md.toggle(toggle_summary);
        }

        const toggle_children_object = await getBlockChildren(
          this.notionClient,
          id,
          100
        );

        // parse children blocks to md object
        const toggle_children = await this.blocksToMarkdown(
          toggle_children_object
        );

        // convert children md object to md string
        const toggle_children_md_string =
          this.toMarkdownString(toggle_children);

        return md.toggle(toggle_summary, toggle_children_md_string);
      }
      // Rest of the types
      // "paragraph"
      // "heading_1"
      // "heading_2"
      // "heading_3"
      // "bulleted_list_item"
      // "numbered_list_item"
      // "quote"
      // "to_do"
      // "template"
      // "synced_block"
      // "child_page"
      // "child_database"
      // "code"
      // "callout"
      // "breadcrumb"
      // "table_of_contents"
      // "column_list"
      // "column"
      // "link_to_page"
      // "audio"
      // "unsupported"

      default: {
        // In this case typescript is not able to index the types properly, hence ignoring the error
        // @ts-ignore
        let blockContent = block[type].text || block[type].rich_text || [];
        blockContent.map((content: Text) => {
          const annotations = content.annotations;
          let plain_text = content.plain_text;

          plain_text = this.annotatePlainText(plain_text, annotations);

          if (content["href"])
            plain_text = md.link(plain_text, content["href"]);

          parsedData += plain_text;
        });
      }
    }

    switch (type) {
      case "code":
        {
          parsedData = md.codeBlock(parsedData, block[type].language);
        }
        break;

      case "heading_1":
        {
          parsedData = md.heading1(parsedData);
        }
        break;

      case "heading_2":
        {
          parsedData = md.heading2(parsedData);
        }
        break;

      case "heading_3":
        {
          parsedData = md.heading3(parsedData);
        }
        break;

      case "quote":
        {
          parsedData = md.quote(parsedData);
        }
        break;

      case "callout":
        {
          const { id, has_children } = block;
          let callout_string = "";

          if (!has_children) {
            return md.callout(parsedData, block[type].icon);
          }

          const callout_children_object = await getBlockChildren(
            this.notionClient,
            id,
            100
          );

          // // parse children blocks to md object
          const callout_children = await this.blocksToMarkdown(
            callout_children_object
          );

          callout_string += `${parsedData}\n`;
          callout_children.map((child) => {
            callout_string += `${child.parent}\n\n`;
          });

          parsedData = md.callout(callout_string.trim(), block[type].icon);
        }
        break;

      case "bulleted_list_item":
        {
          parsedData = md.bullet(parsedData);
        }
        break;

      case "numbered_list_item":
        {
          parsedData = md.bullet(parsedData, block.numbered_list_item.number);
        }
        break;

      case "to_do":
        {
          parsedData = md.todo(parsedData, block.to_do.checked);
        }
        break;
    }

    return parsedData;
  }

  /**
   * Annoate text using provided annotations
   * @param {string} text - String to be annotated
   * @param {Annotations} annotations - Annotation object of a notion block
   * @returns {string} - Annotated text
   */
  annotatePlainText(text: string, annotations: Annotations): string {
    // if text is all spaces, don't annotate
    if (text.match(/^\s*$/)) return text;

    const leadingSpaceMatch = text.match(/^(\s*)/);
    const trailingSpaceMatch = text.match(/(\s*)$/);

    const leading_space = leadingSpaceMatch ? leadingSpaceMatch[0] : "";
    const trailing_space = trailingSpaceMatch ? trailingSpaceMatch[0] : "";

    text = text.trim();

    if (text !== "") {
      if (annotations.code) text = md.inlineCode(text);
      if (annotations.bold) text = md.bold(text);
      if (annotations.italic) text = md.italic(text);
      if (annotations.strikethrough) text = md.strikethrough(text);
      if (annotations.underline) text = md.underline(text);
    }

    return leading_space + text + trailing_space;
  }
}
