import { useRouter } from "next/router";
import Page from "../../components/layouts/Page";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { postsState } from "../../utils/contexts/posts/state";
import { classNames } from "../../utils/classnames";

const Learn: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [posts, setPosts] = useRecoilState(postsState);
  const getPosts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_ORIGIN}api/user/notion/get-posts`
      );
      if (res.data) {
        setPosts(res.data.posts);
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
    getPosts();
  }, []);

  return (
    <Page
      title="Learn SQL"
      description="Our AI enabled learning tool helps you learn the basics of SQL in days, not weeks."
      pageLoading={loading}
      padding={true}
      button="Practice"
      onClick={() => router.push("/learn/ask")}
    >
      <div className="h-full w-full overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-start items-start">
          {posts &&
            posts.length > 0 &&
            posts.map((p, id) => {
              return (
                <a
                  className="flex flex-col h-full space-y-4 border dark:border-zinc-400 p-2 rounded-lg bg-white dark:bg-zinc-800 hover:shadow-lg "
                  key={id}
                  href={`/learn/${p.id}`}
                >
                  <div className="flex flex-col h-full space-y-1">
                    <div className="flex flex-row w-full justify-between items-center">
                      <p className="text-base font-bold">{p.title}</p>
                      <p className="text-xs dark:text-zinc-200 ">{`${
                        p.questions.length > 0
                          ? p.questions.length > 1
                            ? p.questions.length + " questions"
                            : p.questions.length + " question"
                          : "No questions"
                      }`}</p>
                    </div>
                    <div className="  flex-0 flex flex-row">
                      {p.tags.map((t, pid) => {
                        return (
                          <p
                            key={pid}
                            className={classNames(
                              t == "Basic"
                                ? "bg-blue-200 dark:bg-blue-800"
                                : t == "Intermediate"
                                ? "bg-secondary-200 dark:bg-secondary-800"
                                : t === "Advanced"
                                ? "bg-green-200 dark:bg-green-800"
                                : "bg-zinc-200 dark:bg-zinc-700",
                              "text-xs p-1 rounded-lg shadow-sm"
                            )}
                          >
                            {t}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-sm text-black dark:text-zinc-200">
                    {p.description}
                  </p>
                </a>
              );
            })}
        </div>
      </div>
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

export default Learn;
