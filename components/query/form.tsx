import { useState } from "react";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import Page from "../layouts/Page";
import { Source } from "../../types/Sources";
import { toast } from "react-toastify";
import _ from "lodash";
import Results from "./common/results/QueryResults";
import QueryBuilder from "./builder";
import { classNames } from "../../utils/classnames";
import {
  bodyState,
  buildQueryState,
  columnsLoadingState,
  columnsState,
  dataState,
  fieldsState,
  nameState,
  publicQueryState,
  queryBuilderState,
  queryFilterState,
  queryGroupByState,
  queryIdState,
  queryLimitState,
  querySortByState,
  queryTypeState,
  queryUpdatedAtState,
  queryVarsState,
  savingState,
  selectedSourceState,
  selectedTableState,
  sourceSchemaState,
  tableLoadingState,
  tablesState,
} from "../../utils/contexts/query/state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import QueryTopBar from "./common/topbar";
import QueryEditor from "./editor";
import { Table } from "../../types/Table";
import { fetchColumns, fetchTables, fetchTablesAndColumns } from "./functions";
import { useRouter } from "next/router";

interface Props {
  sources?: Source[];
}

const QueryForm: React.FC<Props> = (props) => {
  const router = useRouter();
  // Type
  const queryType = useRecoilValue(queryTypeState);
  const queryBuilder = useRecoilValue(queryBuilderState);

  /* Global states */
  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);
  const setSelectedSchema = useSetRecoilState(sourceSchemaState);

  // Tables
  const setTables = useSetRecoilState(tablesState);
  const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);
  const setTableLoading = useSetRecoilState(tableLoadingState);

  // Columns
  const setColumns = useSetRecoilState(columnsState);
  const setColumnsLoading = useSetRecoilState(columnsLoadingState);

  // Query
  const queryId = useRecoilValue(queryIdState);
  const [name, setName] = useRecoilState(nameState);
  const [body, setBody] = useRecoilState(bodyState);
  const publicQuery = useRecoilValue(publicQueryState);
  const [savedAt, setSavedAt] = useRecoilState(queryUpdatedAtState);
  const [queryVars, setQueryVars] = useRecoilState(queryVarsState);
  const [queryFilterBy, setQueryFilterBy] = useRecoilState(queryFilterState);
  const [queryGroupBy, setQueryGroupBy] = useRecoilState(queryGroupByState);
  const [querySortBy, setQuerySortBy] = useRecoilState(querySortByState);
  const [queryLimit, setQueryLimit] = useRecoilState(queryLimitState);

  // Data
  const setFields = useSetRecoilState(fieldsState);
  const setData = useSetRecoilState(dataState);

  // Output of query builder
  const buildQuery = useRecoilValue(buildQueryState);

  const user = supabase.auth.user();

  /* Local states */
  const [queryLoading, setQueryLoading] = useState(false);
  const [saving, setSaving] = useRecoilState(savingState);

  // Cancel requests
  const source = axios.CancelToken.source();

  // Error
  const [error, setError] = useState<string | undefined>();

  // SOURCES
  const changeDatabase = async (x: string) => {
    setTableLoading(true);
    setColumnsLoading(true);

    // Clear everything
    setSelectedTable(undefined);
    setColumns([]);
    setQueryVars([]);
    setQueryFilterBy([]);
    setQueryGroupBy([]);
    setQuerySortBy([]);
    setQueryLimit("50");

    // Change source
    await setSelectedSource(x);
    if (props.sources) {
      const foundSource = props.sources.find((s) => s.id === x);
      if (foundSource) {
        const tablesAndColumns = await fetchTablesAndColumns(foundSource);

        if (tablesAndColumns) {
          setSelectedSchema(tablesAndColumns);
          const tables = tablesAndColumns.map((t) => {
            return { name: t.name, schema: t.schema };
          });
          setTables(tables);
        }
      }
    }

    setTableLoading(false);
    setColumnsLoading(false);

    return;
  };

  // Change table
  const changeTable = async (x: Table) => {
    setColumnsLoading(true);
    await setSelectedTable(x);

    // Clear variables
    setQueryVars([]);
    setQueryFilterBy([]);
    setQueryGroupBy([]);
    setQuerySortBy([]);
    setQueryLimit("50");

    // Get columns
    if (props.sources) {
      const foundSource = props.sources.find((s) => s.id === selectedSource);
      if (foundSource) {
        const columns = await fetchColumns({ database: foundSource, table: x });
        setColumns(columns);
      }
    }

    setColumnsLoading(false);
    return;
  };

  // Validate inputs
  const validateQuery = () => {
    // Validation
    if (!selectedSource) {
      toast.error("Please choose a database.");
      return false;
    }

    // if query builder
    if (queryBuilder) {
      if (!selectedTable) {
        toast.error("Please choose a table.");
        return false;
      }

      if (queryVars.length === 0) {
        toast.error("No variables selected");
        return false;
      }

      // Check no filters are empty
      if (queryFilterBy.length > 0) {
        const badFilters = queryFilterBy.find(
          (q) =>
            !q.combo ||
            !q.operator ||
            !q.var ||
            (q.operator !== "=" && q.operator !== "!=" && q.value === "") // blank values only allowed for these operators
        );

        if (badFilters) {
          toast.error("Please check your filters.");
          return false;
        }
      }

      // Check no summarise is empty
      if (queryGroupBy.length > 0) {
        const badGroupBy = queryGroupBy.find((q) => !q.name || !q.function);
        if (badGroupBy) {
          toast.error("Please check your summarise fields.");
          return false;
        }
      }

      // Check sort by is not empty
      if (querySortBy.length > 0) {
        const badSort = querySortBy.find((q) => !q.name || !q.type);
        if (badSort) {
          toast.error("Please check your sort fields.");
          return false;
        }
      }
    } else {
      if (!body) {
        toast.error("Please enter a query.");
        return false;
      }
    }

    return true;
  };

  // Query
  const queryDb = async () => {
    setError(undefined);
    setQueryLoading(true);
    if (!validateQuery()) {
      setQueryLoading(false);
      return;
    }

    if (!props.sources) {
      return;
    }

    if (props.sources.length === 0) {
      return;
    }

    try {
      setData(null);
      const selectedDb = props?.sources.find((s) => s.id === selectedSource);

      if (!selectedDb) {
        toast.error("Database not found.");
      }
      const res = await axios.post<{ rows: any[]; fields: any[]; error: any }>(
        "/api/user/postgres",
        {
          body: queryBuilder ? buildQuery : body,
          ...selectedDb,
          cancelToken: source.token,
        }
      );
      if (res.data.error) {
        toast.error("Something went wrong.");
        setError(res.data.error);
        setQueryLoading(false);
        return;
      }

      if (res.data.fields && res.data.rows) {
        const fields: string[] = res.data.fields.map((f: any) => f.name);
        const rows: {}[] = res.data.rows;
        setFields(fields);
        setData(rows);
      }
      setQueryLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong. Please check your query.");
      setQueryLoading(false);
      return;
    }
  };

  async function saveQuery() {
    try {
      if (!queryId) return;
      setSaving(true);
      let { data, error } = await supabase
        .from("queries")
        .update({
          name: name,
          database: selectedSource,
          body: queryBuilder ? buildQuery : body,
          publicQuery: publicQuery,
          user_id: user?.id,
          updated_at: new Date(Date.now()),
          query_vars: queryVars,
          query_filter_by: queryFilterBy,
          query_group_by: queryGroupBy,
          query_sort_by: querySortBy,
          query_limit: queryLimit,
          query_table:
            selectedTable && `${selectedTable?.schema}.${selectedTable?.name}`,
          query_type: queryType,
        })
        .match({ org_id: user?.user_metadata.org_id, id: queryId })
        .single();
      if (data) {
        setSavedAt(data.updated_at);
        router.push(`/queries/view/${data.id}`);
      }
      setSaving(false);
      return;
    } catch (error: any) {
      setSaving(false);
      toast.error("Failed to save query");
      return;
    }
  }

  // Edit
  return (
    <>
      <Page padding={false}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top bar */}
          {props.sources && props.sources.length > 0 && (
            <QueryTopBar
              sources={props.sources}
              changeDatabase={changeDatabase}
            />
          )}

          <div className="grid grid-cols-10 h-full w-full min-h-0 overflow-hidden">
            {/* Tables and columns for SQL EDITOR */}
            {!queryBuilder && (
              <div
                className="col-span-5
                    flex flex-col  border-r border-zinc-400 h-full w-full overflow-hidden"
              >
                <QueryEditor
                  queryDb={queryDb}
                  queryLoading={queryLoading}
                  stopQuery={() => source.cancel()}
                  changeTable={changeTable}
                />
              </div>
            )}
            {/* Query builder */}
            {queryBuilder && (
              <div className="col-span-3 flex flex-col  border-r border-zinc-400 h-full w-full overflow-hidden">
                <QueryBuilder changeTable={changeTable} />
              </div>
            )}

            {/* RESULTS */}
            <div
              className={classNames(
                queryBuilder ? "col-span-7" : "col-span-5",
                "flex flex-col h-full w-full overflow-hidden"
              )}
            >
              <Results
                queryLoading={queryLoading}
                queryDb={queryBuilder ? () => queryDb() : undefined}
                saveQuery={saveQuery}
                error={error}
              />
            </div>
          </div>
        </div>
      </Page>
    </>
  );
};

export default QueryForm;
