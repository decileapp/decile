import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import { CSVLink } from "react-csv";
import {
  DownloadIcon,
  DuplicateIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import TableShell from "../../individual/table/shell";
import TableHeader from "../../individual/table/header";
import { useRouter } from "next/router";
import Loading from "../../individual/Loading";
import Button from "../../individual/Button";
import { useRecoilState } from "recoil";
import {
  dataState,
  fieldsState,
  queryIdState,
} from "../../../utils/contexts/query/state";

interface Props {
  queryLoading?: boolean;
  queryDb?: () => void;
  saveQuery?: () => void;
  copyQuery?: () => void;
}

const Results: React.FC<Props> = (props) => {
  const [qId, setQid] = useRecoilState(queryIdState);
  const [fields, setFields] = useRecoilState(fieldsState);
  const [data, setData] = useRecoilState(dataState);
  const { queryLoading, queryDb, saveQuery, copyQuery } = props;
  const router = useRouter();

  return (
    <div className="flex flex-col h-full w-full space-y-4  overflow-auto p-4">
      <div className="flex flex-row items-center justify-between w-full ">
        <InputLabel title="Results" />
        <div className="flex flex-row items-center justify-center space-x-4">
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
          {!queryLoading && queryDb ? (
            <Button label="Run" onClick={() => queryDb()} type="secondary" />
          ) : (
            <div />
          )}
          {!queryLoading && data && fields && saveQuery && (
            <Button label="Save" type="primary" onClick={() => saveQuery()} />
          )}
        </div>
      </div>

      {queryLoading && (
        <div className="flex h-96 w-full justify-center items-center">
          <Loading />
        </div>
      )}
      {fields && data && !queryLoading && (
        <TableShell>
          <TableHeader labels={fields} />

          <tbody className="divide-y divide-gray-200 ">
            {data.map((row: any, id: number) => {
              return (
                <tr key={id}>
                  {Object.keys(row).map((value, id) => {
                    return (
                      <td
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6"
                        key={id}
                      >
                        {row[value]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      )}
    </div>
  );
};

export default Results;
