import { useCallback, useEffect, useRef, useState } from "react";
import Loading from "../individual/Loading";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import Page from "../layouts/Page";
import { Source } from "../../types/Sources";
import { toast, ToastContainer } from "react-toastify";
import { Column } from "../../types/Column";
import _ from "lodash";
import Results from "./common/results";
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
  queryVarsState,
  selectedSourceState,
  selectedTableState,
  tableLoadingState,
  tablesState,
} from "../../utils/contexts/query/state";
import { useRecoilState, useRecoilValue } from "recoil";
import QueryTopBar from "./common/Topbar";
import QueryEditor from "./editor";

interface Props {
  id?: string;
  name?: string;
  database?: string;
  body?: string;
  publicQuery?: boolean;
  user_id?: string;
  updated_at?: Date;
  sources?: Source[];
}

const QueryForm: React.FC<Props> = (props) => {
  // Type
  const [queryBuilder, setQueryBuilder] = useState(true);

  /* Global states */

  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);

  // Tables
  const [tables, setTables] = useRecoilState(tablesState);
  const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);
  const [tableLoading, setTableLoading] = useRecoilState(tableLoadingState);

  // Columns
  const [columns, setColumns] = useRecoilState(columnsState);
  const [columnsLoading, setColumnsLoading] =
    useRecoilState(columnsLoadingState);

  // Query
  const [name, setName] = useRecoilState(nameState);
  const [body, setBody] = useRecoilState(bodyState);
  const [publicQuery, setPublicQuery] = useRecoilState(publicQueryState);
  const [queryVars, setQueryVars] = useRecoilState(queryVarsState);

  // Data
  const [fields, setFields] = useRecoilState(fieldsState);
  const [data, setData] = useRecoilState(dataState);

  // Output of query builder
  const buildQuery = useRecoilValue(buildQueryState);

  const user = supabase.auth.user();

  /* Local states */

  const [loading, setLoading] = useState(true);
  const [queryLoading, setQueryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | undefined>(props.updated_at);

  // Error
  const [error, setError] = useState<Props>();

  // Cancel requests
  const source = axios.CancelToken.source();

  // Get tables
  const getTables = async () => {
    try {
      setTables(undefined);
      setTableLoading(true);
      if (!props.sources || !selectedSource) {
        return;
      }
      const selectedDb = props?.sources.find((s) => s.id === selectedSource);

      if (!selectedDb) return;

      const res = await axios.post("/api/user/postgres/get-tables", {
        ...selectedDb,
      });
      if (res) {
        setTables(res.data.tables);
        // Set first table
        if (res.data.tables && !selectedTable) {
          setSelectedTable(res.data.tables[0]);
        }
      }
      setTableLoading(false);
      return;
    } catch (e) {
      setTableLoading(false);
      return;
    }
  };

  // Get columns
  const getColumns = async () => {
    if (!props.sources || !selectedSource) {
      return;
    }

    try {
      setColumns(undefined);
      setColumnsLoading(true);
      const selectedDb = props?.sources.find((s) => s.id === selectedSource);

      if (!selectedDb || !tables || !selectedTable) return;
      const res = await axios.post("/api/user/postgres/get-columns", {
        ...selectedDb,
        table_schema: selectedTable.schema,
        table_name: selectedTable.name,
      });
      if (res.data.columns) {
        await setColumns(res.data.columns);
        await setQueryVars(
          res.data.columns.map((c: Column) => {
            return {
              name: c.name,
              type: c.type,
            };
          })
        );
      }
      setColumnsLoading(false);
      return;
    } catch (e) {
      setColumnsLoading(false);
      return;
    }
  };
  // Query
  const queryDb = async () => {
    setQueryLoading(true);
    if (!props.sources || !selectedSource) {
      setQueryLoading(false);
      toast.error("Please choose a database.");
      return;
    }
    try {
      setData(null);
      const selectedDb = props?.sources.find((s) => s.id === selectedSource);

      // If using query builder, get the latest query
      if (queryBuilder) {
        setBody(buildQuery);
      }

      if (!selectedDb) return;
      const res = await axios.post<{ rows: any[]; fields: any[]; error: any }>(
        "/api/user/postgres",
        {
          body: queryBuilder ? buildQuery : body,
          ...selectedDb,
          cancelToken: source.token,
        }
      );

      if (res.data.error) {
        toast.error(res.data.error);
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

  // Validate inputs
  const validateLink = (input: Props) => {
    const { name, database, body } = input;
    // Validation
    if (!name) {
      setError({ name: "Please enter a name" });
      return false;
    }

    if (!database) {
      setError({ database: "Please enter a database" });
      return false;
    }

    if (!body) {
      setError({ body: "Please enter a query" });
      return false;
    }

    return true;
  };

  async function editQuery(input: Props) {
    try {
      if (!props.id) return;

      let { data, error } = await supabase
        .from("queries")
        .update(input)
        .match({ org_id: user?.user_metadata.org_id, id: props.id })
        .single();
      if (data) {
        setSavedAt(data.updated_at);
      }
      return;
    } catch (error: any) {
      toast.error("Failed to save query");
    }
  }

  // Autosave
  const debouncedSave = useCallback(
    _.debounce(async (data: Props) => {
      await setSaving(true);
      await editQuery(data);
      await setSaving(false);
      return;
    }, 500),
    []
  );

  const initialLoad = async () => {
    setLoading(true);
    setTableLoading(true);
    setColumnsLoading(true);
    if (props.body) {
      await setBody(props.body);
    }
    if (props.publicQuery) {
      await setPublicQuery(props.publicQuery);
    }
    if (props.name) {
      await setName(props.name);
    }
    if (props.database) {
      await setSelectedSource(props.database);
    }
    if (tables && !selectedTable) {
      await setSelectedTable(tables[0]);
    }
    setLoading(false);
    setTableLoading(false);
    setColumnsLoading(false), [];
  };

  // Effects
  // On load update with query details
  useEffect(() => {
    initialLoad();
  }, []);

  // Change source
  useEffect(() => {
    if (selectedSource) {
      getTables();
    }
  }, [selectedSource]);

  // const updateTable = async () => {
  //   await getColumns();
  //   setFields(undefined);
  //   setData(undefined);

  //   // only query if in querybuilding mode
  //   if (queryBuilder && selectedTable) {
  //     await queryDb();
  //   }

  //   return;
  // };

  // When table changes
  useEffect(() => {
    if (selectedSource && selectedTable) {
      getColumns();
    }
  }, [selectedTable]);

  // Auto save
  useEffect(() => {
    if (name && body && !saving) {
      const input = {
        name: name,
        database: selectedSource,
        body: body,
        publicQuery: publicQuery,
        user_id: user?.id,
        updated_at: new Date(Date.now()),
      };
      if (validateLink(input)) {
        debouncedSave(input);
      }
    }
  }, [debouncedSave, name, selectedSource, body, publicQuery, selectedTable]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="dark"
        rtl={false}
        draggable
        pauseOnHover={false}
      />
      <Page padding={false}>
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Top bar */}
            {props.sources && props.sources.length > 0 && (
              <QueryTopBar
                name={name}
                setName={setName}
                savedAt={savedAt}
                saving={saving}
                publicQuery={publicQuery}
                setPublicQuery={setPublicQuery}
                queryBuilder={queryBuilder}
                setQueryBuilder={setQueryBuilder}
                sources={props.sources}
              />
            )}

            <div className="grid grid-cols-10 h-full w-full min-h-0 overflow-hidden">
              {/* Tables and columns for SQL EDITOR */}
              <div
                className={classNames(
                  queryBuilder ? "col-span-4" : "col-span-6",
                  "flex flex-col  border-r border-zinc-400 h-full w-full overflow-hidden"
                )}
              >
                {!queryBuilder && (
                  <QueryEditor
                    queryDb={queryDb}
                    queryLoading={queryLoading}
                    stopQuery={() => source.cancel()}
                  />
                )}

                {/* Query builder */}
                {queryBuilder && <QueryBuilder />}
              </div>

              {/* RESULTS */}
              <div
                className={classNames(
                  queryBuilder ? "col-span-6" : "col-span-4",
                  "flex flex-col h-full w-full overflow-auto"
                )}
              >
                <Results
                  queryLoading={queryLoading}
                  queryId={props.id}
                  queryDb={queryBuilder ? () => queryDb() : undefined}
                />
              </div>
            </div>
          </div>
        )}
      </Page>
    </>
  );
};

export default QueryForm;
