import _ from "lodash";
import QueryFilterSelector from "./QueryFilterSelector";
import QueryTableSelector from "./TableSelector";
import QueryVariableSelector from "./QueryVariableSelector";
import QuerySortLimit from "./QuerySortLimit";
import QueryGroupBy from "./QueryGroupBy";
import { Table } from "../../../types/Table";

interface Props {
  changeTable: (x: Table) => void;
}

const QueryBuilder: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col h-full w-full space-y-6 p-4  overflow-auto">
      <QueryTableSelector queryBuilder={true} changeTable={props.changeTable} />
      <QueryVariableSelector />
      <QueryFilterSelector />
      <QueryGroupBy />
      <QuerySortLimit />
    </div>
  );
};

export default QueryBuilder;
