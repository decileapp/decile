import { Column } from "../../../types/Column";
import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../../individual/MiniLoading";
import { QueryVar, isNumerical, FilterBy } from "../../../utils/query";
import {
  CheckIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useState, Fragment, useEffect } from "react";
import QueryFunctionSelector from "./QueryFunctionSelector";

interface Props {
  columns?: Column[];
  columnsLoading?: boolean;
  updateParent: (x: QueryVar[]) => void;
}

const VariableSelector: React.FC<Props> = (props) => {
  const { columns, columnsLoading, updateParent } = props;
  const [selectedVars, setSelectedVars] = useState<QueryVar[]>([]);

  // Add a variable
  const addVar = (v: Column) => {
    const addition = { ...v, function: isNumerical(v.type) ? "SUM" : "NONE" };

    if (selectedVars.length > 0) {
      setSelectedVars([...selectedVars, addition]);
      return;
    }
    setSelectedVars([addition]);

    return;
  };

  // Update variable
  const removeVar = (v: Column) => {
    if (selectedVars.length > 0) {
      setSelectedVars((selectedVars) =>
        selectedVars.filter((s) => s.name !== v.name)
      );
    }
    return;
  };

  // Update function
  const updateFunction = (s: QueryVar) => {
    const found = selectedVars.find((f) => s.name === f.name);
    const filtered = selectedVars.filter((f) => s.name !== f.name);
    setSelectedVars((selectedVars) =>
      // Find variable
      [...filtered, s]
    );
  };

  // Sort columns
  const numerical = columns?.filter((c) => isNumerical(c.type));
  const textual = columns?.filter((c) => !isNumerical(c.type));
  let sortedColumns = textual;
  if (numerical) {
    sortedColumns = textual?.concat(numerical);
  }

  useEffect(() => {
    updateParent(selectedVars);
  }, [selectedVars]);

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex flex-col overflow-hidden border-b">
        <InputLabel title="Fields" />

        {columns && columns.length > 0 && (
          <div className="grid grid-cols-1 gap-2  mt-2 h-full overflow-scroll">
            {sortedColumns &&
              sortedColumns.map((c, id) => {
                const excluded =
                  selectedVars.length == 0 ||
                  !selectedVars.find((s) => s.name === c.name);
                return (
                  <div
                    className="grid grid-cols-5 gap-1 rounded-lg  p-2 w-full"
                    key={id}
                  >
                    <div className="col-span-3 flex flex-row justify-start items-center w-full">
                      <p className="text-sm ">{c.name}</p>
                    </div>

                    {/* {!excluded && icons} */}
                    <div className="col-san-2 flex flex-row justify-center items-center w-full">
                      {!excluded && (
                        <QueryFunctionSelector
                          name={c.name}
                          type={c.type}
                          updateFunc={updateFunction}
                        />
                      )}
                    </div>
                    <div className="col-san-1 flex flex-row justify-end items-center w-full">
                      {excluded && (
                        <CheckIcon
                          className="h-4 w-4 text-primary-600"
                          onClick={() => addVar(c)}
                        />
                      )}

                      {!excluded && (
                        <XIcon
                          className="h-4 w-4 text-red-500"
                          onClick={() => removeVar(c)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {columnsLoading && <MiniLoading />}
      </div>
    </div>
  );
};

export default VariableSelector;
