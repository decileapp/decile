import { useRouter } from "next/router";
import Page from "../../components/layouts/Page";
import { useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { TrashIcon } from "@heroicons/react/outline";
import { BasicQuery } from "../../types/Query";
import { GetServerSideProps } from "next";
import dateFormatter from "../../utils/dateFormatter";
import { toast } from "react-toastify";
import PageHeading from "../../components/layouts/Page/PageHeading";
import Button from "../../components/individual/Button";
import TextInput from "../../components/individual/TextInput";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface Props {
  queries: BasicQuery[];
}

const Queries: React.FC<Props> = (props) => {
  const router = useRouter();
  const { queries } = props;
  const [deletedId, setDeletedId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>();
  const user = useUser();
  const supabase = useSupabaseClient();

  // New queri
  async function createQuery() {
    try {
      router.push({
        pathname: `/queries/new`,
      });

      return;
    } catch (error: any) {
      toast.error("Failed to save query");
    }
  }

  // Delete link
  async function deleteQuery(id: string) {
    setLoading(true);

    // Check if there are exports
    // First delete any exports
    const { data: exportIds, error: exportError } = await supabase
      .from("export")
      .select("id")
      .match({ user_id: user?.id || "", query_id: id });

    if (exportIds && exportIds.length > 0) {
      // First delete any exports
      const { data: schedules, error: scheduleError } = await supabase
        .from("schedule")
        .delete()
        .in(
          "export_id",
          exportIds.map((e) => e.id)
        )
        .select("id");

      const { data: exports, error: exportError } = await supabase
        .from("export")
        .delete()
        .match({ user_id: user?.id || "", query_id: id })
        .select("id");
    }

    const { data, error } = await supabase
      .from("queries")
      .delete()
      .match({ user_id: user?.id || "", id: id })
      .select("id");

    if (data) {
      setDeletedId(undefined);
    }
    window.location.reload();
    setLoading(false);
    return;
  }

  const toQuery = (row: BasicQuery) => {
    router.push({
      pathname: `/queries/view/${row.id}`,
    });
    return;
  };

  const searchFunc = (name: string, str: string) => {
    const pattern = str
      .split("")
      .map((x) => {
        return `(?=.*${x})`;
      })
      .join("");
    var regex = new RegExp(`${pattern}`, "g");
    return name.match(regex);
  };

  let filteredQueries: BasicQuery[] | undefined = queries;
  if (searchText && queries && queries.length > 0) {
    filteredQueries = queries.filter((q) => searchFunc(q.name, searchText));
  }

  return (
    <>
      <Page>
        <div className="flex flex-row justify-between items-center">
          <PageHeading title="Queries" />
          <div className="flex flex-row justify-end items-center mb-4 mt-4 space-x-4">
            <TextInput
              value={searchText || ""}
              handleChange={setSearchText}
              label="Search.."
              id="search"
              name="search"
              type="text"
            />
            <Button label="New" onClick={() => createQuery()} type="primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-2 max-w-4xl">
          <div className="grid grid-cols-10 gap-2 ">
            <p className="col-span-3 font-bold text-md">Name</p>
            <p className="col-span-1  font-bold text-md">Public</p>
            <p className="col-span-3  font-bold text-md">Last run</p>

            <p className="col-span-1 justify-end text-right flex  font-bold text-md">
              Actions
            </p>
            <p className="col-span-2 w-full justify-end text-right flex  font-bold text-md">
              Owner
            </p>
          </div>

          {filteredQueries &&
            filteredQueries.length > 0 &&
            filteredQueries.map((row, id) => {
              return (
                <div
                  key={id}
                  className="grid grid-cols-10 gap-2 border-b pb-2 border-zinc-200 dark:border-zinc-700 "
                >
                  <a
                    className="col-span-3 text-sm"
                    onClick={() => toQuery(row)}
                    href="#"
                  >
                    {row.name}
                  </a>

                  <a
                    className="col-span-1 text-sm"
                    onClick={() => toQuery(row)}
                    href="#"
                  >
                    {row.publicQuery ? "Yes" : "No"}
                  </a>
                  <p className="col-span-3 text-sm">
                    {dateFormatter({
                      dateVar: row.updated_at,
                      type: "time",
                    })}
                  </p>

                  <div className="col-span-1 justify-end flex">
                    {row.user_id === user?.id && (
                      <a href="#" onClick={() => setDeletedId(row.id)}>
                        <TrashIcon className="h-5 w-5 text-zinc-600 hover:text-red-600 dark:hover:text-red-400  " />
                      </a>
                    )}
                  </div>
                  <p className="col-span-2 text-sm text-right">
                    {row.user.email}
                  </p>
                </div>
              );
            })}
        </div>

        {filteredQueries?.length === 0 && (
          <p className="mt-4 text-sm">
            {" "}
            No queries found.{" "}
            <a
              href="#"
              onClick={() => createQuery()}
              className="text-primary-500"
            >
              Create
            </a>{" "}
            your first query.
          </p>
        )}

        <ConfirmDialog
          open={deletedId ? true : false}
          setOpen={() => setDeletedId(undefined)}
          title="Delete query?"
          description="Are sure you want to delete this query? This will delete any scheduled exports."
          confirmFunc={() => deleteQuery(deletedId || "")}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };

  const { data: queries, error } = await supabase
    .from("queries")
    .select(
      "id, name, database, body, publicQuery, updated_at, user_id, user:user_id(id, email), org_id"
    );

  if (!queries || queries.length === 0) {
    return {
      props: {
        queries: [],
      },
    };
  }

  // Get only subset
  const subQueries = queries.filter(
    (q) => q.publicQuery || q.org_id === session.user.user_metadata.org_id
  );

  return {
    props: {
      queries: subQueries,
    },
  };
};

export default Queries;
