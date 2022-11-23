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
import { useRecoilState } from "recoil";
import {
  dataState,
  fieldsState,
  queryIdState,
  savingState,
} from "../../../../utils/contexts/query/state";
import { useState } from "react";
import ChartContainer from "../../../graphs/common/ChartContainer";
import ResultsTable from "./table";

interface Props {
  queryLoading?: boolean;
  queryDb?: () => void;
  saveQuery?: () => void;
  copyQuery?: () => void;
  error?: string;
}

const QueryView: React.FC<Props> = (props) => {
  const [qId, setQid] = useRecoilState(queryIdState);
  const [fields, setFields] = useRecoilState(fieldsState);
  const [data, setData] = useRecoilState(dataState);
  const [saving, setSaving] = useRecoilState(savingState);
  const { queryLoading, queryDb, saveQuery, copyQuery, error } = props;
  const [graph, setGraph] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col h-full w-full space-y-4  overflow-auto p-4">
      <div className="flex flex-row items-center justify-between w-full ">
        <InputLabel title="Results" />
        <div className="flex flex-row items-center justify-center space-x-4">
          {data &&
            data.length > 0 &&
            (graph ? (
              <a href="#" onClick={() => setGraph(false)}>
                <TableIcon className="block h-6 w-6 text-secondary-500" />
              </a>
            ) : (
              <a href="#" onClick={() => setGraph(true)}>
                <ChartBarIcon className="block h-6 w-6 text-secondary-500" />
              </a>
            ))}
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
              <Button label="Run" onClick={() => queryDb()} type="secondary" />
            ) : (
              <div />
            ))}
          {!queryLoading && saveQuery && (
            <Button
              label="Save"
              type="primary"
              onClick={() => saveQuery()}
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
      {!error && fields && data && !queryLoading && !graph && <ResultsTable />}
      {!error && fields && data && !queryLoading && graph && qId && (
        <ChartContainer fields={fields} data={data} queryId={qId} />
      )}
    </div>
  );
};

export default QueryView;
