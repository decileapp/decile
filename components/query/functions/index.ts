import { Source } from "../../../types/Sources";
import axios from "axios";
import { Column } from "../../../types/Column";
import { Table } from "../../../types/Table";
import { Schema } from "../../../types/Schema";

// TABLES
export const fetchTables = async (x: Source) => {
  try {
    const res = await axios.post<{ tables: Table[] }>(
      "/api/user/postgres/get-tables",
      {
        ...x,
      }
    );
    return res.data.tables;
  } catch (e) {
    throw new Error("Failed to fetch tables.");
  }
};

// COLUMNS
export const fetchColumns = async ({
  database,
  table,
}: {
  database: Source;
  table: Table;
}) => {
  try {
    const res = await axios.post<{ columns: Column[] }>(
      "/api/user/postgres/get-columns",
      {
        ...database,
        table_schema: table.schema,
        table_name: table.name,
      }
    );
    return res.data.columns;
  } catch (e) {
    throw new Error("Failed to fetch columns.");
  }
};

// SCHEMA
export const fetchTablesAndColumns = async (database: Source) => {
  try {
    const res = await axios.post<{ schema: Schema[] }>(
      `/api/user/postgres/get-schema`,
      {
        ...database,
      }
    );
    return res.data.schema;
  } catch (e) {
    throw new Error("Failed to fetch tables and columns.");
  }
};
