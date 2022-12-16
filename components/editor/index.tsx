import _ from "lodash";
import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { bodyState } from "../../utils/contexts/query/state";

interface Props {
  suggestions?: string[];
  handleChange: (evn: string) => void;
  defaultValue?: string;
  allowExecution: boolean;
}

const CodeEditor: React.FC<Props> = (props) => {
  const { defaultValue, suggestions, allowExecution, handleChange } = props;

  const { theme } = useTheme();
  const monaco = useMonaco();

  function createSuggestions(range: any) {
    if (!monaco || !suggestions) {
      return;
    }

    suggestions.map((s) => {
      return {
        label: s,
        kind: monaco.languages.CompletionItemKind.Property,
        insertText: s,
        documentation: "The Lodash library exported as Node.js modules.",
        range: range,
      };
    });
  }

  // useEffect(() => {
  //   // Suggestions
  //   monaco?.languages.registerCompletionItemProvider("sql", {
  //     provideCompletionItems: function (model, position) {
  //       // find out if we are completing a property in the 'dependencies' object.
  //       var textUntilPosition = model.getValueInRange({
  //         startLineNumber: 1,
  //         startColumn: 1,
  //         endLineNumber: position.lineNumber,
  //         endColumn: position.column,
  //       });
  //       var match = textUntilPosition.match(
  //         /"dependencies"\s*:\s*\{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/
  //       );
  //       if (!match) {
  //         return { suggestions: [] };
  //       }
  //       var word = model.getWordUntilPosition(position);
  //       var range = {
  //         startLineNumber: position.lineNumber,
  //         endLineNumber: position.lineNumber,
  //         startColumn: word.startColumn,
  //         endColumn: word.endColumn,
  //       };
  //       return {
  //         suggestions: createSuggestions(range),
  //       };
  //     },
  //   });
  // }, []);

  return (
    <Editor
      theme={theme === "light" ? "vs-light" : "vs-dark"}
      language="sql"
      defaultValue={
        defaultValue ? defaultValue : "select * from actor limit 10;"
      }
      onChange={(evn) => (evn ? handleChange(evn) : "")}
      options={{
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
};

export default CodeEditor;
