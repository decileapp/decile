import QueryForm from "../../components/query/index";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Query } from "../../types/Query";
import Loading from "../../components/individual/Loading";
import { Source } from "../../types/Sources";
import { GetServerSideProps } from "next";

interface Props {
  sources: Source[];
  query: Query;
}

const EditQuery: React.FC<Props> = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const { query } = props;

  return loading || !query ? (
    <Loading />
  ) : (
    query && (
      <QueryForm
        id={id as string}
        name={query.name || ""}
        database={query.database}
        body={query.body}
        publicQuery={query.publicQuery}
        sources={props.sources}
        updated_at={query.updated_at}
        query_vars={query.query_vars}
        query_filter_by={query.query_filter_by}
        query_group_by={query.query_group_by}
        query_limit={query.query_limit}
        query_sort_by={query.query_sort_by}
      />
    )
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(ctx.req);
  if (!user || !token) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  supabase.auth.setAuth(token);

  const { data: sources, error } = await supabase
    .from<Source[]>("sources")
    .select(
      "id, name, host, database, port, dbUser, password, ssl, created_at, user_id"
    );

  const { data: query, error: queryError } = await supabase
    .from<Query>("queries")
    .select(
      `id, created_at, name, database, body, publicQuery, query_vars, query_group_by, query_filter_by, query_sort_by, query_limit`
    )
    .eq("id", ctx.query.id as string)
    .single();

  return {
    props: { sources: sources, query: query },
  };
};

export default EditQuery;
