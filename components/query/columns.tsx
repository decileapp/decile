import { Column } from "../../types/Column";
import InputLabel from "../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../individual/MiniLoading";

interface Props {
  columns?: Column[];
  columnsLoading?: boolean;
}

const Columnns: React.FC<Props> = (props) => {
  const { columns, columnsLoading } = props;

  return (
    <>
      <InputLabel title="Fields" />
      <div className="mt-2">
        {columns && columns.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {columns.map((c, id) => {
              return (
                <div
                  className="flex flex-row space-x-1 justify-between items-center  key={id} border p-1 rounded-lg"
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
