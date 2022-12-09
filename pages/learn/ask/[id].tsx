import QueryAsk from "../../../components/query/ask";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import Loading from "../../../components/individual/Loading";
import { Source } from "../../../types/Sources";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface Props {
  sources: Source[];
}

const NewQuery: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const { sources } = props;
  const firstPublicDataset = sources.find((s) => s.public);
  const [question, setQuestion] = useState<string>();
  const router = useRouter();
  const { id } = router.query;

  const getQuestion = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .match({ id: id })
        .single();
      if (data) {
        setQuestion(data.question);
      }
      setLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong.");
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (id) {
      getQuestion();
    }
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <QueryAsk
      sources={sources}
      selectedSourceId={firstPublicDataset ? firstPublicDataset.id : undefined}
      question={question}
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
      "id, name, host, database, port, dbUser, password, ssl, created_at, user_id, public"
    )
    .or(`org_id.eq.${session.user?.user_metadata.org_id},public.eq.true`);

  return {
    props: { sources: sources },
  };
};

export default NewQuery;
