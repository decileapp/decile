import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import FormLayout from "../../components/layouts/FormLayout";
import TextInput from "../../components/individual/TextInput";
import Button from "../../components/individual/Button";
import Switch from "../../components/individual/Switch";
import { encrypt } from "../../utils/encryption";

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
}

const SourceForm: React.FC<Props> = (props) => {
  const router = useRouter();
  const [name, setName] = useState<string | undefined>(props.name);
  const [host, setHost] = useState<string | undefined>(props.host);
  const [database, setDatabase] = useState<string | undefined>(props.database);
  const [dbUser, setDbUser] = useState<string | undefined>(props.dbUser);
  const [password, setPassword] = useState<string | undefined>(props.password);
  const [port, setPort] = useState<number | undefined>(props.port);
  const [ssl, setSsl] = useState<boolean | undefined>(props.ssl || true);

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
        password: encrypt(password || ""),
        port: port,
        ssl: ssl,
        user_id: user?.id,
      };
      if (validateLink(input)) {
        let { data, error } = await supabase.from("sources").insert(input);
        if (data) {
          router.push("/sources");
        } else {
          console.log(error);
        }
      }

      return;
    } catch (error: any) {
      setLoading(false);
      alert("Something went wrong.");
    }
  }

  async function editSource() {
    try {
      setLoading(true);
      const input = {
        name: name,
        database: database,
        host: host,
        dbUser: dbUser,
        password: encrypt(password || ""),
        port: port,
        ssl: ssl,
        user_id: user?.id,
      };
      if (validateLink(input)) {
        let { data, error } = await supabase
          .from("sources")
          .update(input)
          .match({ user_id: user?.id, id: props.id });
        if (data) {
          router.push("/sources");
        } else {
          console.log(error);
        }
      }

      return;
    } catch (error: any) {
      setLoading(false);
      alert("Something went wrong.");
    }
  }

  return (
    <FormLayout
      pageLoading={loading}
      heading={props.id ? "Edit data source" : "New data source"}
    >
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
      <Switch setSelected={() => setSsl(!ssl)} value={ssl} title="SSL" />
      <div className="flex mt-2 justify-between">
        <a
          type="button"
          className="inline-flex items-center border border-transparent text-sm leading-4 font-medium rounded-md -500 "
          onClick={() => router.push("/sources")}
          href="#"
        >
          Back
        </a>
        <Button
          label="Save"
          onClick={() => (props.id ? editSource() : createSource())}
          type="primary"
        />
      </div>
    </FormLayout>
  );
};

export default SourceForm;
