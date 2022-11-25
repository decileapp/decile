import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../../individual/MiniLoading";
import MiniSelect from "../../individual/MiniSelect";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  queryBuilderState,
  queryLimitState,
  selectedTableState,
  tableLoadingState,
  tablesState,
} from "../../../utils/contexts/query/state";
import { Table } from "../../../types/Table";

interface Props {
  changeTable: (x: Table) => void;
}

const TableSelector: React.FC<Props> = (props) => {
  const [tables, setTables] = useRecoilState(tablesState);
  const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);
  const [tableLoading, setTableLoading] = useRecoilState(tableLoadingState);
  const [queryLimit, setQueryLimit] = useRecoilState(queryLimitState);
  const queryBuilder = useRecoilValue(queryBuilderState);
  const { changeTable } = props;

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
      <div className="flex flex-col w-full ">
        <div className="flex flex-row justify-between items-center mb-1 w-full ">
          <div className="flex flex-row justify-start items-center">
            <InputLabel title="Select Table" />
          </div>
          {queryBuilder && (
            <div className="flex flex-row justify-end items-center space-x-2 ">
              <p className="text-sm font-bold">Rows</p>
              <input
                className="border rounded-md text-sm p-1 flex-grow-0 w-20"
                value={queryLimit}
                onChange={(e) => setQueryLimit(e.target.value)}
              />
            </div>
          )}
        </div>
        {!tableLoading && tables && tableOptions && tableOptions.length > 0 && (
          <MiniSelect
            options={tableOptions}
            setSelected={(x) =>
              changeTable(tables.find((t) => t.name === x.title) || tables[0])
            }
            selected={tableOptions.find((s) => s.title === selectedTable?.name)}
          />
        )}
        {tableLoading && <MiniLoading />}
      </div>
    </>
  );
};

export default TableSelector;
