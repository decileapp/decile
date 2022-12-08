import { useRouter } from "next/router";
import Page from "../../components/layouts/Page";
import { useEffect, useState } from "react";
import next, { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";
import Button from "../../components/individual/Button";
import { Post } from "../../types/Post";
import { useRecoilValue } from "recoil";
import { postsState } from "../../utils/contexts/posts/state";

const Module: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post>();
  const posts = useRecoilValue(postsState);

  const getContent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_ORIGIN}api/user/notion/post/${id}`
      );
      if (res.data) {
        setPost(res.data.post);
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

  return (
    <Page pageLoading={loading}>
      <article className="max-w-2xl px-6 py-12 mx-auto space-y-12 dark:bg-zinc-800 dark:text-zinc-50 overflow-auto">
        <div className="flex flex-row  justify-between items-start w-full  text-left">
          <div className="flex flex-col justify-start items-start space-y-2">
            <h1 className="text-4xl font-bold ">{post?.title}</h1>
            <p className="font-bold">{post?.tags[0]}</p>
          </div>
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
        </div>
        <div className="prose dark:prose-invert">
          {post?.body && (
            <ReactMarkdown children={post.body} remarkPlugins={[remarkGfm]} />
          )}
        </div>
        <div className="flex flex-row justify-between items-center space-x-4">
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
            disabled={!posts || findPost === posts?.length}
          />
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
