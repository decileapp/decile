import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import Editor from "@monaco-editor/react";
import Button from "../../individual/Button";
import { useRecoilState } from "recoil";
import { bodyState } from "../../../utils/contexts/query/state";

interface Props {
  queryDb: () => void;
  queryLoading?: boolean;
  stopQuery: () => void;
}

const Results: React.FC<Props> = (props) => {
  const { queryDb, stopQuery, queryLoading } = props;
  const [body, setBody] = useRecoilState(bodyState);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-row items-start justify-between w-full ">
        <InputLabel title="Query" />
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
            <Button label="Run" onClick={() => queryDb()} type="secondary" />
          ) : (
            <div />
          )}
        </div>
      </div>

      <Editor
        theme="vs-dark"
        defaultLanguage="sql"
        defaultValue={body ? body : "select * from users limit 10;"}
        onChange={(evn) => setBody(evn)}
      />
    </div>
  );
};

export default Results;
