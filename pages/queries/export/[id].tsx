import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import Page from "../../../components/layouts/Page";
import { GetServerSideProps } from "next";
import axios from "axios";
import FormLayout from "../../../components/layouts/FormLayout";
import { useState } from "react";
import Button from "../../../components/individual/Button";
import TextInput from "../../../components/individual/TextInput";
import { toast } from "react-toastify";
import MiniLoading from "../../../components/individual/MiniLoading";
import { Export } from "../../../types/Export";
import dateFormatter from "../../../utils/dateFormatter";
import Select from "../../../components/individual/Select";
import { hours, daysOfWeek, daysOfMonth } from "../../../utils/schedule";
import { Schedule } from "../../../types/Schedule";

interface Props {
  exports: Export[];
}

const ExportQuery: React.FC<Props> = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const { exports } = props;
  const user = supabase.auth.user();

  // For one time
  const [type, setType] = useState<string>("create");
  const [spreadsheet, setSpreadsheet] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [range, setRange] = useState<string | undefined>("Sheet1");
  const [updatedSheet, setUpdatedSheet] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  // For schedule
  const [periodicity, setPeriodicity] = useState<string | undefined>();
  const [runAtTime, setRunAtTime] = useState<string | undefined>();
  const [runAtDay, setRunAtDay] = useState<string | undefined>();
  const [runAtMonthDate, setRunAtMonthDate] = useState<string | undefined>();
  const [schedule, setSchedule] = useState(false);
  const [time, setTime] = useState<Date>();
  const [exportId, setExportId] = useState<number>();

  const createSheet = async () => {
    setLoading(true);
    if (!title) {
      toast.error("Please enter a name for your spreadsheet.");
    }
    const res = await axios.post("/api/google/create-sheet", {
      title: title,
      queryId: id,
      range: range,
    });
    if (res.data) {
      setUpdatedSheet(res.data.spreadsheetId);
      toast.success("Spreadsheet created and updated.");
    }
    setLoading(false);
    return;
  };

  const updateSheet = async () => {
    setLoading(true);
    if (!spreadsheet) {
      toast.error(
        "Please enter the link of the spreadsheet you want to update."
      );
    } else {
      const rawId = spreadsheet.split(
        "https://docs.google.com/spreadsheets/d/"
      );
      const spreadsheetId = rawId[1].split("/")[0];
      const res = await axios.post("/api/google/update-sheet", {
        spreadsheet: spreadsheetId,
        queryId: id,
        range: range,
      });
      if (res.data) {
        setUpdatedSheet(res.data.spreadsheetId);
        toast.success("Spreadsheet updated.");
      }
    }
    setLoading(false);
    return;
  };

  // Update schedule
  const setEveryHour = (e: string) => {
    if (e === "hour") {
      setRunAtTime("0");
      setRunAtDay("0");
      setRunAtMonthDate("0");
    }

    if (e === "day") {
      setRunAtTime("8");
      setRunAtDay("0");
      setRunAtMonthDate("0");
    }

    if (e === "week") {
      setRunAtDay("2");
      setRunAtMonthDate("0");
    }

    if (e === "month") {
      setRunAtMonthDate("15");
    }

    setPeriodicity(e);
    return;
  };

  const scheduleJob = async () => {
    if (!exportId || !user || !periodicity) {
      toast.error("Something went wrong!");
      return;
    }

    // Format data object
    let input: Schedule = {
      export_id: exportId,
      name: `Scheduled run for ${
        exports.find((e) => e.id === exportId)?.spreadsheet
      }`,
      user_id: user?.id,
      org_id: user?.user_metadata.org_id,
      periodicity: periodicity,
      run_at_time: 0,
      run_at_day: 0,
      run_at_month_date: 0,
    };

    if (periodicity === "day") {
      if (!runAtTime) {
        toast.error("Please choose a time.");
        return;
      }
      input.run_at_time = parseInt(runAtTime, 10);
    }

    if (periodicity === "week") {
      if (!runAtTime) {
        toast.error("Please choose a time.");
        return;
      }
      if (!runAtDay) {
        toast.error("Please choose a day.");
        return;
      }
      input.run_at_time = parseInt(runAtTime, 10);
      input.run_at_day = parseInt(runAtDay, 10);
    }

    if (periodicity === "month") {
      if (!runAtTime) {
        toast.error("Please choose a time.");
        return;
      }

      if (!runAtMonthDate) {
        toast.error("Please choose a date.");
        return;
      }
      input.run_at_time = parseInt(runAtTime, 10);
      input.run_at_month_date = parseInt(runAtMonthDate, 10);
    }

    const { data, error } = await supabase.from("schedule").insert(input);
    console.log(error);
    if (data) {
      toast.success("Successfully scheduled.");
    }
    return;
  };

  return (
    <>
      <Page>
        <FormLayout>
          {!schedule && (
            <>
              <div className="flex flex-row space-x-4 ">
                <Button
                  label="Create new"
                  onClick={() => setType("create")}
                  type={type === "create" ? "primary" : "outline-primary"}
                />
                <Button
                  label="Use Existing"
                  onClick={() => setType("existing")}
                  type={type === "existing" ? "primary" : "outline-primary"}
                />
              </div>
              {type === "create" && (
                <TextInput
                  name="title"
                  id="title"
                  value={title || ""}
                  handleChange={setTitle}
                  label="New users"
                  title="Name your spreadsheet"
                  type="text"
                  // description="We'll export your data to Sheet1"
                />
              )}
              {type === "existing" && (
                <TextInput
                  name="spreadsheetId"
                  id="spreadsheetId"
                  value={spreadsheet || ""}
                  handleChange={setSpreadsheet}
                  label="e.g. https://docs.google.com/spreadsheets/d/1bkFo..."
                  title="Spreadsheet ID"
                  type="text"
                  // description="We'll export your data to Sheet1"
                />
              )}

              {/* <TextInput
            name="sheetRange"
            id="sheetRange"
            value={range || "From_subtable!A1"}
            handleChange={setRange}
            label="Sheet1!A1"
            title="Range"
            description="Where you want the data exported (e.g. Sheet1!A1)"
            type="text"
          /> */}

              <div className="flex flex-row justify-end ">
                {loading ? (
                  <MiniLoading />
                ) : (
                  <Button
                    label="Export"
                    onClick={() =>
                      type === "create" ? createSheet() : updateSheet()
                    }
                    type={"secondary"}
                  />
                )}
              </div>
            </>
          )}

          {/* Only show if there are exports */}
          {exports && exports.length > 0 && !schedule && (
            <div className="flex flex-col space-y-4">
              <div className="w-full border-b " />
              <p>Recent exports</p>
              <div className="grid grid-cols-1 gap-2">
                {exports.map((e, id) => (
                  <div className="grid grid-cols-3 gap-2" key={id}>
                    <a
                      className="grid-cols-1 truncate"
                      href={`https://docs.google.com/spreadsheets/d/${e.spreadsheet}/edit#gid=0`}
                      target="_blank"
                    >
                      {e.spreadsheet}
                    </a>
                    <p className="grid-cols-1">
                      {dateFormatter({ dateVar: e.created_at, type: "time" })}
                    </p>
                    <a
                      className="grid-cols-1 text-secondary-500 text-right"
                      href="#"
                      onClick={() => {
                        setSchedule(true);
                        setExportId(e.id);
                      }}
                    >
                      Schedule
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Only show for scheduling */}
          {schedule && (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xl">Schedule</p>
                <p className="text-sm">
                  Set up a schedule and we'll automatically export data to your
                  sheet.
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
                <Select
                  name="runDay"
                  id="runDay"
                  options={hours.slice(1, hours.length)}
                  setSelected={setRunAtTime}
                  title="What time?"
                  value={runAtTime || ""}
                />
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
          )}
        </FormLayout>
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(ctx.req);
  if (!user || !token) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  supabase.auth.setAuth(token);

  const { data: exports, error } = await supabase
    .from("export")
    .select(`id, spreadsheet, query_id, created_at`)
    .match({
      org_id: user.user_metadata.org_id,
      user_id: user.id,
      query_id: ctx.query.id,
    });

  return {
    props: { exports: exports },
  };
};

export default ExportQuery;
