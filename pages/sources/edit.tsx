import SourceForm from "../../components/forms/source";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Source } from "../../types/Sources";
import Loading from "../../components/individual/Loading";
import { GetServerSideProps } from "next";

const EditSource: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<Source>();
  const user = supabase.auth.user();

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
        password={source.password}
        port={source.port}
        ssl={source.ssl}
      />
    )
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default EditSource;
