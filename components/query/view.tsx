import { useState } from "react";
import Page from "../layouts/Page";
import { Source } from "../../types/Sources";
import { toast } from "react-toastify";
import _ from "lodash";
import Results from "./common/results/QueryView";
import {
  bodyState,
  nameState,
  publicQueryState,
  queryBuilderState,
  queryFilterState,
  queryGroupByState,
  queryIdState,
  queryLimitState,
  querySortByState,
  queryUpdatedAtState,
  queryVarsState,
  selectedSourceState,
  selectedTableState,
} from "../../utils/contexts/query/state";
import { useRecoilState, useRecoilValue } from "recoil";
import InputLabel from "../individual/common/InputLabel";
import dateFormatter from "../../utils/dateFormatter";
import { useRouter } from "next/router";
import { PencilIcon } from "@heroicons/react/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

interface Props {
  sources?: Source[];
  owner?: boolean;
}

const QueryView: React.FC<Props> = (props) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  // Type
  const queryBuilder = useRecoilValue(queryBuilderState);

  /* Global states */

  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);

  // Tables

  const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);

  // Query
  const queryId = useRecoilValue(queryIdState);
  const [name, setName] = useRecoilState(nameState);
  const [body, setBody] = useRecoilState(bodyState);
  const publicQuery = useRecoilValue(publicQueryState);
  const [savedAt, setSavedAt] = useRecoilState(queryUpdatedAtState);
  const [queryVars, setQueryVars] = useRecoilState(queryVarsState);
  const [queryFilterBy, setQueryFilterBy] = useRecoilState(queryFilterState);
  const [queryGroupBy, setQueryGroupBy] = useRecoilState(queryGroupByState);
  const [querySortBy, setQuerySortBy] = useRecoilState(querySortByState);
  const [queryLimit, setQueryLimit] = useRecoilState(queryLimitState);

  const user = useUser();

  /* Local states */
  const [queryLoading, setQueryLoading] = useState(false);

  // Error
  const [error, setError] = useState<string | undefined>();

  async function copyQuery() {
    try {
      let { data, error } = await supabase
        .from("queries")
        .insert({
          name: `Copy of ${name}`,
          database: selectedSource,
          body: body,
          public_query: false,
          user_id: user?.id,
          updated_at: new Date(Date.now()),
          query_vars: queryVars,
          query_filter_by: queryFilterBy,
          query_group_by: queryGroupBy,
          query_sort_by: querySortBy,
          query_limit: queryLimit,
          query_table:
            selectedTable && `${selectedTable?.schema}.${selectedTable?.name}`,
          org_id: user?.user_metadata.org_id,
          query_builder: queryBuilder,
        })
        .select("id")
        .single();
      setName(`Copy of ${name}`);
      if (data) {
        router.push(`/queries/edit/${data.id}`);
      }
      return;
    } catch (error: any) {
      toast.error("Failed to copy query");
    }
  }

  return (
    <>
      <Page padding={false}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex flex-col p-4 space-y-2">
            <div className="flex flex-row  items-center justify-between">
              <p className="text-sm font-bold">Query details</p>
              {props.owner && (
                <a
                  onClick={() => router.push(`/queries/edit/${queryId}`)}
                  href="#"
                >
                  <PencilIcon className="block h-5 w-5 text-secondary-500" />
                </a>
              )}
            </div>
            <div className="flex flex-row  space-x-4">
              {props.sources && (
                <div className="flex flex-row space-x-2">
                  <InputLabel title="Source" />
                  <p className="text-sm">
                    {props.sources.find((s) => s.id === selectedSource)?.name}
                  </p>
                </div>
              )}
              <div className="flex flex-row space-x-2">
                <InputLabel title="Name" />
                <p className="text-sm">{name}</p>
              </div>
              {savedAt && (
                <div className="flex flex-row space-x-2">
                  <InputLabel title="Updated at" />
                  <p className="text-sm ">{`Last saved: ${dateFormatter({
                    dateVar: savedAt,
                    type: "time",
                  })}`}</p>
                </div>
              )}
            </div>
          </div>

          {/* Top bar */}

          <Results
            queryLoading={queryLoading}
            copyQuery={copyQuery}
            error={error}
          />
        </div>
      </Page>
    </>
  );
};

export default QueryView;
