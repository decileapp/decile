import _ from "lodash";
import { useState } from "react";
import { Table } from "../../../types/Table";
import { classNames } from "../../../utils/classnames";
import Columnns from "./columns";
import Editor from "./editor";
import Tables from "./tables";

interface Props {
  queryDb: () => void;
  stopQuery: () => void;
  queryLoading?: boolean;
  changeTable: (x: Table) => void;
}

const QueryEditor: React.FC<Props> = (props) => {
  const { queryDb, stopQuery, queryLoading, changeTable } = props;
  const [showSchema, setShowSchema] = useState(true);

  return (
    <div className="grid grid-cols-6 h-full w-full min-h-0 overflow-hidden">
      {showSchema && (
        <div className="col-span-2 flex flex-col  border-r border-zinc-400  h-full w-full overflow-hidden">
          <div className="flex flex-col w-full h-full  overflow-auto">
            <div className="flex flex-col w-full p-4 ">
              <Tables
                changeTable={changeTable}
                setShowSchema={() => setShowSchema(false)}
              />
            </div>

            <div className="flex flex-col flex-1 w-full p-4 ">
              <Columnns />
            </div>
          </div>
        </div>
      )}

      {/* EDITOR */}
      <div
        className={classNames(
          showSchema ? "col-span-4" : "col-span-6",
          "flex flex-col h-full p-4"
        )}
      >
        <Editor
          queryDb={queryDb}
          queryLoading={queryLoading}
          stopQuery={stopQuery}
          setShowSchema={() => setShowSchema(true)}
          showSchema={showSchema}
        />
      </div>
    </div>
  );
};

export default QueryEditor;
