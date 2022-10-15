import { Column } from "../../../types/Column";
import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../../individual/MiniLoading";
import { QueryVar, isNumerical } from "../../../utils/query";
import { classNames } from "../../../utils/classnames";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  buildQueryState,
  columnsLoadingState,
  columnsState,
  queryVarsState,
} from "../../../utils/contexts/query/state";

const QueryVariableSelector: React.FC = (props) => {
  const [columns, setColumns] = useRecoilState(columnsState);
  const [columnsLoading, setColumnsLoading] =
    useRecoilState(columnsLoadingState);
  const [queryVars, setQueryVars] = useRecoilState(queryVarsState);

  // Add a variable
  const addVar = async (v: Column) => {
    const newVar = { ...v, function: "NONE" };
    if (queryVars && queryVars.length > 0) {
      await setQueryVars((queryVars) => [...queryVars, newVar]);
      return;
    }
    setQueryVars([newVar]);
    return;
  };

  // Update variable
  const removeVar = (v: Column) => {
    if (queryVars && queryVars.length > 0) {
      setQueryVars((queryVars) => queryVars.filter((s) => s.name !== v.name));
    }
    return;
  };

  // Sort columns
  const numerical = columns?.filter((c) => isNumerical(c.type));
  const textual = columns?.filter((c) => !isNumerical(c.type));
  let sortedColumns = textual;
  if (numerical) {
    sortedColumns = textual?.concat(numerical);
  }

  const atleastOne = queryVars.length > 0;

  // Select all none
  const selectAllNone = async () => {
    if (!columns) return;
    if (atleastOne) {
      setQueryVars([]);
    } else {
      setQueryVars(
        columns?.map((c) => {
          return { name: c.name, type: c.type };
        })
      );
    }
    return;
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-row justify-between items-center">
        <InputLabel title="Choose variables" />
        <a className="text-sm" href="#" onClick={() => selectAllNone()}>
          {atleastOne ? "Clear all" : "Select All"}
        </a>
      </div>
      {columns && columns.length > 0 && (
        <div className="grid grid-cols-6 gap-2  mt-2  overflow-scroll">
          {sortedColumns &&
            sortedColumns.map((c, id) => {
              let excluded = true;
              if (queryVars && queryVars.length > 0) {
                excluded =
                  queryVars.length == 0 ||
                  !queryVars.find((s) => s.name === c.name);
              }

              return (
                <div
                  className="grid grid-cols-1 gap-1 rounded-lg  w-full "
                  key={id}
                >
                  <a
                    className={classNames(
                      excluded
                        ? ""
                        : " border-primary-500 dark:border-primary-300 bg-primary-200  text-zinc-900",
                      " border p-1 rounded-md col-span-3 flex flex-row justify-start items-center w-full"
                    )}
                    onClick={() => (excluded ? addVar(c) : removeVar(c))}
                    href="#"
                  >
                    <p className="text-sm truncate">{c.name}</p>
                  </a>
                </div>
              );
            })}
        </div>
      )}
      {columnsLoading && <MiniLoading />}
    </div>
  );
};

export default QueryVariableSelector;
