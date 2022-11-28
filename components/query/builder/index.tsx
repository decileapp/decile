import _ from "lodash";
import QueryFilterSelector from "./QueryFilterSelector";
import QueryTableSelector from "./TableSelector";
import QueryVariableSelector from "./QueryVariableSelector";
import QuerySortLimit from "./QuerySortLimit";
import QueryGroupBy from "./QueryGroupBy";
import { Table } from "../../../types/Table";
import DatabaseSelector from "../common/DatabaseSelector";
import { Source } from "../../../types/Sources";

interface Props {
  changeTable: (x: Table) => void;
  changeDatabase: (x: number) => void;
  sources: Source[];
}

const QueryBuilder: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col h-full w-full space-y-6 p-4  overflow-auto">
      <div className="w-1/2">
        <DatabaseSelector
          changeDatabase={props.changeDatabase}
          sources={props.sources}
        />
      </div>
      <QueryTableSelector changeTable={props.changeTable} />
      <QueryVariableSelector />
      <QueryFilterSelector />
      <QueryGroupBy />
      <QuerySortLimit />
    </div>
  );
};

export default QueryBuilder;
