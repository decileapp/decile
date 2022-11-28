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
  "id" | "name" | "database" | "body" | "publicQuery" | "org_id" | "user_id"
> & {
  user: {
    id: string;
    email: string;
  };
  updated_at: Date;
};

async function getBasicQueries() {
  return await supabase
    .from("movies")
    .select(
      "id, name, database, body, publicQuery, updated_at, user_id(id, email), org_id"
    );
}
