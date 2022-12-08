import { useEffect, useState } from "react";
import axios from "axios";
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
  textQueryState,
} from "../../utils/contexts/query/state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import QueryEditor from "./editor";
import { Table } from "../../types/Table";
import { fetchColumns, fetchTablesAndColumns } from "./functions";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

interface Props {
  sources?: Source[];
  selectedSourceId?: string;
  question?: string;
}

const QueryAsk: React.FC<Props> = (props) => {
  const { sources } = props;
  const router = useRouter();
  const supabase = useSupabaseClient();
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
  const [textQuery, setTextQuery] = useRecoilState(textQueryState);

  // Data
  const setFields = useSetRecoilState(fieldsState);
  const setData = useSetRecoilState(dataState);

  const user = useUser();

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
          body: body,
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

  async function updateQuery() {
    try {
      if (!queryId) return;
      let { data, error } = await supabase
        .from("queries")
        .update({
          name: name,
          database: selectedSource,
          body: body,
          public_query: publicQuery,
          user_id: user?.id,
          updated_at: new Date(Date.now()),
          query_table:
            selectedTable && `${selectedTable?.schema}.${selectedTable?.name}`,
          query_type: queryType,
          query_text: queryType === "ai" ? textQuery : "",
        })
        .match({ org_id: user?.user_metadata.org_id, id: queryId })
        .select("*")
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

  async function saveQuery() {
    try {
      let { data, error } = await supabase
        .from("queries")
        .insert({
          name: name,
          database: selectedSource,
          body: body,
          public_query: publicQuery,
          user_id: user?.id,
          updated_at: new Date(Date.now()),
          query_table:
            selectedTable && `${selectedTable?.schema}.${selectedTable?.name}`,
          query_type: queryType,
          org_id: user?.user_metadata.org_id,
          query_text: queryType === "ai" ? textQuery : "",
        })
        .select("*")
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

  useEffect(() => {
    if (props.selectedSourceId) {
      changeDatabase(props.selectedSourceId);
    }
    if (props.question) {
      setTextQuery(props.question);
    }
  }, []);

  // Edit
  return (
    <>
      <Page padding={false}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="grid grid-cols-10 h-full w-full min-h-0 overflow-hidden">
            {/* Tables and columns for SQL EDITOR */}
            {!queryBuilder && sources && (
              <div
                className="col-span-5
                    flex flex-col  border-r border-zinc-400 h-full w-full overflow-hidden"
              >
                <QueryEditor
                  queryDb={queryDb}
                  queryLoading={queryLoading}
                  stopQuery={() => source.cancel()}
                  changeTable={changeTable}
                  sources={sources}
                  changeDatabase={changeDatabase}
                />
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
                saveQuery={queryId ? updateQuery : saveQuery}
                error={error}
              />
            </div>
          </div>
        </div>
      </Page>
    </>
  );
};

export default QueryAsk;
