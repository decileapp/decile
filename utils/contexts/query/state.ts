import { atom, selector } from "recoil";
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

// Data source
export const savingState = atom<boolean>({
  key: "savingState",
  default: false,
});

// Data source
export const selectedSourceState = atom<string>({
  key: "selectedSource",
  default: "",
});

// Data source
export const sourceSchemaState = atom<Schema[] | undefined>({
  key: "souceSchema",
  default: undefined,
});

// Query details
export const queryIdState = atom<number | undefined>({
  key: "queryId",
  default: undefined,
});

export const queryUpdatedAtState = atom<Date | undefined>({
  key: "queryUpdatedAt",
  default: undefined,
});

export const bodyState = atom<string | undefined>({
  key: "body",
  default: "",
});

export const nameState = atom({
  key: "name",
  default: "",
});

export const publicQueryState = atom({
  key: "publicQuery",
  default: false,
});

export const tablesState = atom<Table[] | undefined>({
  key: "tables",
  default: [],
});

export const selectedTableState = atom<Table | undefined>({
  key: "selectedTable",
  default: undefined,
});

export const tableLoadingState = atom({
  key: "tableLoading",
  default: false,
});

export const columnsState = atom<Column[] | undefined>({
  key: "columns",
  default: [],
});

export const columnsLoadingState = atom({
  key: "columnsLoading",
  default: false,
});

export const fieldsState = atom<any | undefined>({
  key: "fields",
  default: undefined,
});

export const dataState = atom<any | undefined>({
  key: "data",
  default: undefined,
});

// Query builder details

export const queryVarsState = atom<QueryVar[]>({
  key: "queryVars",
  default: [],
});

export const queryFilterState = atom<FilterBy[]>({
  key: "queryFilter",
  default: [],
});

export const queryGroupByState = atom<GroupBy[]>({
  key: "queryGroupBy",
  default: [],
});

export const querySortByState = atom<SortBy[]>({
  key: "querySortBy",
  default: [],
});

export const queryLimitState = atom<string>({
  key: "queryLimit",
  default: "50",
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
      if (
        !filter.find((f) => f.var === "" || f.value === "" || f.operator === "")
      ) {
        query.filterBy = filter;
      }
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
