import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";
import { Column } from "../../../types/Column";
import { Schema } from "../../../types/Schema";
import { Table } from "../../../types/Table";
import queryBuilder, {
  FilterBy,
  GroupBy,
  QueryInputs,
  QueryVar,
  SortBy,
} from "../../query";

const { persistAtom } = recoilPersist();

export const savingState = atom<boolean>({
  key: "saving",
  default: false,
  effects: [persistAtom],
});

export const queryTypeState = atom<string>({
  key: "queryType",
  default: "ai",
  effects: [persistAtom],
});

// Data source
export const selectedSourceState = atom<string | undefined>({
  key: "selectedSource",
  default: undefined,
  effects: [persistAtom],
});

// Data source
export const sourceSchemaState = atom<Schema[] | undefined>({
  key: "souceSchema",
  default: undefined,
  effects: [persistAtom],
});

// Query details
export const queryIdState = atom<string | undefined>({
  key: "queryId",
  default: undefined,
  effects: [persistAtom],
});

export const queryUpdatedAtState = atom<Date | undefined>({
  key: "queryUpdatedAt",
  default: undefined,
  effects: [persistAtom],
});

// Sql query
export const bodyState = atom<string | undefined>({
  key: "body",
  default: "",
  effects: [persistAtom],
});

// Text to sql query
export const textQueryState = atom<string | undefined>({
  key: "textQuery",
  default: "",
  effects: [persistAtom],
});

export const nameState = atom({
  key: "name",
  default: "",
  effects: [persistAtom],
});

export const publicQueryState = atom({
  key: "publicQuery",
  default: false,
  effects: [persistAtom],
});

export const tablesState = atom<Table[] | undefined>({
  key: "tables",
  default: [],
  effects: [persistAtom],
});

export const selectedTableState = atom<Table | undefined>({
  key: "selectedTable",
  default: undefined,
  effects: [persistAtom],
});

export const tableLoadingState = atom({
  key: "tableLoading",
  default: false,
  effects: [persistAtom],
});

export const columnsState = atom<Column[] | undefined>({
  key: "columns",
  default: [],
  effects: [persistAtom],
});

export const columnsLoadingState = atom({
  key: "columnsLoading",
  default: false,
  effects: [persistAtom],
});

export const fieldsState = atom<any | undefined>({
  key: "fields",
  default: undefined,
  effects: [persistAtom],
});

export const dataState = atom<any | undefined>({
  key: "data",
  default: undefined,
  effects: [persistAtom],
});

// Query builder details

export const queryVarsState = atom<QueryVar[]>({
  key: "queryVars",
  default: [],
  effects: [persistAtom],
});

export const queryFilterState = atom<FilterBy[]>({
  key: "queryFilter",
  default: [],
  effects: [persistAtom],
});

export const queryGroupByState = atom<GroupBy[]>({
  key: "queryGroupBy",
  default: [],
  effects: [persistAtom],
});

export const querySortByState = atom<SortBy[]>({
  key: "querySortBy",
  default: [],
  effects: [persistAtom],
});

export const queryLimitState = atom<string>({
  key: "queryLimit",
  default: "50",
  effects: [persistAtom],
});

export const queryBuilderState = selector({
  key: "queryBuilder",
  get: ({ get }) => {
    const queryType = get(queryTypeState);
    return queryType === "query_builder";
  },
});

export const buildQueryState = selector({
  key: "buildQuery",
  get: ({ get }) => {
    const table = get(selectedTableState);

    const vars = get(queryVarsState);
    const filter = get(queryFilterState);
    const groupby = get(queryGroupByState);
    const sort = get(querySortByState);
    const limit = get(queryLimitState);

    // Validate
    if (!table) return;
    if (!vars) return;

    let query: QueryInputs;
    query = {
      vars: vars,
      tables: [{ name: table.name, join: "inner" }],
      limit: limit,
    };

    // Filter
    if (filter && filter.length > 0) {
      query.filterBy = filter;
    }

    // Group by
    if (groupby.length > 0) {
      if (!groupby.find((g) => g.name === "" || g.function === "")) {
        query.groupBy = groupby;
      }
    }

    // Sort
    if (sort.length > 0) {
      if (!sort.find((s) => s.name === "" || s.type === "")) {
        query.sortBy = sort;
      }
      query.sortBy = sort;
    }
    return queryBuilder(query);
  },
});
