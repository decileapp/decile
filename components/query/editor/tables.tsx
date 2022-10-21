import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../../individual/MiniLoading";
import { useRecoilState } from "recoil";
import {
  tableLoadingState,
  tablesState,
} from "../../../utils/contexts/query/state";

const Tables: React.FC = () => {
  const [tablesLoding, setTablesLoading] = useRecoilState(tableLoadingState);
  const [tables, setTables] = useRecoilState(tablesState);

  return (
    <>
      <InputLabel title="Tables" />
      <div className="mt-2">
        {tables && tables.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {tables.map((c, id) => {
              return <p className=" text-sm truncate">{c.name}</p>;
            })}
          </div>
        )}
        {tablesLoding && <MiniLoading />}
      </div>
    </>
  );
};

export default Tables;
