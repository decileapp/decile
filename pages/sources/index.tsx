import { useRouter } from "next/router";
import { Source } from "../../types/Sources";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../../utils/supabaseClient";
import Page from "../../components/layouts/Page";
import TableShell from "../../components/individual/Table";
import { useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { TrashIcon } from "@heroicons/react/outline";
import { useUser } from "@auth0/nextjs-auth0";

interface Props {
  sources: Source[];
}

const Sources: React.FC<Props> = (props) => {
  const router = useRouter();
  const { sources } = props;
  const [deletedId, setDeletedId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const { user, error: userError, isLoading } = useUser();
  const supabase = getSupabase(user?.accessToken);

  // Delete link
  async function deleteSource(id: number) {
    setLoading(true);

    const { data, error } = await supabase
      .from<Source>("sources")
      .delete()
      .match({ user_id: user?.sub || "", id: id });
    if (data) {
      setDeletedId(undefined);
    }
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
        <TableShell>
          <thead className="">
            <tr>
              {Object.keys(sources[0]).map((r: any) => {
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
            {sources.map((row: any, id: number) => {
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
                          pathname: "/sources/edit",
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
      {sources?.length === 0 && (
        <p className="mt-4 text-md"> No sources created.</p>
      )}

      <ConfirmDialog
        open={deletedId ? true : false}
        setOpen={() => setDeletedId(undefined)}
        title="Delete link?"
        description="Are sure you want to delete this source?"
        confirmFunc={() => deleteSource(deletedId || -1)}
        id="popup"
        name="popup"
        buttonText="Delete"
        icon={<TrashIcon className="text-red-500" />}
        color="red"
      />
    </Page>
  );
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const data = await getSession(req, res);

    const supabase = getSupabase(data?.accessToken);

    const { data: sources, error } = await supabase
      .from<Source[]>("sources")
      .select("id, name, host, database, port, created_at");

    return {
      props: { sources: sources },
    };
  },
});

export default Sources;
