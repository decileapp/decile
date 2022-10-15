import _ from "lodash";
import QueryFilterSelector from "./QueryFilterSelector";
import QueryTableSelector from "../common/TableSelector";
import QueryVariableSelector from "./QueryVariableSelector";
import QuerySortLimit from "./QuerySortLimit";
import QueryGroupBy from "./QueryGroupBy";

const QueryBuilder: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full min-h-0 overflow-scroll space-y-6 p-4 mb-10">
      <div className="flex h-1/10  ">
        <QueryTableSelector queryBuilder={true} />
      </div>
      <div className="flex h-4/10 flex-1 ">
        <QueryVariableSelector />
      </div>
      <div className="flex flex-1 h-2/10  ">
        <QueryFilterSelector />
      </div>
      <div className="flex flex-1 h-2/10 ">
        <QueryGroupBy />
      </div>
      <div className="flex flex-1 h-1/10 ">
        <QuerySortLimit />
      </div>
    </div>
  );
};

export default QueryBuilder;
