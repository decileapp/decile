import InputLabel from "../../../individual/common/InputLabel";
import _ from "lodash";
import { CSVLink } from "react-csv";
import {
  ChartBarIcon,
  DownloadIcon,
  DuplicateIcon,
  ShareIcon,
  TableIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Loading from "../../../individual/Loading";
import Button from "../../../individual/Button";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  dataState,
  fieldsState,
  queryIdState,
  queryTypeState,
  savingState,
} from "../../../../utils/contexts/query/state";
import ResultsTable from "./table";
import SaveQuery from "./SaveQuery";
import QueryTypeSelector from "../QueryType";

interface Props {
  queryLoading?: boolean;
  queryDb?: () => void;
  saveQuery?: () => void;
  copyQuery?: () => void;
  error?: string;
}

const Results: React.FC<Props> = (props) => {
  const [qId, setQid] = useRecoilState(queryIdState);
  const queryType = useRecoilValue(queryTypeState);
  const [fields, setFields] = useRecoilState(fieldsState);
  const [data, setData] = useRecoilState(dataState);
  const [saving, setSaving] = useRecoilState(savingState);
  const { queryLoading, queryDb, saveQuery, copyQuery, error } = props;
  const router = useRouter();

  return (
    <>
      {saving && saveQuery && (
        <SaveQuery open={saving} setOpen={setSaving} confirmFunc={saveQuery} />
      )}
      <div className="flex flex-col h-full w-full space-y-4  overflow-auto p-4">
        <div className="flex flex-row items-center justify-between w-full ">
          <InputLabel title="Results" />
          <div className="flex flex-row items-center justify-center space-x-4">
            <QueryTypeSelector />
            {data && data.length > 0 && (
              <CSVLink data={data} filename={`data_${Date.now()}`}>
                <DownloadIcon className="block h-6 w-6 text-secondary-500" />
              </CSVLink>
            )}
            {data && data.length > 0 && !queryLoading && qId && (
              <a onClick={() => router.push(`/queries/export/${qId}`)} href="#">
                <ShareIcon className="block h-6 w-6 text-secondary-500" />
              </a>
            )}
            {data &&
              data.length > 0 &&
              !queryLoading &&
              qId &&
              !saveQuery &&
              copyQuery && (
                <a onClick={() => copyQuery()} href="#">
                  <DuplicateIcon className="block h-6 w-6 text-secondary-500" />
                </a>
              )}
            {queryDb &&
              (!queryLoading ? (
                <Button
                  label="Run"
                  onClick={() => queryDb()}
                  type="secondary"
                />
              ) : (
                <div />
              ))}
            {!queryLoading && saveQuery && data && fields && (
              <Button
                label="Save"
                type="primary"
                onClick={() => (qId ? saveQuery() : setSaving(true))}
                disabled={saving}
              />
            )}
          </div>
        </div>

        {queryLoading && (
          <div className="flex h-96 w-full justify-center items-center">
            <Loading />
          </div>
        )}
        {error && (
          <p className="text-sm text-red-500">{`Error message: ${error}`}</p>
        )}
        {!error && fields && data && !queryLoading && <ResultsTable />}
      </div>
    </>
  );
};

export default Results;
