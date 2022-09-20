import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../individual/Loading";
import axios from "axios";
import Button from "../../components/individual/Button";
import TableShell from "../../components/individual/Table";
import Editor from "@monaco-editor/react";
import { supabase } from "../../utils/supabaseClient";
import Page from "../layouts/Page";
import { Source } from "../../types/Sources";
import TextInput from "../individual/TextInput";
import Select from "../individual/Select";
import Switch from "../individual/Switch";
import { toast, ToastContainer } from "react-toastify";
import { decrypt, encrypt } from "../../utils/encryption";

interface Props {
  id?: string;
  name?: string;
  database?: string;
  body?: string;
  tags?: string;
  publicQuery?: boolean;
  user_id?: string;
  sources?: Source[];
}

const QueryForm: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);

  // Databases
  const [selectedSource, setSelectedSource] = useState<string | undefined>(
    props.database
  );

  // Query
  const [name, setName] = useState<string | undefined>(props.name);
  const [body, setBody] = useState<string | undefined>(props.body);
  const [tags, setTags] = useState<string | undefined>(props.tags);
  const [publicQuery, setPublicQuery] = useState<boolean | undefined>(
    props.publicQuery || false
  );

  // Data
  const [fields, setFields] = useState<string[]>();
  const [data, setData] = useState<any>();
  const user = supabase.auth.user();

  // Error
  const [error, setError] = useState<Props>();

  const router = useRouter();
  const queryDb = async () => {
    setQueryLoading(true);
    if (!props.sources || !selectedSource) {
      setQueryLoading(false);
      toast.error("Please select a source.");
      return;
    }

    try {
      const selectedDb = props?.sources.find((s) => s.id === selectedSource);

      if (!selectedDb) return;

      const res = await axios.post("/api/postgres", {
        body: body,
        ...selectedDb,
        special: decrypt(selectedDb?.password || ""),
      });
      if (res) {
        setFields(res.data.result.fields.map((f: any) => f.name));
        setData(res.data.result.rows);
      }
      setQueryLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong. Please check your query.");
      setQueryLoading(false);
      return;
    }
  };

  const validateLink = (input: Props) => {
    const { name, database, body, tags, publicQuery } = input;
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

  async function createQuery() {
    try {
      setLoading(true);
      const input = {
        name: name,
        database: selectedSource,
        body: body,
        tags: tags,
        publicQuery: publicQuery,
        user_id: user?.id,
      };
      if (validateLink(input)) {
        let { data, error } = await supabase.from("queries").insert(input);
        if (data) {
          router.push("/queries");
        } else {
          console.log(error);
        }
      }

      setLoading(false);
      return;
    } catch (error: any) {
      alert("Something went wrong.");
    }
  }

  async function editQuery() {
    try {
      setLoading(true);
      const input = {
        name: name,
        database: selectedSource,
        body: body,
        tags: tags,
        publicQuery: publicQuery,
        user_id: user?.id,
      };
      if (validateLink(input)) {
        let { data, error } = await supabase
          .from("queries")
          .update(input)
          .match({ user_id: user?.id, id: props.id });
        if (data) {
          router.push("/queries");
        } else {
          console.log(error);
        }
      }

      setLoading(false);
      return;
    } catch (error: any) {
      alert("Something went wrong.");
    }
  }

  const getData = async () => {
    const data = await supabase.from("sources").select("*");
    return;
  };

  useEffect(() => {
    getData();
  });

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
      <Page>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="flex flex-row space-x-4 mb-2 border-b border-zinc-300 pb-4 w-full  justify-between">
              <div className="flex flex-row justify-start items-end space-x-4">
                {props.sources && (
                  <Select
                    title="Select database"
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
                <TextInput
                  name="tags"
                  id="tags"
                  handleChange={setTags}
                  label="Orders, monthly"
                  value={tags || ""}
                  type="text"
                  title="Tags"
                  error={error?.tags}
                />
                <Switch
                  setSelected={() => setPublicQuery(!publicQuery)}
                  value={publicQuery}
                  title={publicQuery ? "Public query" : "Private query"}
                />
              </div>
              <div className="flex flex-row justify-end items-end">
                <Button
                  label="Save"
                  onClick={() => (props.id ? editQuery() : createQuery())}
                  type="primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col flex-1 place-self-center h-full w-full space-y-4">
                <p className="text-lg">Query</p>

                <Editor
                  height="50vh"
                  theme="vs-dark"
                  defaultLanguage="sql"
                  defaultValue="select * from users limit 10;"
                  onChange={(evn) => setBody(evn)}
                />

                <div className="flex flex-col items-end justify-center w-full">
                  <Button
                    label="Query"
                    onClick={() => queryDb()}
                    type="primary"
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1 place-self-center h-full w-full ">
                <p className="text-lg">Results</p>
                {queryLoading && <Loading />}
                {fields && data && !queryLoading && (
                  <TableShell>
                    <thead className="">
                      <tr>
                        {fields.map((r: any) => {
                          return (
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-6 text-zinc-500"
                            >
                              {r}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>

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
