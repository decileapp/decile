import InputLabel from "../individual/common/InputLabel";
import _ from "lodash";
import { classNames } from "../../utils/classnames";
import MiniLoading from "../individual/MiniLoading";
import { CheckIcon } from "@heroicons/react/outline";

interface Props {
  tables?: string[];
  selectedTable?: string;
  setSelectedTable?: (x: string) => void;
  tableLoading?: boolean;
}

const Tables: React.FC<Props> = (props) => {
  const { tables, tableLoading, selectedTable, setSelectedTable } = props;

  return (
    <>
      <div className="flex flex-col justify-start px-2 h-full w-full">
        <InputLabel title="Tables" />
        <div className="mt-2">
          {tables && tables.length > 0 && setSelectedTable && (
            <div className="grid grid-cols-1 gap-2 overflow-auto">
              {tables.map((c, id) => {
                return (
                  <div className="flex flex-row items-center justify-between">
                    <p
                      className={classNames(
                        c === selectedTable
                          ? "text-primary-600  dark:bg-primary-500"
                          : "",
                        " p-1 rounded-md text-sm truncate"
                      )}
                      onClick={() => setSelectedTable(c)}
                      key={id}
                    >
                      {c}
                    </p>
                    {selectedTable === c && (
                      <CheckIcon className="h-4 w-4 ml-2 text-primary-600" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {tableLoading && <MiniLoading />}
      </div>
    </>
  );
};

export default Tables;
