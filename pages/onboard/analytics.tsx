import { useRouter } from "next/router";
import Page from "../../components/layouts/Page";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const OnboardGuide: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>();

  const getContent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_ORIGIN}api/user/notion/post/${process.env.NEXT_PUBLIC_ONBOARDING}`
      );

      if (res.data) {
        setContent(res.data.content);
      }
      setLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong!");
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    getContent();
  }, []);

  return (
    <Page pageLoading={loading}>
      <article className="max-w-2xl px-6 py-12 mx-auto space-y-12 dark:bg-zinc-800 dark:text-zinc-50 overflow-auto">
        <div className="flex flex-row  justify-between items-start w-full  text-left">
          <div className="flex flex-col justify-start items-start space-y-2">
            <h1 className="text-4xl font-bold ">Getting started</h1>
          </div>
        </div>
        <div className="prose dark:prose-invert">
          {content && (
            <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
          )}
        </div>
      </article>
    </Page>
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

  return {
    props: {},
  };
};

export default OnboardGuide;
