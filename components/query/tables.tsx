import InputLabel from "../individual/common/InputLabel";
import _ from "lodash";
import { classNames } from "../../utils/classnames";
import MiniLoading from "../individual/MiniLoading";

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
      <div className="flex flex-col justify-start border-b border-zinc-400 px-2 h-full w-full">
        <InputLabel title="Tables" />
        <div className="mt-2">
          {tables && tables.length > 0 && setSelectedTable && (
            <div className="grid grid-cols-1 gap-2 overflow-auto">
              {tables.map((c, id) => {
                return (
                  <p
                    className={classNames(
                      c === selectedTable
                        ? "bg-primary-200 dark:bg-primary-500"
                        : "",
                      "border p-1 rounded-lg text-sm truncate"
                    )}
                    onClick={() => setSelectedTable(c)}
                    key={id}
                  >
                    {c}
                  </p>
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
