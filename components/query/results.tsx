import InputLabel from "../individual/common/InputLabel";
import _ from "lodash";
import { CSVLink } from "react-csv";
import {
  ChartBarIcon,
  DownloadIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import Loading from "../individual/Loading";
import TableShell from "../individual/table/shell";
import TableHeader from "../individual/table/header";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

interface Props {
  data?: any;
  fields?: string[];
  queryLoading?: boolean;
  queryId?: string;
}

const Results: React.FC<Props> = (props) => {
  const { data, fields, queryLoading, queryId } = props;
  const router = useRouter();

  return (
    <div className="flex flex-col h-full w-full space-y-4  overflow-auto">
      <div className="flex flex-row items-center justify-between w-full mb-2">
        <InputLabel title="Results" />
        <div className="flex flex-row items-center justify-center space-x-4">
          {data && data.length > 0 && (
            <CSVLink data={data} filename={`data_${Date.now()}`}>
              <DownloadIcon className="block h-6 w-6 text-secondary-500" />
            </CSVLink>
          )}
          {data && data.length > 0 && !queryLoading && queryId && (
            <a
              onClick={() => router.push(`/queries/export/${queryId}`)}
              href="#"
            >
              <ShareIcon className="block h-6 w-6 text-secondary-500" />
            </a>
          )}
        </div>
      </div>
      {queryLoading && <Loading />}
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
