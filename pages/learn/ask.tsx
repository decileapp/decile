import QueryAsk from "../../components/query/ask";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import Loading from "../../components/individual/Loading";
import { Source } from "../../types/Sources";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface Props {
  sources: Source[];
}

const NewQuery: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const { sources } = props;

  return loading ? (
    <Loading />
  ) : (
    <QueryAsk
      sources={sources}
      selectedSourceId="6d04c8e2-dfa2-4ffc-a6cb-2f798abe349c"
      question="How many aircrafts exist?"
    />
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

  const { data: sources, error } = await supabase
    .from("sources")
    .select(
      "id, name, host, database, port, dbUser, password, ssl, created_at, user_id"
    )
    .or(`org_id.eq.${session.user?.user_metadata.org_id},public.eq.true`);

  return {
    props: { sources: sources },
  };
};

export default NewQuery;
