import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../../individual/MiniLoading";
import MiniSelect from "../../individual/MiniSelect";
import { useRecoilState } from "recoil";
import {
  queryLimitState,
  selectedTableState,
  tableLoadingState,
  tablesState,
} from "../../../utils/contexts/query/state";

const TableSelector: React.FC<{ queryBuilder?: boolean }> = (props) => {
  const [tables, setTables] = useRecoilState(tablesState);
  const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);
  const [tableLoading, setTableLoading] = useRecoilState(tableLoadingState);
  const [queryLimit, setQueryLimit] = useRecoilState(queryLimitState);

  const tableOptions =
    tables && tables.length > 0
      ? tables.map((q) => {
          return {
            title: q.name,
            description: "",
            current: false,
            value: `${q.schema}.${q.name}`,
          };
        })
      : [];
  return (
    <>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="flex flex-row justify-between items-center mb-1 w-full ">
          <div className="flex flex-row justify-start items-center">
            <InputLabel title="Select Table" />
          </div>
          {props.queryBuilder && (
            <div className="flex flex-row justify-end items-center space-x-1 ">
              <p className="text-sm font-bold">Rows</p>
              <input
                className="border rounded-md text-sm p-1 flex-grow-0 w-20"
                value={queryLimit}
                onChange={(e) => setQueryLimit(e.target.value)}
              />
            </div>
          )}
        </div>
        {tables &&
          tableOptions &&
          tableOptions.length > 0 &&
          setSelectedTable && (
            <MiniSelect
              options={tableOptions}
              setSelected={(x) =>
                setSelectedTable(tables.find((t) => t.name === x.title))
              }
              selected={
                tableOptions.find((s) => s.title === selectedTable?.name) ||
                tableOptions[0]
              }
            />
          )}
        {tableLoading && <MiniLoading />}
      </div>
    </>
  );
};

export default TableSelector;
