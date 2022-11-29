import { useRouter } from "next/router";
import Page from "../../components/layouts/Page";
import { GetServerSideProps } from "next";
import FormLayout from "../../components/layouts/FormLayout";
import { Export } from "../../types/Export";
import ScheduleForm from "../../components/schedule";
import { useEffect, useState } from "react";
import { Schedule } from "../../types/Schedule";
import Button from "../../components/individual/Button";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

interface Props {
  selectedExport: Export;
  schedule?: Schedule;
}

const ScheduleQuery: React.FC<Props> = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const { selectedExport, schedule } = props;
  const user = useUser();
  const [eligible, setEligible] = useState(false);
  const supabase = useSupabaseClient();

  const checkEligibility = async () => {
    // Check users and plans
    const { data: scheduleLimit, error: orgError } = await supabase
      .from("plan")
      .select("id, scheduled_query_limit, user_limit")
      .match({ id: user?.user_metadata.plan_id })
      .single();

    const { data: schedule, error: orgUserError } = await supabase
      .from("schedule")
      .select("id")
      .match({ org_id: user?.user_metadata.org_id });

    if (!schedule || !scheduleLimit) {
      throw new Error("Something went wrong");
    }
    if (scheduleLimit.user_limit > schedule?.length) {
      setEligible(true);
      return;
    }
  };

  useEffect(() => {
    checkEligibility();
  }, []);

  return (
    <>
      <Page>
        <FormLayout>
          {eligible && (
            <ScheduleForm selectedExport={selectedExport} schedule={schedule} />
          )}
          {!eligible && (
            <div className="flex flex-col items-center space-y-4">
              <p>Upgrade your account to schedule queries.</p>
              <div>
                <Button
                  label="Upgrade"
                  type="primary"
                  onClick={() => router.push("/settings")}
                />
              </div>
            </div>
          )}
        </FormLayout>
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

  const { data: selectedExport, error } = await supabase
    .from("export")
    .select(`id, spreadsheet, query_id, created_at, org_id, user_id`)
    .match({
      org_id: session.user.user_metadata.org_id,
      user_id: session.user.id,
      id: ctx.query.id,
    })
    .single();

  if (!selectedExport) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  const { data: schedule, error: scheduleError } = await supabase
    .from("schedule")
    .select(
      `id, created_at, user_id, org_id, export_id, name, run_at_time, run_at_day, run_at_month_date, periodicity, timestamp_utc, timestamp_user_zone, timezone, notify_email`
    )
    .match({
      org_id: session.user.user_metadata.org_id,
      user_id: session.user.id,
      export_id: selectedExport.id,
    })
    .single();

  return {
    props: { selectedExport: selectedExport, schedule: schedule },
  };
};

export default ScheduleQuery;
