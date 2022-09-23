import { useRouter } from "next/router";
import { Source } from "../../types/Sources";
import { supabase } from "../../utils/supabaseClient";
import Page from "../../components/layouts/Page";
import TableShell from "../../components/individual/table/shell";
import { useEffect, useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { TrashIcon } from "@heroicons/react/outline";
import { GetServerSideProps } from "next";
import TableHeader from "../../components/individual/table/header";

interface Props {
  sources: Source[];
}

const Sources: React.FC<Props> = (props) => {
  const router = useRouter();
  const { sources } = props;
  const [deletedId, setDeletedId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const user = supabase.auth.user();

  // Delete link
  async function deleteSource(id: string) {
    setLoading(true);

    const { data, error } = await supabase
      .from<Source>("sources")
      .delete()
      .match({ user_id: user?.id || "", id: id });
    if (data) {
      setDeletedId(undefined);
    }
    setLoading(false);
    return;
  }

  const getSources = async () => {
    const { data: sources, error } = await supabase
      .from<Source[]>("sources")
      .select("id, name, host, database, port, created_at, user_id");
    return;
  };

  useEffect(() => {
    getSources();
  }, []);

  return (
    <Page
      title="Data sources"
      button="New"
      onClick={() => router.push("sources/new")}
    >
      {sources && sources.length > 0 && (
        <TableShell>
          <TableHeader labels={["Name", "Host", "Database", "Port", "", ""]} />

          <tbody className="divide-y divide-gray-200 ">
            {sources.map((row, id: number) => {
              return (
                <tr key={id}>
                  <td
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6"
                    key={id}
                  >
                    {row.name}
                  </td>
                  <td
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6"
                    key={id}
                  >
                    {row.host}
                  </td>
                  <td
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6"
                    key={id}
                  >
                    {row.database}
                  </td>
                  <td
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6"
                    key={id}
                  >
                    {row.port}
                  </td>

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
                      onClick={() => setDeletedId(row.id.toString())}
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

  const { data: sources, error } = await supabase
    .from<Source[]>("sources")
    .select("id, name, host, database, port, created_at, user_id");
  return {
    props: { sources: sources },
  };
};

export default Sources;
