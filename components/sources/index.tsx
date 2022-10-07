import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import FormLayout from "../layouts/FormLayout";
import TextInput from "../individual/TextInput";
import Button from "../individual/Button";
import Switch from "../individual/Switch";
import { encrypt } from "../../utils/encryption";
import { toast } from "react-toastify";
import axios from "axios";
import MiniLoading from "../individual/MiniLoading";

interface Props {
  id?: string;
  name?: string;
  database?: string;
  host?: string;
  dbUser?: string;
  password?: string;
  port?: number;
  ssl?: boolean;
  user_id?: string;
  org_id?: string;
}

const SourceForm: React.FC<Props> = (props) => {
  const router = useRouter();
  const [name, setName] = useState<string | undefined>(props.name);
  const [host, setHost] = useState<string | undefined>(props.host);
  const [database, setDatabase] = useState<string | undefined>(props.database);
  const [dbUser, setDbUser] = useState<string | undefined>(props.dbUser);
  const [password, setPassword] = useState<string | undefined>();
  const [port, setPort] = useState<number | undefined>(props.port);
  const [ssl, setSsl] = useState<boolean | undefined>(props.ssl || true);
  const [checkingDb, setCheckingDb] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Props>();

  const user = supabase.auth.user();

  const validateLink = (input: Props) => {
    const { name, database, host, dbUser, password, port } = input;
    // Validation
    if (!name) {
      setError({ name: "Please enter a name" });
      return false;
    }

    if (!database) {
      setError({ database: "Please enter a database" });
      return false;
    }

    if (!dbUser) {
      setError({ dbUser: "Please enter a user" });
      return false;
    }

    if (!password) {
      setError({ password: "Please enter a password" });
      return false;
    }

    if (!port) {
      setError({ port: 1 });
      return false;
    }

    if (!host) {
      setError({ host: "Please enter a host" });
      return false;
    }

    return true;
  };

  async function createSource() {
    try {
      setLoading(true);
      const input = {
        name: name,
        database: database,
        host: host,
        dbUser: dbUser,
        password: password,
        port: port,
        ssl: ssl,
        user_id: user?.id,
        org_id: user?.user_metadata.org_id,
      };
      if (validateLink(input)) {
        const res = await axios.post("/api/admin/sources", { ...input });
        const { data } = res;
        if (data) {
          router.push("/sources");
        }
      }

      return;
    } catch (error: any) {
      setLoading(false);
      toast.error("Failed to save changes. Please check your credentials.");
    }
  }

  async function editSource() {
    try {
      setLoading(true);
      const input = {
        id: props.id,
        name: name,
        database: database,
        host: host,
        dbUser: dbUser,
        password: password,
        port: port,
        ssl: ssl,
        user_id: user?.id,
        org_id: user?.user_metadata.org_id,
      };
      if (validateLink(input)) {
        const res = await axios.patch("/api/admin/sources", { ...input });
        const { data } = res;

        if (data) {
          router.push("/sources");
        }
      }

      return;
    } catch (error: any) {
      setLoading(false);
      toast.error("Failed to save changes. Please check your credentials.");
    }
  }

  return (
    <FormLayout
      pageLoading={loading}
      heading={props.id ? "Edit data source" : "New data source"}
    >
      {props.id && (
        <p className="text-sm">
          Please re-enter your password to save changes.
        </p>
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
        name="host"
        id="host"
        handleChange={setHost}
        label="db.djhjnxajtkzzzsdfsoqiwtexgwd.supabase.co"
        value={host || ""}
        type="text"
        title="Host"
        error={error?.host}
      />
      <TextInput
        name="dbUser"
        id="dbUser"
        handleChange={setDbUser}
        label="johndoe"
        value={dbUser || ""}
        type="text"
        title="Username"
        error={error?.dbUser}
      />
      <TextInput
        name="password"
        id="password"
        handleChange={setPassword}
        label="passwordprotected"
        value={password || ""}
        type="password"
        title="Password"
        error={error?.password}
      />
      <TextInput
        name="database"
        id="database"
        handleChange={setDatabase}
        label="orders"
        value={database || ""}
        type="text"
        title="Database"
        error={error?.database}
      />
      <TextInput
        name="port"
        id="port"
        handleChange={(e) => setPort(Number(e))}
        label="5432"
        value={port || ""}
        type="text"
        title="Port"
        error={error?.port === 1 ? "Please enter port." : ""}
      />
      <Switch
        setSelected={() => setSsl(!ssl)}
        value={ssl}
        title={ssl ? "SSL on" : "SSL off"}
      />
      <div className="flex mt-2 justify-between">
        <a
          type="button"
          className="inline-flex items-center border border-transparent text-sm leading-4 font-medium rounded-md -500 "
          onClick={() => router.push("/sources")}
          href="#"
        >
          Back
        </a>
        {checkingDb ? (
          <MiniLoading />
        ) : (
          <Button
            label="Save"
            onClick={() => (props.id ? editSource() : createSource())}
            type="primary"
          />
        )}
      </div>
    </FormLayout>
  );
};

export default SourceForm;
