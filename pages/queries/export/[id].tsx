import { useRouter } from "next/router";
import { getServiceSupabase, supabase } from "../../../utils/supabaseClient";
import Page from "../../../components/layouts/Page";
import { GetServerSideProps } from "next";
import axios from "axios";
import FormLayout from "../../../components/layouts/FormLayout";
import { useEffect, useState } from "react";
import Button from "../../../components/individual/Button";
import TextInput from "../../../components/individual/TextInput";
import { toast } from "react-toastify";
import MiniLoading from "../../../components/individual/MiniLoading";
import { Export } from "../../../types/Export";
import dateFormatter from "../../../utils/dateFormatter";
import ScheduleForm from "../../../components/schedule";

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
  const [updatedSheet, setUpdatedSheet] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  // For schedule
  const [schedule, setSchedule] = useState(false);
  const [chosenExport, setchosenExport] = useState<Export>();

  // Create a new sheet
  const createSheet = async () => {
    try {
      setLoading(true);
      if (!title) {
        toast.error("Please enter a name for your spreadsheet.");
        return;
      }
      const res = await axios.post("/api/user/google/sheets/create-sheet", {
        title: title,
        queryId: id,
        range: "From_Decile",
      });

      // If not authenticated open new tab for auth
      if (res.data.link) {
        window.open(res.data.link);
        setLoading(false);
        return;
      }

      if (res.data.spreadsheetId) {
        setUpdatedSheet(res.data.spreadsheetId);
        toast.success("Spreadsheet created and updated.");
      }
      setLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong!");
      setLoading(false);
      return;
    }
  };

  const getSpreadsheetId = () => {
    if (!spreadsheet) return;
    if (spreadsheet.search("https://docs.google.com/spreadsheets/d/") < 0) {
      return;
    }
    const rawId = spreadsheet.split("https://docs.google.com/spreadsheets/d/");
    const spreadsheetId = rawId[1].split("/")[0];
    return spreadsheetId;
  };

  // Update an existing sheet
  const updateSheet = async () => {
    try {
      setLoading(true);
      if (!spreadsheet) {
        toast.error(
          "Please enter the link of the spreadsheet you want to update."
        );
        return;
      } else {
        const spreadsheetId = getSpreadsheetId();
        const res = await axios.post("/api/user/google/sheets/update-sheet", {
          spreadsheet: spreadsheetId,
          queryId: id,
          range: "From_Decile",
        });
        // If not authenticated open new tab for auth
        if (res.data.link) {
          window.open(res.data.link);
          setLoading(false);
          return;
        }
        if (res.data.spreadsheetId) {
          setUpdatedSheet(res.data.spreadsheetId);
          toast.success("Spreadsheet updated.");
        }
      }
      setLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong!");
      setLoading(false);
      return;
    }
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
                />
              )}
              <p className="text-sm text-zinc-700">
                {type === "create"
                  ? "We'll export your data to a tab called From_Decile."
                  : "We'll export your data to a tab called From_Decile. All existing data in the tab will be replaced."}
              </p>

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
                    disabled={
                      (type === "create" && title) ||
                      (type === "existing" && spreadsheet)
                        ? false
                        : true
                    }
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
                        setchosenExport(e);
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
          {schedule && <ScheduleForm selectedExport={chosenExport} />}
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

  // Setup up supabase using my service key
  const serviceSupabase = getServiceSupabase();
  const { data } = await serviceSupabase
    .from("integration_credentials")
    .select("id")
    .match({ user_id: user.id, provider: "google" })
    .single();

  // No data set to Google setup
  if (!data) {
    return {
      redirect: {
        destination: `/google`,
        permanent: false,
      },
    };
  }

  return {
    props: { exports: exports },
  };
};

export default ExportQuery;
