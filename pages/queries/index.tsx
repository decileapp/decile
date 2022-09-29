import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Page from "../../components/layouts/Page";
import TableShell from "../../components/individual/table/shell";
import { useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { TrashIcon } from "@heroicons/react/outline";
import { Query } from "../../types/Query";
import { GetServerSideProps } from "next";
import Cookies from "cookies";

import { getUser } from "@supabase/auth-helpers-nextjs";
import dateFormatter from "../../utils/dateFormatter";
import TableHeader from "../../components/individual/table/header";
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

  // Variable map
  const fields = ["Name", "Query", "Public", "Last run", "", ""];

  return (
    <>
      <Page title="Queries" button="New" onClick={() => createQuery()}>
        {queries && queries.length > 0 && (
          <div className="h-full">
            <TableShell>
              <TableHeader labels={fields} />

              <tbody className="divide-y divide-gray-200">
                {queries.map((row: any, id: number) => {
                  return (
                    <tr key={id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6">
                        {row.name}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6 truncate">
                        {row.body}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6">
                        {row.publicQuery ? "Public" : "Private"}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6">
                        {dateFormatter({
                          dateVar: row.updated_at,
                          type: "time",
                        })}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-primary-600 hover:text-primary-900"
                          onClick={() =>
                            router.push({
                              pathname: "/queries/edit",
                              query: {
                                id: row.id,
                              },
                            })
                          }
                        >
                          Edit
                          <span className="sr-only">, {row.name}</span>
                        </a>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => setDeletedId(row.id)}
                        >
                          Delete
                          <span className="sr-only">, {row.name}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </TableShell>
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
      queries: queries?.filter(
        (q) => q.publicQuery === true || q.user_id === user.id
      ),
    },
  };
};

export default Queries;
