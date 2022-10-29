import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import { useState } from "react";
import Button from "../../components/individual/Button";
import { toast } from "react-toastify";
import MiniLoading from "../../components/individual/MiniLoading";
import { Export } from "../../types/Export";
import Select from "../../components/individual/Select";
import { hours, daysOfWeek, daysOfMonth } from "../../utils/schedule";
import { Schedule, ScheduleInput } from "../../types/Schedule";
import Timezone from "../../components/individual/timezone";
import moment from "moment-timezone";
import InputLabel from "../../components/individual/common/InputLabel";
import { DateTime } from "luxon";

interface Props {
  selectedExport?: Export;
}

const ScheduleForm: React.FC<Props> = (props) => {
  const router = useRouter();
  const { selectedExport } = props;
  const user = supabase.auth.user();

  const [loading, setLoading] = useState(false);

  // For schedule
  const [periodicity, setPeriodicity] = useState<string | undefined>();
  const [runAtTime, setRunAtTime] = useState<string | undefined>();
  const [runAtDay, setRunAtDay] = useState<string | undefined>();
  const [runAtMonthDate, setRunAtMonthDate] = useState<string | undefined>();
  const [timezone, setTimezone] = useState<string>(moment.tz.guess());

  // Update schedule
  const setEveryHour = (e: string) => {
    if (e === "hour") {
      setRunAtTime("-1");
      setRunAtDay("-1");
      setRunAtMonthDate("-1");
    }

    if (e === "day") {
      setRunAtTime("8");
      setRunAtDay("-1");
      setRunAtMonthDate("-1");
    }

    if (e === "week") {
      setRunAtDay("2");
      if (!runAtTime) {
        setRunAtTime("8");
      }
      setRunAtMonthDate("-1");
    }

    if (e === "month") {
      setRunAtDay("-1");
      if (!runAtTime) {
        setRunAtTime("8");
      }
      setRunAtMonthDate("15");
    }

    setPeriodicity(e);
    return;
  };

  // Returns an updated date with chosen inputs
  const createDate = ({
    time,
    day,
    dateOfMonth,
    frequency,
  }: {
    time: string | undefined;
    day: string | undefined;
    dateOfMonth?: string | undefined;
    frequency: string;
  }) => {
    let updated = DateTime.now().setZone(timezone);
    // Set time
    if (time) {
      updated = updated.set({ hour: parseInt(time, 10) });
    }

    if (day && frequency === "week") {
      // Find next week day that is the same day
      const currentDay = updated.weekday;
      const diff = parseInt(day, 10) - currentDay;
      updated = updated.plus({ days: diff });
    }

    if (dateOfMonth && frequency === "month") {
      updated = updated.set({ day: parseInt(dateOfMonth, 10) });
    }

    // Return utc time
    const utcTime = updated.setZone("UTC");
    return { utc: utcTime, user: updated };
  };

  const scheduleJob = async () => {
    if (!selectedExport || !user || !periodicity) {
      toast.error("Something went wrong!");
      return;
    }

    // Get date in users's chosen timzone
    const { utc: utcDate, user: userTimestamp } = createDate({
      time: runAtTime,
      dateOfMonth: runAtMonthDate,
      day: runAtDay,
      frequency: periodicity,
    });

    // Format data object
    let input: ScheduleInput = {
      export_id: selectedExport.id,
      name: `Scheduled run for ${selectedExport.spreadsheet}`,
      user_id: user?.id,
      org_id: user?.user_metadata.org_id,
      periodicity: periodicity,
      run_at_time: -1,
      run_at_day: -1,
      run_at_month_date: -1,
      timestamp_utc: utcDate.toString(),
      timestamp_user_zone: userTimestamp.toString(),
      timezone: timezone,
    };

    // Handle timezone
    const handleTime = () => {
      if (!utcDate.day) {
        toast.error("Please choose a time.");
        return;
      }

      input.run_at_time = utcDate.hour;
      return;
    };

    // Every day
    if (periodicity === "day") {
      handleTime();
    }

    // Every week
    if (periodicity === "week") {
      handleTime();
      if (!runAtDay) {
        toast.error("Please choose a day.");
        return;
      }
      input.run_at_day = utcDate.weekday;
    }

    // Every month
    if (periodicity === "month") {
      handleTime();

      if (!runAtMonthDate) {
        toast.error("Please choose a date.");
        return;
      }
      handleTime();
      input.run_at_month_date = utcDate.day;
    }
    const { data, error } = await supabase.from("schedule").insert(input);
    if (data) {
      toast.success("Successfully scheduled.");
    }

    return;
  };

  // Time options (TODO: update to allow 30 mins for certain time zones)
  let timeOptions = hours.slice(1, hours.length);

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xl">Schedule</p>{" "}
          <p className="text-sm">
            Set up a schedule and we'll automatically export data to your sheet.
          </p>
        </div>
        <Select
          name="periodicity"
          id="periodicity"
          options={[
            { name: "Every hour", value: "hour" },
            { name: "Every day", value: "day" },
            { name: "Every week", value: "week" },
            { name: "Every month", value: "month" },
          ]}
          setSelected={setEveryHour}
          title="How often?"
          value={periodicity || ""}
        />
        {periodicity === "week" && periodicity && (
          <Select
            name="runAtDay"
            id="runAtDay"
            options={daysOfWeek.slice(1, hours.length)}
            setSelected={setRunAtDay}
            title="Which day of the week?"
            value={runAtDay || ""}
          />
        )}
        {periodicity === "month" && periodicity && (
          <Select
            name="runAtMonthDate"
            id="runAtMonthDate"
            options={daysOfMonth.slice(1, hours.length)}
            setSelected={setRunAtMonthDate}
            title="Which day of the month?"
            value={runAtMonthDate || ""}
          />
        )}
        {periodicity && periodicity !== "hour" && (
          <div className="flex flex-col space-y-2">
            <InputLabel title="What time?" />
            <Timezone updateZone={setTimezone} />
            <Select
              name="runAtTime"
              id="runAtTime"
              options={timeOptions}
              setSelected={setRunAtTime}
              value={runAtTime || ""}
            />
          </div>
        )}

        {periodicity && (
          <div className="flex flex-row justify-end ">
            {loading ? (
              <MiniLoading />
            ) : (
              <Button
                label="Schedule"
                onClick={() => scheduleJob()}
                type={"secondary"}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ScheduleForm;
