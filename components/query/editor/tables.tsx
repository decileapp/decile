import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../../individual/MiniLoading";
import { useRecoilState } from "recoil";
import {
  selectedTableState,
  tableLoadingState,
  tablesState,
} from "../../../utils/contexts/query/state";
import { classNames } from "../../../utils/classnames";
import { Table } from "../../../types/Table";
import { ChevronLeftIcon } from "@heroicons/react/outline";

interface Props {
  changeTable: (x: Table) => void;
  setShowSchema: () => void;
}

const Tables: React.FC<Props> = (props) => {
  const [tableLoading, setTableLoading] = useRecoilState(tableLoadingState);
  const [tables, setTables] = useRecoilState(tablesState);
  const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);

  return (
    <>
      <div className="flex-row flex justify-between items-center">
        <InputLabel title="Tables" />
        <ChevronLeftIcon
          className="h-5 w-5 hover:text-primary-500"
          onClick={() => props.setShowSchema()}
        />
      </div>
      <div className="mt-2">
        {!tableLoading && tables && tables.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {tables.map((c, id) => {
              return (
                <a
                  className={classNames(
                    selectedTable === c ? "text-primary-500" : "",
                    " text-sm truncate"
                  )}
                  href="#"
                  onClick={() => props.changeTable(c)}
                >
                  {c.name}
                </a>
              );
            })}
          </div>
        )}
        {tableLoading && <MiniLoading />}
      </div>
    </>
  );
};

export default Tables;
