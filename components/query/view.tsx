import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import Page from "../layouts/Page";
import { Source } from "../../types/Sources";
import { toast } from "react-toastify";
import _ from "lodash";
import Results from "./common/results";
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
import { Table } from "../../types/Table";
import { fetchColumns, fetchTables, fetchTablesAndColumns } from "./functions";
import InputLabel from "../individual/common/InputLabel";
import dateFormatter from "../../utils/dateFormatter";
import { useRouter } from "next/router";
import Button from "../individual/Button";
import { PencilIcon } from "@heroicons/react/outline";

interface Props {
  sources?: Source[];
}

const QueryView: React.FC<Props> = (props) => {
  const router = useRouter();
  // Type
  const [queryBuilder, setQueryBuilder] = useRecoilState(queryBuilderState);

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

  // Cancel requests
  const source = axios.CancelToken.source();

  // Error
  const [error, setError] = useState<string | undefined>();

  // Validate inputs
  const validateQuery = () => {
    // Validation
    if (!selectedSource || !body) {
      return false;
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
      console.log(e);
      toast.error("Something went wrong. Please check your query.");
      setQueryLoading(false);
      return;
    }
  };

  async function copyQuery() {
    try {
      let { data, error } = await supabase
        .from("queries")
        .insert({
          name: `Copy of ${name}`,
          database: selectedSource,
          body: body,
          publicQuery: false,
          user_id: user?.id,
          updated_at: new Date(Date.now()),
          query_vars: queryVars,
          query_filter_by: queryFilterBy,
          query_group_by: queryGroupBy,
          query_sort_by: querySortBy,
          query_limit: queryLimit,
          query_table:
            selectedTable && `${selectedTable?.schema}.${selectedTable?.name}`,
          org_id: user?.user_metadata.org_id,
          query_builder: queryBuilder,
        })
        .single();
      setName(`Copy of ${name}`);
      if (data) {
        router.push(`/queries/${data.id}`);
      }
      return;
    } catch (error: any) {
      toast.error("Failed to copy query");
    }
  }

  useEffect(() => {
    queryDb();
  }, []);

  return (
    <>
      <Page padding={false}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex flex-col p-4 space-y-2">
            <div className="flex flex-row  items-center justify-between">
              <p className="text-sm font-bold">Query details</p>
              <a
                onClick={() => router.push(`/queries/edit/${queryId}`)}
                href="#"
              >
                <PencilIcon className="block h-5 w-5 text-secondary-500" />
              </a>
            </div>
            <div className="flex flex-row  space-x-4">
              {props.sources && (
                <div className="flex flex-row space-x-2">
                  <InputLabel title="Source" />
                  <p className="text-sm">
                    {props.sources.find((s) => s.id === selectedSource)?.name}
                  </p>
                </div>
              )}
              <div className="flex flex-row space-x-2">
                <InputLabel title="Name" />
                <p className="text-sm">{name}</p>
              </div>
              {savedAt && (
                <div className="flex flex-row space-x-2">
                  <InputLabel title="Updated at" />
                  <p className="text-sm ">{`Last saved: ${dateFormatter({
                    dateVar: savedAt,
                    type: "time",
                  })}`}</p>
                </div>
              )}
            </div>
          </div>

          {/* Top bar */}

          <Results
            queryLoading={queryLoading}
            copyQuery={copyQuery}
            error={error}
          />
        </div>
      </Page>
    </>
  );
};

export default QueryView;
