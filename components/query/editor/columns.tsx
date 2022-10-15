import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../../individual/MiniLoading";
import { useRecoilState } from "recoil";
import {
  columnsLoadingState,
  columnsState,
} from "../../../utils/contexts/query/state";

const Columnns: React.FC = () => {
  const [columnsLoading, setColumnsLoading] =
    useRecoilState(columnsLoadingState);
  const [columns, setColumns] = useRecoilState(columnsState);

  return (
    <>
      <InputLabel title="Fields" />
      <div className="mt-2">
        {columns && columns.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {columns.map((c, id) => {
              return (
                <div
                  className="flex flex-row space-x-1 justify-between items-center  key={id} border rounded-lg p-1"
                  key={id}
                >
                  <p className=" text-sm truncate">{c.name}</p>
                  <p className=" text-xs truncate italic" key={id}>
                    {c.type}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {columnsLoading && <MiniLoading />}
      </div>
    </>
  );
};

export default Columnns;
