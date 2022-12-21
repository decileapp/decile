import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
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
import { ChevronRightIcon, PencilIcon } from "@heroicons/react/outline";
import TextArea from "../../individual/TextArea";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import MiniLoading from "../../individual/MiniLoading";
import { Source } from "../../../types/Sources";
import { useTheme } from "next-themes";
import SyntaxHighlighter from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";

interface Props {
  queryLoading?: boolean;
  stopQuery: () => void;
  showSchema: boolean;
  setShowSchema: () => void;
  sources: Source[];
}

const AskEditor: React.FC<Props> = (props) => {
  const { stopQuery, queryLoading, sources } = props;
  const [body, setBody] = useRecoilState(bodyState);
  const selectedSource = useRecoilValue(selectedSourceState);
  const [textQuery, setTextQuery] = useRecoilState(textQueryState);
  const [queryType, setQueryType] = useRecoilState(queryTypeState);
  const [schema, setSchema] = useRecoilState(sourceSchemaState);
  const setData = useSetRecoilState(dataState);
  const setFields = useSetRecoilState(fieldsState);
  const { theme } = useTheme();

  const [generatingQuery, setGeneratingQuery] = useState(false);
  const [textSqlError, setTextSqlError] = useState(false);
  const [queryComplete, setQueryComplete] = useState(false);

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
        setQueryComplete(true);
      }
      setGeneratingQuery(false);
      return;
    } catch (e) {
      setGeneratingQuery(false);
      toast.error("Something went wrong.");

      return;
    }
  };

  useEffect(() => {
    if (textQuery) {
      setQueryComplete(true);
    }
  }, []);

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
          {!queryLoading && !queryComplete ? (
            <Button
              label={"Ask"}
              onClick={() => textToSql()}
              type={"primary"}
              disabled={textQuery ? false : true}
            />
          ) : (
            <Button
              label={"Edit"}
              onClick={() => {
                setQueryComplete(false);
              }}
              type={"outline-primary"}
              disabled={textQuery ? false : true}
            />
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

      {!generatingQuery && selectedSource && !queryComplete && (
        <TextArea
          name="textQuery"
          id="textQuery"
          handleChange={setTextQuery}
          value={textQuery || ""}
          label="Ask for the data you want. For example: 'Find all actors'. Include the names of tables and columns for best results."
        />
      )}

      {generatingQuery && (
        <div className="flex flex-col h-full w-full items-center justify-center">
          <MiniLoading />
        </div>
      )}

      {queryComplete && (
        <div className="flex flex-col justify-start items-start space-y-4 h-full w-full">
          <p className="text-sm">
            <span className="text-sm font-semibold">Question: </span>
            {textQuery}
          </p>

          <div className="flex flex-col justify-start items-start space-y-2 h-full w-full">
            <div className="flex flex-row justify-between items-center  w-full">
              <p className="text-sm font-semibold">Generated SQL</p>
            </div>
            {body && (
              <div className="text-sm text-prose h-full overflow-hidden mr-5">
                <ReactMarkdown
                  children={"```\n".concat(body).concat("\n```")}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      return !inline ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, "")}
                          language={"sql"}
                          PreTag="div"
                          style={dracula}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AskEditor;
