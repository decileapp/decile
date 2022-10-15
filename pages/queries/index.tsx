import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Page from "../../components/layouts/Page";
import { useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { PencilAltIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { Query } from "../../types/Query";
import { GetServerSideProps } from "next";
import dateFormatter from "../../utils/dateFormatter";
import { toast } from "react-toastify";

interface Props {
  queries: Query[];
}

const Queries: React.FC<Props> = (props) => {
  const router = useRouter();
  const { queries } = props;
  const [deletedId, setDeletedId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const user = supabase.auth.user();

  // New queri
  async function createQuery() {
    try {
      const input = {
        name: "Untitled",
        body: "select * from TABLE;",
        publicQuery: false,
        user_id: user?.id,
        org_id: user?.user_metadata.org_id,
        updated_at: new Date(Date.now()),
      };
      let { data, error } = await supabase
        .from("queries")
        .insert(input)
        .single();

      if (data) {
        router.push({
          pathname: "/queries/edit",
          query: {
            id: data.id,
          },
        });
      }
      return;
    } catch (error: any) {
      toast.error("Failed to save query");
    }
  }

  // Delete link
  async function deleteQuery(id: number) {
    setLoading(true);

    const { data, error } = await supabase
      .from<Query>("queries")
      .delete()
      .match({ user_id: user?.id || "", id: id });
    if (data) {
      setDeletedId(undefined);
    }
    setLoading(false);
    return;
  }

  const toQuery = (row: Query) => {
    router.push({
      pathname: "/queries/edit",
      query: {
        id: row.id,
      },
    });
    return;
  };

  return (
    <>
      <Page title="Queries" button="New" onClick={() => createQuery()}>
        {queries && queries.length > 0 && (
          <div className="grid grid-cols-1 gap-2 mt-2 ">
            <div className="grid grid-cols-10 gap-2 ">
              <p className="col-span-2 font-bold text-md">Name</p>
              <p className="col-span-3  font-bold text-md">Query</p>
              <p className="col-span-1  font-bold text-md">Public</p>
              <p className="col-span-2  font-bold text-md">Last run</p>

              <p className="col-span-1 justify-end flex  font-bold text-md">
                Edit
              </p>

              <p className="col-span-1 justify-end flex  font-bold text-md">
                Delete
              </p>
            </div>

            {queries.map((row, id) => {
              return (
                <div
                  key={id}
                  className="grid grid-cols-10 gap-2 border p-2 rounded-lg border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                >
                  <a
                    className="col-span-2"
                    onClick={() => toQuery(row)}
                    href="#"
                  >
                    {row.name}
                  </a>
                  <a
                    className="col-span-3 truncate"
                    onClick={() => toQuery(row)}
                    href="#"
                  >
                    {row.body}
                  </a>
                  <a
                    className="col-span-1"
                    onClick={() => toQuery(row)}
                    href="#"
                  >
                    {row.publicQuery ? "Yes" : "No"}
                  </a>
                  <p className="col-span-2">
                    {dateFormatter({
                      dateVar: row.updated_at,
                      type: "time",
                    })}
                  </p>
                  <p className="">
                    <a
                      href="#"
                      className="col-span-1 text-primary-600 hover:text-primary-900 justify-end flex"
                      onClick={() => toQuery(row)}
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span className="sr-only">, {row.name}</span>
                    </a>
                  </p>
                  <p className="col-span-1">
                    <a
                      href="#"
                      className="col-span-1 text-red-600 hover:text-red-900 justify-end flex"
                      onClick={() => setDeletedId(row.id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="sr-only">, {row.name}</span>
                    </a>
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {queries?.length === 0 && (
          <p className="mt-4 text-md"> No queries created.</p>
        )}

        <ConfirmDialog
          open={deletedId ? true : false}
          setOpen={() => setDeletedId(undefined)}
          title="Delete link?"
          description="Are sure you want to delete this query?"
          confirmFunc={() => deleteQuery(deletedId || -1)}
          id="popup"
          name="popup"
          buttonText="Delete"
          icon={<TrashIcon className="text-red-500" />}
          color="red"
        />
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (!user || !token) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  supabase.auth.setAuth(token);

  const { data: queries, error } = await supabase
    .from<Query>("queries")
    .select("id, name, database, body, publicQuery, updated_at, user_id");
  return {
    props: {
      queries:
        queries && queries.length > 0
          ? queries.filter(
              (q) => q.publicQuery === true || q.user_id === user.id
            )
          : [],
    },
  };
};

export default Queries;
