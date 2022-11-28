import SourceForm from "../../components/sources";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Source } from "../../types/Sources";
import Loading from "../../components/individual/Loading";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

const EditSource: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<Source>();
  const user = useUser();
  const supabase = useSupabaseClient();

  // Get links
  async function getSource() {
    setLoading(true);

    const { data, error } = await supabase
      .from("sources")
      .select(`*`)
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
        password=""
        port={source.port}
        ssl={source.ssl}
      />
    )
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // Admins only
  if (session.user.user_metadata.role_id !== 1) {
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
