import { useCallback, useEffect, useRef, useState } from "react";
import Loading from "../individual/Loading";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import Page from "../layouts/Page";
import { Source } from "../../types/Sources";
import TextInput from "../individual/TextInput";
import Select from "../individual/Select";
import Switch from "../individual/Switch";
import { toast, ToastContainer } from "react-toastify";
import { decrypt, encrypt } from "../../utils/encryption";
import { Column } from "../../types/Column";
import _ from "lodash";
import dateFormatter from "../../utils/dateFormatter";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import Tables from "./tables";
import Columnns from "./columns";
import Results from "./results";
import Editor from "./editor";

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
  const [publicQuery, setPublicQuery] = useState<boolean | undefined>(
    props.publicQuery || false
  );

  // Data
  const [fields, setFields] = useState<string[]>();
  const [data, setData] = useState<any | null>();
  const user = supabase.auth.user();

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
      const res = await axios.post("/api/user/postgres", {
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
          <div className="flex flex-col h-full px-2">
            {/* Top bar */}
            <div>
              <div className="grid grid-cols-2 gap-4 border-b border-zinc-400 pb-4 w-full items-end justify-between">
                <div className="flex flex-row justify-start items-start space-x-4 px-2">
                  {props.sources && (
                    <Select
                      title="Database"
                      value={selectedSource || ""}
                      id="database"
                      name="database"
                      setSelected={setSelectedSource}
                      options={props.sources.map((s) => {
                        return { name: s.name, value: s.id };
                      })}
                    />
                  )}
                  <TextInput
                    name="name"
                    id="name"
                    handleChange={setName}
                    label="Supabase"
                    value={name || ""}
                    type="text"
                    title="Name"
                    error={error?.name}
                  />
                  <Switch
                    setSelected={() => setPublicQuery(!publicQuery)}
                    value={publicQuery}
                    title={publicQuery ? "Public query" : "Private query"}
                    trueIcon={<EyeIcon />}
                    falseIcon={<EyeOffIcon />}
                  />
                </div>
                <div className="flex flex-row justify-end items-end">
                  {savedAt && !saving && (
                    <p className="text-sm">{`Last saved: ${dateFormatter({
                      dateVar: savedAt,
                      type: "time",
                    })}`}</p>
                  )}
                  {!savedAt && !saving && (
                    <p className="text-sm text-red-500">Changes not saved</p>
                  )}
                  {saving && <p className="text-sm">Saving...</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-10 h-full w-full gap-4 min-h-0 overflow-hidden">
              {/* Tables and columns */}
              <div className="col-span-2 flex flex-col  border-r border-zinc-400 pt-2 h-full w-full overflow-auto">
                <div className="flex flex-col w-full h-full  ">
                  <div className=" flex h-36 w-full overflow-auto">
                    <Tables
                      tables={tables}
                      selectedTable={selectedTable}
                      setSelectedTable={setSelectedTable}
                      tableLoading={tableLoading}
                    />
                  </div>

                  <div className="flex flex-col flex-1 h-full w-full p-2 overflow-auto">
                    <Columnns
                      columns={columns}
                      columnsLoading={columnsLoading}
                    />
                  </div>
                </div>
              </div>

              {/* EDITOR */}
              <div className="col-span-4 flex flex-col h-full pt-2">
                <Editor
                  body={body}
                  setBody={setBody}
                  queryDb={queryDb}
                  queryLoading={queryLoading}
                  stopQuery={() => source.cancel()}
                />
              </div>

              {/* RESULTS */}
              <div className="col-span-4 flex flex-col h-full w-full overflow-auto pt-2">
                <Results
                  data={data}
                  fields={fields}
                  queryLoading={queryLoading}
                  queryId={props.id}
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
