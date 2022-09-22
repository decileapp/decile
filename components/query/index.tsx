import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Loading from "../individual/Loading";
import axios from "axios";
import Button from "../individual/Button";
import TableShell from "../individual/table/shell";
import Editor from "@monaco-editor/react";
import { supabase } from "../../utils/supabaseClient";
import Page from "../layouts/Page";
import { Source } from "../../types/Sources";
import TextInput from "../individual/TextInput";
import Select from "../individual/Select";
import Switch from "../individual/Switch";
import { toast, ToastContainer } from "react-toastify";
import { decrypt, encrypt } from "../../utils/encryption";
import { Column } from "../../types/Column";
import InputLabel from "../individual/common/InputLabel";
import _ from "lodash";
import dateFormatter from "../../utils/dateFormatter";
import { classNames } from "../../utils/classnames";
import MiniLoading from "../individual/MiniLoading";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import TableHeader from "../individual/table/header";

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

  // Query ID (for editing)
  const [queryId, setQueryId] = useState<string | undefined>(props.id);

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

  const router = useRouter();

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

      const decrypted = decrypt(selectedDb?.password || "");

      const res = await axios.post("/api/postgres/get-tables", {
        ...selectedDb,
        special: decrypted,
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
        special: decrypt(selectedDb?.password || ""),
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
      toast.error("Please select a source.");
      return;
    }

    try {
      setData(null);
      const selectedDb = props?.sources.find((s) => s.id === selectedSource);

      if (!selectedDb) return;

      const res = await axios.post("/api/postgres", {
        body: body,
        ...selectedDb,
        special: decrypt(selectedDb?.password || ""),
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

  async function createQuery(input: Props) {
    try {
      setSaving(true);
      let { data, error } = await supabase
        .from("queries")
        .insert(input)
        .single();

      if (data) {
        setSavedAt(data.updated_at);
        setQueryId(data.id);
      }
      setSaving(false);
      return;
    } catch (error: any) {
      toast.error("Failed to save query");
      setSaving(false);
    }
  }

  async function editQuery(input: Props) {
    try {
      setSaving(true);
      let { data, error } = await supabase
        .from("queries")
        .update(input)
        .match({ user_id: user?.id, id: props.id })
        .single();
      if (data) {
        setSavedAt(data.updated_at);
      }
      setSaving(false);
      return;
    } catch (error: any) {
      toast.error("Failed to save query");
      setSaving(false);
    }
  }

  // Autosave
  const debouncedSave = useCallback(
    _.debounce(async (data: Props) => {
      queryId ? await editQuery(data) : createQuery(data);
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
    if (name && selectedSource && body && !saving) {
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
          <div className="flex flex-col h-full">
            <div>
              <div className="flex flex-row flex-1 space-x-4 border-b border-zinc-400 pb-4 w-full items-end justify-between px-2">
                <div className="flex flex-row justify-start items-start space-x-4">
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
                  {saving && <p className="text-sm">Saving...</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-9 gap-4  h-full">
              <div className="col-span-1 flex flex-col flex-1 h-full w-full border-r border-zinc-400 pt-2">
                <div className="grid grid-rows-6 grid-flow-col w-full h-full">
                  <div className="row-span-2 flex flex-col justify-start border-b border-zinc-400 px-2">
                    <InputLabel title="Tables" />
                    <div className="mt-2">
                      {tables && tables.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 overflow-auto">
                          {tables.map((c, id) => {
                            return (
                              <p
                                className={classNames(
                                  c === selectedTable
                                    ? "bg-primary-200 dark:bg-primary-500"
                                    : "",
                                  "border p-1 rounded-lg text-sm truncate"
                                )}
                                onClick={() => setSelectedTable(c)}
                                key={id}
                              >
                                {c}
                              </p>
                            );
                          })}
                        </div>
                      )}
                      {tableLoading && <MiniLoading />}
                    </div>
                  </div>

                  <div className="row-span-4 flex flex-col overflow-auto p-2">
                    <InputLabel title="Fields" />
                    <div className="mt-2">
                      {columns && columns.length > 0 && (
                        <div className="grid grid-cols-1 gap-2">
                          {columns.map((c, id) => {
                            return (
                              <div className="flex flex-row space-x-1 justify-between items-center  key={id} border p-1 rounded-lg">
                                <p className=" text-sm truncate">{c.name}</p>
                                <p
                                  className=" text-xs truncate italic"
                                  key={id}
                                >
                                  {c.type}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {columnsLoading && <MiniLoading />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex flex-col flex-1 h-full w-full space-y-4 pt-2">
                <div className="flex flex-row items-start justify-between w-full">
                  <InputLabel title="Query" />
                  <Button
                    label="Run"
                    onClick={() => queryDb()}
                    type="secondary"
                  />
                </div>

                <Editor
                  theme="vs-dark"
                  defaultLanguage="sql"
                  defaultValue="select * from users limit 10;"
                  onChange={(evn) => setBody(evn)}
                />
              </div>

              <div className="col-span-4 flex flex-col flex-1 place-self-center h-full w-full overflow-auto pt-2">
                <InputLabel title="Results" />
                {queryLoading && <Loading />}
                {fields && data && !queryLoading && (
                  <TableShell>
                    <TableHeader labels={fields} />

                    <tbody className="divide-y divide-gray-200 ">
                      {data.map((row: any, id: number) => {
                        return (
                          <tr key={id}>
                            {Object.keys(row).map((value, id) => {
                              return (
                                <td
                                  className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6"
                                  key={id}
                                >
                                  {row[value]}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </TableShell>
                )}
              </div>
            </div>
          </div>
        )}
      </Page>
    </>
  );
};

export default QueryForm;
