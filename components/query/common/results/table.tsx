import _ from "lodash";
import TableShell from "../../../individual/table/shell";
import TableHeader from "../../../individual/table/header";
import { useRecoilState } from "recoil";
import { dataState, fieldsState } from "../../../../utils/contexts/query/state";

const ResultsTable: React.FC = () => {
  const [fields, setFields] = useRecoilState(fieldsState);
  const [data, setData] = useRecoilState(dataState);

  return (
    <TableShell>
      <TableHeader labels={fields} />

      <tbody className="divide-y divide-gray-200 ">
        {data.map((row: any, id: number) => {
          return (
            <tr key={id}>
              {Object.keys(row).map((value, xid) => {
                return (
                  <td
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-xs   sm:pl-6"
                    key={xid}
                  >
                    {typeof row[value] === "object"
                      ? JSON.stringify(row[value])
                      : row[value]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </TableShell>
  );
};

export default ResultsTable;
