import { FilterBy, GroupBy, QueryVar, SortBy } from "../utils/query";
import { supabase } from "../utils/supabaseClient";
import { Database } from "./database.types";

export type Query = Database["public"]["Tables"]["queries"]["Row"] & {
  query_vars?: QueryVar[];
  query_filter_by?: FilterBy[];
  query_sort_by?: SortBy[];
  query_group_by?: GroupBy[];
  user_id: {
    id: string;
    email: string;
  };
  updated_at: Date;
};

export type BasicQuery = Pick<
  Database["public"]["Tables"]["queries"]["Row"],
  | "id"
  | "name"
  | "database"
  | "body"
  | "public_query"
  | "org_id"
  | "user_id"
  | "query_type"
> & {
  user: {
    id: string;
    email: string;
  };
  updated_at: Date;
};

export type QueryWithDatabase = Pick<
  Database["public"]["Tables"]["queries"]["Row"],
  "id" | "name" | "database" | "body" | "public_query" | "org_id" | "user_id"
> &
  Database["public"]["Tables"]["sources"]["Row"];
