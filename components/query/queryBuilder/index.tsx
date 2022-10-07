import { useCallback, useEffect, useRef, useState } from "react";
import Loading from "../../individual/Loading";
import axios from "axios";
import { supabase } from "../../../utils/supabaseClient";
import Page from "../../layouts/Page";
import { Source } from "../../../types/Sources";
import { toast, ToastContainer } from "react-toastify";
import { Column } from "../../../types/Column";
import _ from "lodash";
import Tables from "../tables";
import Results from "../results";
import Editor from "../editor";
import queryBuilder, {
  FilterBy,
  SortBy,
  Table,
  QueryVar,
} from "../../../utils/query";
import VariableSelector from "./QueryVariableSelector";
import Filter from "../Filter";
import QueryTopbar from "./QueryTopbar";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import MiniSelect from "../../individual/MiniSelect";
import QueryFilterSelector from "./QueryFilterSelector";

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

const QueryBuilder: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Databases
  const [selectedSource, setSelectedSource] = useState<string | undefined>(
    props.database
  );

  // Tables
  const [tables, setTables] = useState<string[]>();
  const [selectedTable, setSelectedTable] = useState<string>();

  // Columns
  const [columns, setColumns] = useState<Column[]>();

  // Query
  const [name, setName] = useState<string | undefined>(props.name);
  const [body, setBody] = useState<string | undefined>(props.body);
  const [prompt, setPrompt] = useState<string | undefined>();
  const [showQuery, setShowQuery] = useState(false);
  const [publicQuery, setPublicQuery] = useState<boolean | undefined>(
    props.publicQuery || false
  );

  // Data
  const [fields, setFields] = useState<string[]>();
  const [data, setData] = useState<any | null>();
  const user = supabase.auth.user();

  // Query building
  const [queryTables, setQueryTables] = useState<Table>();
  const [queryVars, setQueryVars] = useState<QueryVar[]>();
  const [queryGroupBy, setQueryGroupBy] = useState<string[]>();
  const [querySortBy, setQuerySortBy] = useState<SortBy[]>();
  const [queryFilterBy, setQueryFilterBy] = useState<FilterBy[]>([]);
  const [queryLimit, setQueryLimit] = useState<string>();

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

      const res = await axios.post("/api/postgres/get-tables", {
        ...selectedDb,
      });
      if (res) {
        setTables(res.data.tables);
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
      const res = await axios.post("/api/postgres/get-columns", {
        ...selectedDb,
        table: selectedTable,
      });
      if (res) {
        setColumns(res.data.columns);
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

      if (!selectedDb) return;
      const res = await axios.post("/api/postgres", {
        body: body,
        ...selectedDb,
        cancelToken: source.token,
      });
      if (res.data.error) {
        toast.error(res.data.error);
        setQueryLoading(false);
        return;
      }
      if (res) {
        setFields(res.data.result.fields.map((f: any) => f.name));
        setData(res.data.result.rows);
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

  // Effects
  useEffect(() => {
    if (selectedSource) {
      getTables();
    }
  }, [selectedSource]);

  useEffect(() => {
    if (selectedSource && selectedTable) {
      getColumns();
    }
  }, [selectedTable]);

  useEffect(() => {
    // Run only when name, database, body are available
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
  }, [debouncedSave, name, selectedSource, body, publicQuery]);

  // Update query
  const updateQuery = () => {
    if (!selectedTable) return;
    if (!queryVars) return;
    setQueryVars(queryVars);
    setBody(
      queryBuilder({
        vars: queryVars,
        limit: "50",
        tables: [{ name: selectedTable, join: "inner" }],
        filterBy: queryFilterBy,
      })
    );
    return;
  };

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
          <div className="flex flex-col h-full ">
            <div className="grid grid-cols-10 h-full w-full  min-h-0 overflow-hidden ">
              {/* Tables and columns */}
              <div className="col-span-2 flex flex-col  border-r pt-2  h-full w-full overflow-auto ">
                <div className="flex flex-col w-full h-full  divide-y border-zinc-400 ">
                  <div className=" flex h-36 w-full overflow-auto">
                    <Tables
                      tables={tables}
                      selectedTable={selectedTable}
                      setSelectedTable={setSelectedTable}
                      tableLoading={tableLoading}
                    />
                  </div>

                  <div className="flex flex-col flex-1 h=full w-full p-2 overflow-auto">
                    <VariableSelector
                      columns={columns}
                      columnsLoading={columnsLoading}
                      updateParent={updateQuery}
                    />
                  </div>
                </div>
              </div>

              {/* EDITOR */}
              <div className="col-span-8 flex flex-1 flex-col h-full w-full  overflow-scroll   divide-y border-zinc-400">
                {/* <QueryTopbar
                  selectedSource={selectedSource}
                  setSelectedSource={setSelectedSource}
                  sources={props.sources}
                  name={name}
                  setName={setName}
                  publicQuery={publicQuery}
                  setPublicQuery={setPublicQuery}
                  savedAt={savedAt}
                  saving={saving}
                  error={error?.name}
                  run={true}
                  runFunc={queryDb}
                /> */}
                {/* {!showQuery && (
                    <div className="col-span-4 flex flex-col h-full p-2">
                      <Editor
                        body={body}
                        setBody={setBody}
                        queryLoading={queryLoading}
                        stopQuery={() => source.cancel()}
                      />
                    </div>
                  )} */}
                {queryVars && (
                  <QueryFilterSelector
                    queryFilterBy={queryFilterBy}
                    setQueryFilterBy={setQueryFilterBy}
                    queryVars={queryVars}
                    updateQuery={updateQuery}
                  />
                )}

                <p>{body}</p>

                {/* <Results
                  data={data}
                  fields={fields}
                  queryLoading={queryLoading}
                  queryId={props.id}
                /> */}
              </div>
            </div>
          </div>
        )}
      </Page>
    </>
  );
};

export default QueryBuilder;
