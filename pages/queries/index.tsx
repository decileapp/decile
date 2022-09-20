import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Page from "../../components/layouts/Page";
import TableShell from "../../components/individual/Table";
import { useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { TrashIcon } from "@heroicons/react/outline";
import { Query } from "../../types/Query";
import { GetServerSideProps } from "next";
import Cookies from "cookies";

import { getUser } from "@supabase/auth-helpers-nextjs";

interface Props {
  queries: Query[];
}

const Queries: React.FC<Props> = (props) => {
  const router = useRouter();
  const { queries } = props;
  const [deletedId, setDeletedId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const user = supabase.auth.user();

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

  return (
    <Page
      title="Queries"
      button="New"
      onClick={() => router.push("queries/new")}
    >
      {queries && queries.length > 0 && (
        <TableShell>
          <thead className="">
            <tr>
              {Object.keys(queries[0]).map((r: any) => {
                return (
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-6 text-zinc-500"
                    key={r}
                  >
                    {r}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 ">
            {queries.map((row: any, id: number) => {
              return (
                <tr key={id}>
                  {Object.keys(row).map((value, id) => {
                    return (
                      <td
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6"
                        key={id}
                      >
                        {row[value]}
                      </td>
                    );
                  })}
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
    .from<Query[]>("queries")
    .select("id, name, database, body, tags, publicQuery");

  return {
    props: { queries: queries },
  };
};

export default Queries;
