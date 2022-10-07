import { Column } from "../../types/Column";
import InputLabel from "../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../individual/MiniLoading";
import queryBuilder, {
  FilterBy,
  FilterOperator,
  SortBy,
  Table,
  Var,
} from "../../utils/query";
import {
  FilterIcon,
  MinusIcon,
  PlusIcon,
  SortAscendingIcon,
  TableIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import { FaEquals } from "react-icons/fa";

interface Props {
  columns?: Column[];
  columnsLoading?: boolean;
}

const Filter: React.FC<Props> = (props) => {
  const { columns, columnsLoading } = props;
  const [filters, setFilters] = useState<FilterBy[]>([]);

  const addVar = (v: string) => {
    setSelectedVars(selectedVars ? selectedVars.concat([v]) : [v]);
    return;
  };

  const removeVar = (v: string) => {
    if (selectedVars) {
      setSelectedVars(selectedVars.filter((s) => s !== v));
    }

    return;
  };

  const icons = (
    <div className="flex flex-row justify-evenly items-center space-x-4">
      <TableIcon className="h-4 w-4 " />
      <FilterIcon className="h-4 w-4 " />
      <SortAscendingIcon className="h-4 w-4 " />
    </div>
  );

  return (
    <>
      <InputLabel title="Filter" />
      <div className="mt-2">
        {columns && columns.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {columns.map((c, id) => {
              return (
                <>
                  <p className=" text-sm truncate">{c.name}</p>
                  <FaEquals className="h-4 w-4 " />
                  <input className="text-sm" />
                </>
              );
            })}
          </div>
        )}
        {columnsLoading && <MiniLoading />}
      </div>
    </>
  );
};

export default Filter;
