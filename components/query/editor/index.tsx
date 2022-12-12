import { ChevronLeftIcon } from "@heroicons/react/outline";
import _ from "lodash";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { Source } from "../../../types/Sources";
import { Table } from "../../../types/Table";
import { classNames } from "../../../utils/classnames";
import {
  queryTypeState,
  selectedSourceState,
} from "../../../utils/contexts/query/state";
import InputLabel from "../../individual/common/InputLabel";
import DatabaseSelector from "../common/DatabaseSelector";
import AskEditor from "./ask";
import Columnns from "./columns";
import Editor from "./editor";
import Tables from "./tables";

interface Props {
  queryDb: () => void;
  stopQuery: () => void;
  queryLoading?: boolean;
  changeTable: (x: Table) => void;
  sources: Source[];
  changeDatabase: (x: string) => void;
}

const QueryEditor: React.FC<Props> = (props) => {
  const {
    queryDb,
    stopQuery,
    queryLoading,
    changeTable,
    sources,
    changeDatabase,
  } = props;
  const [showSchema, setShowSchema] = useState(true);
  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);
  const [queryType, setQueryType] = useRecoilState(queryTypeState);

  return (
    <div className="grid grid-cols-6 h-full w-full min-h-0 overflow-hidden">
      {showSchema && (
        <div className="col-span-2 flex flex-col  border-r border-zinc-400  h-full w-full overflow-hidden">
          <div className="flex flex-col w-full h-full  overflow-auto">
            <div className="flex flex-col w-full p-4 ">
              <DatabaseSelector
                sources={sources}
                changeDatabase={changeDatabase}
                setShowSchema={setShowSchema}
              />
            </div>
            <div className="flex flex-col w-full p-4 ">
              <Tables changeTable={changeTable} />
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
        {queryType === "sql" && (
          <Editor
            queryDb={queryDb}
            queryLoading={queryLoading}
            stopQuery={stopQuery}
            setShowSchema={() => setShowSchema(true)}
            showSchema={showSchema}
            sources={sources}
          />
        )}
        {queryType === "ai" && (
          <AskEditor
            queryLoading={queryLoading}
            stopQuery={stopQuery}
            setShowSchema={() => setShowSchema(true)}
            showSchema={showSchema}
            sources={sources}
          />
        )}
      </div>
    </div>
  );
};

export default QueryEditor;
