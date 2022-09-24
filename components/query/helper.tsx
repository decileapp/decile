import InputLabel from "../individual/common/InputLabel";
import _ from "lodash";
import Editor from "@monaco-editor/react";
import Button from "../individual/Button";
import TextArea from "../individual/TextArea";

interface Props {
  aiQuery: () => void;
  setQuestion: (x: string | undefined) => void;
  question?: string;
}

const Helper: React.FC<Props> = (props) => {
  const { question, setQuestion, aiQuery } = props;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-row items-start justify-between w-full">
        <InputLabel title="Query" />
        <Button label="Ask" onClick={() => aiQuery()} type="secondary" />
      </div>

      <TextArea
        title="Ask a question"
        handleChange={setQuestion}
        name="askQuestion"
        id="askQuestion"
        label="Who had the largest area in 2022?"
        value={question || ""}
      />
    </div>
  );
};

export default Helper;
