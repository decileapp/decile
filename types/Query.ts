import { FilterBy, GroupBy, QueryVar, SortBy } from "../utils/query";

export interface Query {
  id: number;
  name: string;
  database?: string;
  body?: string;
  publicQuery: boolean;
  updated_at: Date;
  query_vars?: QueryVar[];
  query_filter_by?: FilterBy[];
  query_sort_by?: SortBy[];
  query_group_by?: GroupBy[];
  query_limit?: string;
  user_id: string;
}
