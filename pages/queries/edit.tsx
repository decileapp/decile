import QueryForm from "../../components/forms/query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSupabase } from "../../utils/supabaseClient";
import { Query } from "../../types/Query";
import Loading from "../../components/individual/Loading";
import { useUser } from "@auth0/nextjs-auth0";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Source } from "../../types/Sources";

interface Props {
  sources: Source[];
}

const EditQuery: React.FC<Props> = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<Query>();
  const { user } = useUser();
  const supabase = getSupabase(user?.access_token);

  // Get links
  async function getSource() {
    setLoading(true);

    const { data, error } = await supabase
      .from<Query>("queries")
      .select(`id, created_at, name, database, body, tags, publicQuery`)
      .eq("id", id as string)
      .single();
    if (data) {
      setQuery(data);
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

  return loading || !query ? (
    <Loading />
  ) : (
    query && (
      <QueryForm
        id={id as string}
        name={query.name || ""}
        database={query.database}
        body={query.body}
        tags={query.tags}
        publicQuery={query.publicQuery}
        sources={props.sources}
      />
    )
  );
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const data = await getSession(req, res);

    const supabase = getSupabase(data?.accessToken);

    const { data: sources, error } = await supabase
      .from<Source[]>("sources")
      .select("id, name, host, database, port, dbUser, password, created_at");
    return {
      props: { sources: sources },
    };
  },
});

export default EditQuery;
