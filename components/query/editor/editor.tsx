import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import Editor from "@monaco-editor/react";
import Button from "../../individual/Button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  bodyState,
  selectedSourceState,
} from "../../../utils/contexts/query/state";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { Source } from "../../../types/Sources";
import { useTheme } from "next-themes";

interface Props {
  queryDb: () => void;
  queryLoading?: boolean;
  stopQuery: () => void;
  showSchema: boolean;
  setShowSchema: () => void;
  sources: Source[];
}

const EditorComp: React.FC<Props> = (props) => {
  const { queryDb, stopQuery, queryLoading, sources } = props;
  const [body, setBody] = useRecoilState(bodyState);
  const selectedSource = useRecoilValue(selectedSourceState);
  const { theme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row items-start justify-between w-full mb-2">
        <div className="flex flex-row">
          {!props.showSchema && (
            <ChevronRightIcon
              className="h-5 w-5 mr-2 hover:text-primary-500"
              onClick={() => props.setShowSchema()}
            />
          )}
          <InputLabel title="Query" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {queryLoading ? (
            <Button
              label="Stop"
              onClick={() => stopQuery()}
              type="outline-secondary"
            />
          ) : (
            <div />
          )}
          {!queryLoading ? (
            <Button
              label={"Run"}
              onClick={() => queryDb()}
              type={"secondary"}
              disabled={body ? false : true}
            />
          ) : (
            <div />
          )}
        </div>
      </div>

      {!selectedSource && (
        <p className="text-sm">Please select a source to get started.</p>
      )}

      {selectedSource && (
        <Editor
          theme={theme === "light" ? "vs-light" : "vs-dark"}
          language="sql"
          defaultValue={body ? body : "select * from users limit 10;"}
          onChange={(evn) => {
            setBody(evn);
            return;
          }}
          options={{
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      )}
    </div>
  );
};

export default EditorComp;
