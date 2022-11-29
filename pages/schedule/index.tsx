import { useRouter } from "next/router";
import Page from "../../components/layouts/Page";
import { useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { TrashIcon } from "@heroicons/react/outline";
import { GetServerSideProps } from "next";
import { Schedule } from "../../types/Schedule";
import { formatSchedule } from "../../utils/schedule";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

interface Props {
  schedule: Schedule[];
}

const Schedule: React.FC<Props> = (props) => {
  const router = useRouter();
  const { schedule } = props;
  const [deletedId, setDeletedId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const supabase = useSupabaseClient();

  // Delete link
  async function deleteJob(id: number) {
    setLoading(true);

    const { data, error } = await supabase
      .from("schedule")
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

  return (
    <>
      <Page title="Schedule">
        <div className="grid grid-cols-1 gap-4 mt-2 ">
          <div className="grid grid-cols-10 gap-2 ">
            <p className="col-span-2 font-bold text-md">Query</p>
            <p className="col-span-2 font-bold text-md">Spreadsheet</p>
            <p className="col-span-3  font-bold text-md">Schedule</p>

            <p className="col-span-1 justify-end text-right flex  font-bold text-md">
              Actions
            </p>
            <p className="col-span-2 w-full justify-end text-right flex  font-bold text-md">
              Owner
            </p>
          </div>

          {schedule &&
            schedule.length > 0 &&
            schedule.map((row, id) => {
              return (
                <div
                  key={id}
                  className="grid grid-cols-10 gap-2 border-b pb-2 border-zinc-200 dark:border-zinc-700 "
                >
                  <a
                    className="col-span-2 text-sm truncate hover:text-primary-500"
                    href={`/schedule/${row.export_id.id}`}
                  >
                    {row.export_id.query_id.name}
                  </a>
                  <a
                    className="col-span-2 text-sm truncate hover:text-primary-500"
                    href={`https://docs.google.com/spreadsheets/d/${row.export_id.spreadsheet}/edit#gid=0`}
                    target="_blank"
                  >
                    {row.export_id.spreadsheet}
                  </a>
                  <a
                    className="col-span-3 text-sm truncate"
                    href={`/schedule/${row.export_id.id}`}
                  >
                    {formatSchedule(row)}
                  </a>
                  <div className="col-span-1 justify-end flex">
                    {row.user_id.id === user?.id && (
                      <a href="#" onClick={() => setDeletedId(row.id)}>
                        <TrashIcon className="h-5 w-5 text-zinc-600 hover:text-red-600 dark:hover:text-red-400  " />
                      </a>
                    )}
                  </div>
                  <p className="col-span-2 text-sm text-right">
                    {row.user_id.email}
                  </p>
                </div>
              );
            })}
        </div>

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

  const { data: schedule, error } = await supabase
    .from("schedule")
    .select(
      "id, name, user_id(id, email), org_id, periodicity, run_at_time, run_at_day, run_at_month_date, export_id(id, query_id(id, name), spreadsheet), timestamp_utc, timestamp_user_zone, timezone"
    )
    .match({ user_id: session.user.id });
  return {
    props: {
      schedule: schedule,
    },
  };
};

export default Schedule;
