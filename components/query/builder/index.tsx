import _ from "lodash";
import QueryFilterSelector from "./QueryFilterSelector";
import QueryTableSelector from "../common/TableSelector";
import QueryVariableSelector from "./QueryVariableSelector";
import QuerySortLimit from "./QuerySortLimit";
import QueryGroupBy from "./QueryGroupBy";

const QueryBuilder: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full space-y-6 p-4  overflow-auto">
      <QueryTableSelector queryBuilder={true} />
      <QueryVariableSelector />
      <QueryFilterSelector />
      <QueryGroupBy />
      <QuerySortLimit />
    </div>
  );
};

export default QueryBuilder;
