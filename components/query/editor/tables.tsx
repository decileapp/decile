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

const Tables: React.FC = () => {
  const [tablesLoding, setTablesLoading] = useRecoilState(tableLoadingState);
  const [tables, setTables] = useRecoilState(tablesState);
  const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);

  return (
    <>
      <InputLabel title="Tables" />
      <div className="mt-2">
        {tables && tables.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {tables.map((c, id) => {
              return (
                <a
                  className={classNames(
                    selectedTable === c ? "text-primary-500" : "",
                    " text-sm truncate"
                  )}
                  href="#"
                  onClick={() => setSelectedTable(c)}
                >
                  {c.name}
                </a>
              );
            })}
          </div>
        )}
        {tablesLoding && <MiniLoading />}
      </div>
    </>
  );
};

export default Tables;
