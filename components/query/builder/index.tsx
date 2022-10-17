import _ from "lodash";
import QueryFilterSelector from "./QueryFilterSelector";
import QueryTableSelector from "../common/TableSelector";
import QueryVariableSelector from "./QueryVariableSelector";
import QuerySortLimit from "./QuerySortLimit";
import QueryGroupBy from "./QueryGroupBy";

const QueryBuilder: React.FC = () => {
  return (
    <div className="grid grid-rows-10 w-full space-y-6 p-4 h-full overflow-scroll">
      <div className="row-span-1">
        <QueryTableSelector queryBuilder={true} />
      </div>
      <div className="row-span-2">
        <QueryVariableSelector />
      </div>
      <div className="row-span-3">
        <QueryFilterSelector />
      </div>
      <div className="row-span-2">
        <QueryGroupBy />
      </div>
      <div className="row-span-2">
        <QuerySortLimit />
      </div>
    </div>
  );
};

export default QueryBuilder;
