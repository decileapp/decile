import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Page from "../../components/layouts/Page";
import { useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { TrashIcon } from "@heroicons/react/outline";
import { GetServerSideProps } from "next";
import dateFormatter from "../../utils/dateFormatter";
import PageHeading from "../../components/layouts/Page/PageHeading";
import TextInput from "../../components/individual/TextInput";
import { Chart } from "../../types/Chart";

interface Props {
  charts: Chart[];
}

const Charts: React.FC<Props> = (props) => {
  const router = useRouter();
  const { charts } = props;
  const [deletedId, setDeletedId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>();
  const user = supabase.auth.user();

  // Delete link
  async function deleteChart(id: number) {
    setLoading(true);

    const { data, error } = await supabase
      .from<Chart>("chart")
      .delete()
      .match({ user_id: user?.id || "", id: id });

    if (data) {
      setDeletedId(undefined);
    }
    window.location.reload();
    setLoading(false);
    return;
  }

  const toChart = (row: Chart) => {
    router.push({
      pathname: `/charts/${row.id}`,
    });
    return;
  };

  const searchFunc = (name: string, str: string) => {
    const pattern = str
      .split("")
      .map((x) => {
        return `(?=.*${x})`;
      })
      .join("");
    var regex = new RegExp(`${pattern}`, "g");
    return name.match(regex);
  };

  let filteredCharts: Chart[] | undefined = charts;
  if (searchText && charts && charts.length > 0) {
    filteredCharts = charts.filter((q) =>
      searchFunc(q.title || "", searchText)
    );
  }

  return (
    <>
      <Page>
        <div className="flex flex-col h-full w-full overflow-auto">
          <div className="flex flex-row justify-between items-center">
            <PageHeading title="Charts" />
            <div className="flex flex-row justify-end items-center mb-4 mt-4 space-x-4">
              <TextInput
                value={searchText || ""}
                handleChange={setSearchText}
                label="Search.."
                id="search"
                name="search"
                type="text"
              />
              {/* <Button label="New" onClick={() => createQuery()} type="primary" /> */}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-2 max-w-4xl">
            <div className="grid grid-cols-10 gap-2 ">
              <p className="col-span-3 font-bold text-md">Name</p>
              <p className="col-span-1  font-bold text-md">Public</p>
              <p className="col-span-3  font-bold text-md">Createdn</p>

              <p className="col-span-1 justify-end text-right flex  font-bold text-md">
                Actions
              </p>
              <p className="col-span-2 w-full justify-end text-right flex  font-bold text-md">
                Owner
              </p>
            </div>

            {filteredCharts &&
              filteredCharts.length > 0 &&
              filteredCharts.map((row, id) => {
                return (
                  <div
                    key={id}
                    className="grid grid-cols-10 gap-2 border-b pb-2 border-zinc-200 dark:border-zinc-700 "
                  >
                    <a
                      className="col-span-3 text-sm"
                      onClick={() => toChart(row)}
                      href="#"
                    >
                      {row.title || row.query_id.name}
                    </a>

                    <a
                      className="col-span-1 text-sm"
                      onClick={() => toChart(row)}
                      href="#"
                    >
                      {row.public_chart ? "Yes" : "No"}
                    </a>

                    <p className="col-span-3 text-sm">
                      {dateFormatter({
                        dateVar: row.created_at,
                        type: "time",
                      })}
                    </p>

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

          {filteredCharts?.length === 0 && (
            <p className="mt-4 text-md"> No charts found.</p>
          )}

          <ConfirmDialog
            open={deletedId ? true : false}
            setOpen={() => setDeletedId(undefined)}
            title="Delete chart?"
            description="Are sure you want to delete this chart?"
            confirmFunc={() => deleteChart(deletedId || -1)}
            id="popup"
            name="popup"
            buttonText="Delete"
            icon={<TrashIcon className="text-red-500" />}
            color="red"
          />
        </div>
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (!user || !token) {
    return {
      redirect: {
        destination: `/auth/signin`,
        permanent: false,
      },
    };
  }

  supabase.auth.setAuth(token);

  const { data: charts, error } = await supabase
    .from<Chart>("chart")
    .select(
      "id, title, chart_type, chart_meta_data, user_id(id, email), public_chart, query_id, org_id, created_at"
    )
    .match({ org_id: user.user_metadata.org_id });

  if (!charts || charts.length === 0) {
    return {
      props: {
        charts: [],
      },
    };
  }

  // Get only subset
  const subCharts = charts.filter(
    (q) => q.public_chart || q.org_id === user.user_metadata.org_id
  );

  return {
    props: {
      charts: subCharts,
    },
  };
};

export default Charts;
