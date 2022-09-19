import SourceForm from "../../components/forms/source";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSupabase } from "../../utils/supabaseClient";
import { Source } from "../../types/Sources";
import Loading from "../../components/individual/Loading";
import { useUser } from "@auth0/nextjs-auth0";

const EditSource: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<Source>();
  const { user } = useUser();
  const supabase = getSupabase(user?.access_token);

  // Get links
  async function getSource() {
    setLoading(true);

    const { data, error } = await supabase
      .from<Source>("sources")
      .select(`id, created_at, name, database, host, dbUser, port, ssl`)
      .eq("id", id as string)
      .single();
    if (data) {
      setSource(data);
    }
    setLoading(false);
    return;
  }

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
    getSource();
  }, [id, user]);

  return loading || !source ? (
    <Loading />
  ) : (
    source && (
      <SourceForm
        id={id as string}
        name={source.name || ""}
        host={source.host}
        dbUser={source.dbUser}
        database={source.database}
        password="********"
        port={source.port}
        ssl={source.ssl}
      />
    )
  );
};

export default EditSource;
