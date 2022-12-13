import { useRouter } from "next/router";
import Page from "../../components/layouts/Page";
import { useEffect, useState } from "react";
import next, { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Button from "../../components/individual/Button";
import { useRecoilValue } from "recoil";
import { postsState } from "../../utils/contexts/posts/state";
import { supabase } from "../../utils/supabaseClient";
import { Database } from "../../types/database.types";
import remarkGfm from "remark-gfm";

const Module: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string>();
  const [questions, setQuestions] =
    useState<Database["public"]["Tables"]["questions"]["Row"][]>();
  const posts = useRecoilValue(postsState);
  const currentCount = posts?.findIndex((p) => p.id === id) || 0;
  const currentPost = posts && currentCount ? posts[currentCount] : undefined;
  const [completed, setCompleted] = useState<number>(0);

  const getContent = async () => {
    try {
      setLoading(true);
      setQuestions([]);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_ORIGIN}api/user/notion/post/${id}`
      );
      // IF QUESTIONS
      if (
        currentPost &&
        currentPost.questions &&
        currentPost.questions.length > 0
      ) {
        const { data, error } = await supabase
          .from("questions")
          .select("*")
          .or(currentPost.questions.map((c) => `id.eq.${c}`).join(","));
        if (data) {
          setQuestions(data);
        }
      }

      if (res.data) {
        setContent(res.data.content);
      }
      if (posts && posts.length > 0 && currentCount) {
        setCompleted(Math.round(((currentCount + 1) / posts.length) * 100));
      }
      setLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong!");
      setLoading(false);
      return;
    }
  };
  const findPost = posts ? posts.findIndex((p) => p.id === id) : -1;

  const nextPost = () => {
    if (!posts || posts.length === 0) {
      return;
    }
    const findPost = posts.findIndex((p) => p.id === id);

    if (findPost === posts.length) {
      return;
    } else {
      router.push(`/learn/${posts[findPost + 1].id}`);
    }
    return;
  };

  const previousPost = () => {
    if (!posts || posts.length === 0) {
      return;
    }
    const findPost = posts.findIndex((p) => p.id === id);
    if (findPost === 0) {
      return;
    } else {
      router.push(`/learn/${posts[findPost - 1].id}`);
    }
    return;
  };

  useEffect(() => {
    getContent();
  }, [id]);

  const buttons = (
    <div className="flex flex-row justify-end items-start space-x-4">
      <Button
        label="Back"
        type="outline-primary"
        onClick={() => previousPost()}
        disabled={!posts || findPost === 0}
      />
      <Button
        label="Next"
        type="primary"
        onClick={() => nextPost()}
        disabled={!posts || findPost === posts?.length - 1}
      />
    </div>
  );

  return (
    <Page pageLoading={loading}>
      <article className="max-w-2xl px-6 py-12 mx-auto space-y-12 dark:bg-zinc-800 dark:text-zinc-50 overflow-auto">
        <div className="flex flex-row  justify-between items-start w-full  text-left">
          <div className="flex flex-col justify-start items-start space-y-2">
            <h1 className="text-4xl font-bold ">{currentPost?.title}</h1>
            <p className="font-bold">{currentPost?.tags[0]}</p>
          </div>
          <div className="flex flex-col justify-start items-end space-y-2 ">
            <div className="flex flex-col justify-start items-end w-full space-y-1">
              <p className="text-xs font-semibold ">{`${currentCount + 1} of ${
                posts?.length
              } completed`}</p>
              {/* <div className="relative h-4 w-full ">
          <div className="absolute w-full h-full bg-zinc-200 rounded-md"></div>

          <div className={completeString()}></div>
        </div> */}
            </div>
            {buttons}
          </div>
        </div>
        <div className="prose dark:prose-invert prose-code:before:hidden prose-code:after:hidden">
          {content && (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, "")}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                      style={dracula}
                      customStyle={{ background: "none" }}
                    />
                  ) : (
                    <code
                      className={
                        "dark:text-red-400 text-red-500 bg-zinc-200 dark:bg-zinc-900 p-1 rounded-md"
                      }
                      {...props}
                      lang="sql"
                    >
                      {children}
                    </code>
                  );
                },
              }}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
        {questions && questions.length > 0 && (
          <div className="flex flex-col justify-start items-start space-y-2">
            <p className="text-small font-bold text-secondary-500">
              Practice questions
            </p>
            {questions.map((q) => {
              return (
                <div className="flex flex-row justify-between items-center border border-zinc-200 p-2 rounded-lg w-full">
                  <p className="text-sm font-semibold">{q.question}</p>
                  <Button
                    label="Try"
                    type="text-secondary"
                    onClick={() => router.push(`/learn/ask/${q.id}`)}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-row justify-between items-center space-x-4 w-full">
          <p className="text-xs font-semibold ">{`${currentCount + 1} of ${
            posts?.length
          } completed`}</p>
          {buttons}
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

export default Module;
