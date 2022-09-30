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
import { Schedule } from "../../types/Schedule";

interface Props {
  schedule: Schedule[];
}

const Schedule: React.FC<Props> = (props) => {
  const router = useRouter();
  const { schedule } = props;
  const [deletedId, setDeletedId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const user = supabase.auth.user();

  // Delete link
  async function deleteJob(id: number) {
    setLoading(true);

    const { data, error } = await supabase
      .from<Schedule>("schedule")
      .delete()
      .match({ user_id: user?.id || "", id: id });
    if (data) {
      setDeletedId(undefined);
    }
    setLoading(false);
    return;
  }

  // Variable map
  const fields = ["Name", "Query", "Every", "Destination", "", ""];

  return (
    <>
      <Page
        title="Schedule"
        button="New"
        onClick={() => router.push("/schedule/new")}
      >
        {schedule && schedule.length > 0 && (
          <div className="h-full">
            <TableShell>
              <TableHeader labels={fields} />

              <tbody className="divide-y divide-gray-200">
                {schedule.map((row: any, id: number) => {
                  return (
                    <tr key={id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6">
                        {row.name}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6 truncate">
                        {row.query_id.name}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6">
                        {row.run_at}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6">
                        {row.export_id.spreadsheet}
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
        {schedule?.length === 0 && (
          <p className="mt-4 text-md"> No schedules created.</p>
        )}

        <ConfirmDialog
          open={deletedId ? true : false}
          setOpen={() => setDeletedId(undefined)}
          title="Delete job?"
          description="Are sure you want to delete this job?"
          confirmFunc={() => deleteJob(deletedId || -1)}
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

  const { data: schedule, error } = await supabase
    .from<Schedule>("schedule")
    .select(
      "id, name, user_id, org_id, frequency, run_at, export_id(id, spreadsheet, queryId(id, name))"
    )
    .match({ user_id: user.id });
  return {
    props: {
      schedule: schedule,
    },
  };
};

export default Schedule;
