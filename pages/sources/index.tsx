import { useRouter } from "next/router";
import { Source } from "../../types/Sources";
import Page from "../../components/layouts/Page";
import { useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

interface Props {
  sources: Source[];
}

const Sources: React.FC<Props> = (props) => {
  const router = useRouter();
  const { sources } = props;
  const [deletedId, setDeletedId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const supabase = useSupabaseClient();

  // Delete link
  async function deleteSource(id: string) {
    setLoading(true);

    // Check if there are queries
    const { data: foundQueries, error: queryError } = await supabase
      .from("queries")
      .select("id")
      .match({ user_id: user?.id || "", database: parseInt(id, 10) });

    if (foundQueries && foundQueries?.length > 0) {
      // Exports
      const { data: exports } = await supabase
        .from("export")
        .delete()
        .in(
          "query_id",
          foundQueries.map((e) => e.id)
        )
        .select("id");
      if (exports && exports.length > 0) {
        // Schedule
        const { data: schedules } = await supabase
          .from("schedule")
          .delete()
          .in(
            "export_id",
            exports.map((e: any) => e.id)
          )
          .select("id");
      }
      // Check if there are queries
      const { data: deletedQueries, error: queryError } = await supabase
        .from("queries")
        .delete()
        .match({ user_id: user?.id || "", database: parseInt(id, 10) })
        .select("id");
    }

    const { data, error } = await supabase
      .from("sources")
      .delete()
      .match({ user_id: user?.id || "", id: id })
      .select("*")
      .single();
    if (data) {
      setDeletedId(undefined);
    }
    window.location.reload();
    setLoading(false);
    return;
  }

  return (
    <Page
      title="Data sources"
      button="New"
      onClick={() => router.push("sources/new")}
    >
      {sources && sources.length > 0 && (
        <div className="grid grid-cols-4 gap-8">
          {sources.map((row, id: number) => {
            return (
              <div
                key={id}
                className="flex flex-col h-full space-y-2 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-800 p-2  overflow-hidden shadow-lg hover:shadow-primary-100/50 "
              >
                <div className="grid grid-cols-2  ">
                  <p className=" font-bold truncate">{row.name}</p>
                  <div className="flex flex-row justify-end space-x-2">
                    <a
                      href="#"
                      className="text-zinc-600 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400 truncate"
                      onClick={() =>
                        router.push({
                          pathname: "/sources/edit",
                          query: {
                            id: row.id,
                          },
                        })
                      }
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span className="sr-only">, {row.name}</span>
                    </a>

                    <a
                      href="#"
                      className="text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                      onClick={() => setDeletedId(row.id.toString())}
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="sr-only">, {row.name}</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                    Host
                  </p>
                  <p className="text-sm truncate">{row.host}</p>
                </div>

                <div className="grid grid-cols-2 items-center">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                    Database
                  </p>
                  <p className="text-sm truncate">{row.database}</p>
                </div>

                <div className="grid grid-cols-2 items-center">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                    Port
                  </p>
                  <p className="text-sm truncate">{row.port}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sources?.length === 0 && (
        <p className="mt-4 text-sm">
          {" "}
          No sources found.{" "}
          <a href="/sources/new" className="text-primary-500">
            Create
          </a>{" "}
          your first source.
        </p>
      )}

      <ConfirmDialog
        open={deletedId ? true : false}
        setOpen={() => setDeletedId(undefined)}
        title="Delete source?"
        description="Are sure you want to delete this source? All queries, exports and schedules will be removed."
        confirmFunc={() => deleteSource(deletedId || "")}
        id="popup"
        name="popup"
        buttonText="Delete"
        icon={<TrashIcon className="text-red-500" />}
        color="red"
      />
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

  // Admins only
  if (session.user.user_metadata.role_id !== 1) {
    return {
      redirect: {
        destination: `/queries`,
        permanent: false,
      },
    };
  }

  const { data, error } = await supabase
    .from("sources")
    .select("id, name, host, database, port, created_at, user_id, org_id")
    .or(`org_id.eq.${session.user?.user_metadata.org_id},public.eq.true`);

  return {
    props: { sources: data },
  };
};

export default Sources;
