import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import Page from "../../../components/layouts/Page";
import { GetServerSideProps } from "next";
import { Role } from "../../../types/Role";
import axios from "axios";
import FormLayout from "../../../components/layouts/FormLayout";
import { useState } from "react";
import Button from "../../../components/individual/Button";
import TextInput from "../../../components/individual/TextInput";
import { toast } from "react-toastify";
import MiniLoading from "../../../components/individual/MiniLoading";

const ExportQuery: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [type, setType] = useState<string>("create");
  const [spreadsheet, setSpreadsheet] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [range, setRange] = useState<string | undefined>("Sheet1");
  const [updatedSheet, setUpdatedSheet] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <Page>
        <FormLayout>
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
              description="We'll export your data to Sheet1"
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
              description="We'll export your data to Sheet1"
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
        </FormLayout>
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
  const { data: members, error } = await supabase
    .from<Role[]>("org_users")
    .select(`id, org_id(id, name), role_id, user_id(id, email)`)
    .match({ org_id: user.user_metadata.org_id });

  return {
    props: { members: members },
  };
};

export default ExportQuery;
