import QueryForm from "../../../components/query/form";
import { useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import Loading from "../../../components/individual/Loading";
import { Source } from "../../../types/Sources";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface Props {
  sources: Source[];
}

const NewQuery: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const { sources } = props;

  return loading ? <Loading /> : <QueryForm sources={sources} />;
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
