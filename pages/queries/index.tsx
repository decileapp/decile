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
import { Export } from "../../types/Export";
import { Schedule } from "../../types/Schedule";
import PageHeading from "../../components/layouts/Page/PageHeading";
import Button from "../../components/individual/Button";
import Search from "../../components/individual/Search";
import TextInput from "../../components/individual/TextInput";

interface Props {
  queries: Query[];
}

const Queries: React.FC<Props> = (props) => {
  const router = useRouter();
  const { queries } = props;
  const [deletedId, setDeletedId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>();
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

    // Check if there are exports
    // First delete any exports
    const { data: exportIds, error: exportError } = await supabase
      .from<Export>("export")
      .select("id")
      .match({ user_id: user?.id || "", query_id: id });

    if (exportIds && exportIds.length > 0) {
      // First delete any exports
      const { data: schedules, error: scheduleError } = await supabase
        .from<Schedule>("schedule")
        .delete()
        .in(
          "export_id",
          exportIds.map((e) => e.id)
        );

      const { data: exports, error: exportError } = await supabase
        .from<Export>("export")
        .delete()
        .match({ user_id: user?.id || "", query_id: id });
    }

    const { data, error } = await supabase
      .from<Query>("queries")
      .delete()
      .match({ user_id: user?.id || "", id: id });

    if (data) {
      setDeletedId(undefined);
    }
    window.location.reload();
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

  let filteredQueries: Query[] | undefined = queries;
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

        <div className="grid grid-cols-1 gap-2 mt-2 ">
          <div className="grid grid-cols-10 gap-2 ">
            <p className="col-span-3 font-bold text-md">Name</p>
            <p className="col-span-1  font-bold text-md">Public</p>
            <p className="col-span-3  font-bold text-md">Last run</p>

            <p className="col-span-1 justify-end flex  font-bold text-md">
              Edit
            </p>

            <p className="col-span-1 justify-end flex  font-bold text-md">
              Delete
            </p>
          </div>

          {filteredQueries &&
            filteredQueries.length > 0 &&
            filteredQueries.map((row, id) => {
              return (
                <div
                  key={id}
                  className="grid grid-cols-10 gap-2 border p-2 rounded-lg border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
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
                    <a href="#" onClick={() => toQuery(row)}>
                      <PencilIcon className="h-5 w-5 text-zinc-600 hover:text-primary-600 dark:hover:text-primary-400 " />
                    </a>
                    <span className="sr-only">, {row.name}</span>
                  </div>
                  <div className="col-span-1 justify-end flex">
                    <a href="#" onClick={() => setDeletedId(row.id)}>
                      <TrashIcon className="h-5 w-5 text-zinc-600 hover:text-red-600 dark:hover:text-red-400  " />
                    </a>
                    <span className="sr-only">, {row.name}</span>
                  </div>
                </div>
              );
            })}
        </div>

        {filteredQueries?.length === 0 && (
          <p className="mt-4 text-md"> No queries found.</p>
        )}

        <ConfirmDialog
          open={deletedId ? true : false}
          setOpen={() => setDeletedId(undefined)}
          title="Delete query?"
          description="Are sure you want to delete this query? This will delete any scheduled exports."
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
