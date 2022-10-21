import _ from "lodash";
import Columnns from "./columns";
import Editor from "./editor";
import Tables from "./tables";

interface Props {
  queryDb: () => void;
  stopQuery: () => void;
  queryLoading?: boolean;
}

const QueryEditor: React.FC<Props> = (props) => {
  const { queryDb, stopQuery, queryLoading } = props;

  return (
    <div className="grid grid-cols-6 h-full w-full min-h-0 overflow-hidden">
      <div className="col-span-2 flex flex-col  border-r border-zinc-400  h-full w-full overflow-auto">
        <div className="flex flex-col w-full h-full  ">
          <div className="flex flex-col h-36 w-full p-4 overflow-auto">
            <Tables />
          </div>

          <div className="flex flex-col flex-1 h-full w-full p-4 overflow-auto">
            <Columnns />
          </div>
        </div>
      </div>

      {/* EDITOR */}
      <div className="col-span-4 flex flex-col h-full p-4">
        <Editor
          queryDb={queryDb}
          queryLoading={queryLoading}
          stopQuery={stopQuery}
        />
      </div>
    </div>
  );
};

export default QueryEditor;
