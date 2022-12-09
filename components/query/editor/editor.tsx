import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import Editor, { useMonaco } from "@monaco-editor/react";
import Button from "../../individual/Button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  bodyState,
  dataState,
  fieldsState,
  queryTypeState,
  selectedSourceState,
  sourceSchemaState,
  textQueryState,
} from "../../../utils/contexts/query/state";
import { ChevronRightIcon } from "@heroicons/react/outline";
import TextArea from "../../individual/TextArea";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import MiniLoading from "../../individual/MiniLoading";
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
  const [textQuery, setTextQuery] = useRecoilState(textQueryState);
  const [queryType, setQueryType] = useRecoilState(queryTypeState);
  const [schema, setSchema] = useRecoilState(sourceSchemaState);
  const [generatingQuery, setGeneratingQuery] = useState(false);
  const [textSqlError, setTextSqlError] = useState(false);
  const setData = useSetRecoilState(dataState);
  const setFields = useSetRecoilState(fieldsState);
  const monaco = useMonaco();
  const { theme } = useTheme();

  const textToSql = async () => {
    try {
      const selectedDb = sources.find((s) => s.id === selectedSource);

      setGeneratingQuery(true);
      setData(null);
      setFields(null);
      setTextSqlError(false);
      const res = await axios.post("/api/user/postgres/text-to-sql", {
        queryText: textQuery,
        schema: schema,
        ...selectedDb,
      });
      if (res.data.error) {
        setBody(res.data.sqlQuery);
        setQueryType("sql");
        toast.error("Failed to fetch data");
        setGeneratingQuery(false);
        return;
      }
      if (res.data) {
        setBody(res.data.sqlQuery);
        const fields: string[] = res.data.fields.map((f: any) => f.name);
        const rows: {}[] = res.data.rows;
        setFields(fields);
        setData(rows);
        setQueryType("sql");
      }
      setGeneratingQuery(false);
      return;
    } catch (e) {
      setGeneratingQuery(false);
      toast.error("Something went wrong.");

      return;
    }
  };

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
              label={queryType === "sql" ? "Run" : "Ask"}
              onClick={() => (queryType === "sql" ? queryDb() : textToSql())}
              type={queryType === "sql" ? "secondary" : "primary"}
            />
          ) : (
            <div />
          )}
        </div>
      </div>

      {!selectedSource && (
        <p className="text-sm">Please select a source to get started.</p>
      )}

      {textSqlError && (
        <div className="p-2 border rounded-lg mb-2 bg-white dark:bg-zinc-700 ">
          <p className="text-xs text-zinc-500 dark:text-white">
            Your AI generated query returned an error. Check your query and try
            again.
          </p>
        </div>
      )}

      {queryType === "sql" && !generatingQuery && selectedSource && (
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
            autoIndent: "full",
          }}
        />
      )}
      {queryType === "ai" && !generatingQuery && selectedSource && (
        <TextArea
          name="textQuery"
          id="textQuery"
          handleChange={setTextQuery}
          value={textQuery || ""}
          label="Write a SQL query to get companies and their annual sales in 2021. Rank the companies in descending order of sales."
        />
      )}
      {generatingQuery && (
        <div className="flex flex-col h-full w-full items-center justify-center">
          <MiniLoading />
        </div>
      )}
    </div>
  );
};

export default EditorComp;
