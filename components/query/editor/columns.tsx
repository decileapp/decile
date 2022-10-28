import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../../individual/MiniLoading";
import { useRecoilState } from "recoil";
import {
  columnsLoadingState,
  columnsState,
} from "../../../utils/contexts/query/state";
import { isNumerical } from "../../../utils/query";
import { classNames } from "../../../utils/classnames";

const Columnns: React.FC = () => {
  const [columnsLoading, setColumnsLoading] =
    useRecoilState(columnsLoadingState);
  const [columns, setColumns] = useRecoilState(columnsState);

  // Sort columns
  const numerical = columns?.filter((c) => isNumerical(c.type));
  const textual = columns?.filter((c) => !isNumerical(c.type));
  let sortedColumns = textual;
  if (numerical) {
    sortedColumns = textual?.concat(numerical);
  }

  return (
    <>
      <InputLabel title="Columns" />
      <div className="mt-2">
        {sortedColumns && sortedColumns.length > 0 && !columnsLoading && (
          <div className="grid grid-cols-1 gap-3">
            {sortedColumns.map((c, id) => {
              return (
                <div
                  className={
                    "flex flex-row space-x-1 justify-between items-center  key={id}  rounded-lg "
                  }
                  key={id}
                >
                  <p className=" text-sm truncate">{c.name}</p>
                  <p
                    className={classNames(
                      isNumerical(c.type)
                        ? "text-primary-600"
                        : "text-secondary-600",
                      "text-xs truncate italic"
                    )}
                    key={id}
                  >
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
