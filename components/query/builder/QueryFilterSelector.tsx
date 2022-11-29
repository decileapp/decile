import _ from "lodash";
import {
  filterComboOperators,
  isNumerical,
  numericalFilterOperators,
  textFilterOperators,
} from "../../../utils/query";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import MiniSelect from "../../individual/MiniSelect";
import { classNames } from "../../../utils/classnames";
import { useRecoilState } from "recoil";
import {
  columnsState,
  queryFilterState,
  queryVarsState,
} from "../../../utils/contexts/query/state";
import InputLabel from "../../individual/common/InputLabel";

const QueryFilterSelector: React.FC = () => {
  const [columns, setColumns] = useRecoilState(columnsState);
  const [queryVars, setQueryVars] = useRecoilState(queryVarsState);
  const [queryFilterBy, setQueryFilterBy] = useRecoilState(queryFilterState);

  // Default
  const defaultFilter = {
    var: "",
    operator: "=",
    value: "",
    combo: "AND",
  };

  // Filters
  const addFilter = () => {
    if (queryFilterBy) {
      setQueryFilterBy([...queryFilterBy, defaultFilter]);
      return;
    } else {
      setQueryFilterBy([defaultFilter]);
    }

    return;
  };

  const removeFilter = (v: number) => {
    if (queryFilterBy && queryFilterBy.length > 0) {
      setQueryFilterBy(queryFilterBy.filter((s, id) => id !== v));
    }
    return;
  };

  const updateValue = (v: string, index: number) => {
    setQueryFilterBy(
      queryFilterBy.map((q, id) => {
        if (id === index) {
          return { var: q.var, operator: q.operator, value: v, combo: q.combo };
        } else {
          return q;
        }
      })
    );
  };

  const updateVar = (v: string, index: number) => {
    setQueryFilterBy(
      queryFilterBy.map((q, id) => {
        if (id === index) {
          return {
            var: v,
            operator: q.operator,
            value: q.value,
            combo: q.combo,
          };
        } else {
          return q;
        }
      })
    );
    return;
  };

  const updateOperator = (v: string, index: number) => {
    setQueryFilterBy(
      queryFilterBy.map((q, id) => {
        if (id === index) {
          return { var: q.var, operator: v, value: q.value, combo: q.combo };
        } else {
          return q;
        }
      })
    );
    return;
  };

  const updateComboOption = (v: string, index: number) => {
    setQueryFilterBy(
      queryFilterBy.map((q, id) => {
        if (id === index) {
          return { var: q.var, operator: q.operator, value: q.value, combo: v };
        } else {
          return q;
        }
      })
    );
    return;
  };
  const filterVarOptions =
    columns && columns.length > 0
      ? columns.map((q) => {
          return {
            title: q.name,
            description: "",
            current: false,
            value: q.name,
          };
        })
      : [];

  // Select all none
  const atleastOne = queryFilterBy.length > 0;
  const selectAllNone = async () => {
    if (!queryVars) return;
    if (atleastOne) {
      setQueryFilterBy([]);
    }
    return;
  };

  return (
    <div className="flex flex-col  w-full ">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start items-center space-x-2">
          <InputLabel title="Filters" />
          <PlusIcon
            className={classNames(
              !queryVars || queryVars.length === 0 ? "opacity-30" : "",
              "h-5 w-5 ml-4 text-primary-500"
            )}
            onClick={() => addFilter()}
          />
        </div>
        {atleastOne && (
          <a className="text-sm" href="#" onClick={() => selectAllNone()}>
            Clear all
          </a>
        )}
      </div>

      {queryFilterBy && queryFilterBy && queryFilterBy.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2 relative">
          {queryFilterBy?.map((q, id) => {
            // Find var
            const foundVar = columns?.find((c) => c.name === q.var);
            const operators =
              foundVar && isNumerical(foundVar?.type)
                ? numericalFilterOperators
                : textFilterOperators;

            return (
              <div className="grid grid-cols-12 gap-2 w-full" key={id}>
                <div className="col-span-4 flex flex-row justify-start items-center w-full">
                  <MiniSelect
                    options={filterVarOptions}
                    selected={filterVarOptions.find((f) => f.value === q.var)}
                    setSelected={(e) => updateVar(e.value, id)}
                  />
                </div>

                {/* {!excluded && icons} */}
                <div className="col-span-2 flex flex-row justify-center items-center w-full">
                  <MiniSelect
                    options={operators}
                    selected={operators.find((f) => f.value === q.operator)}
                    setSelected={(e) => updateOperator(e.value, id)}
                  />
                </div>
                <div className="col-span-3 flex flex-row justify-center items-center w-full">
                  <input
                    className="flex p-1 border rounded-md truncate text-sm"
                    value={q.value}
                    onChange={(e) => updateValue(e.target.value, id)}
                  />
                </div>

                <div className="col-span-2 flex flex-row justify-center items-center w-full ">
                  {queryFilterBy.length > id + 1 && (
                    <MiniSelect
                      options={filterComboOperators}
                      selected={filterComboOperators.find(
                        (f) => f.value === q.combo
                      )}
                      setSelected={(e) => updateComboOption(e.value, id)}
                    />
                  )}
                </div>
                <div className="col-span-1 flex flex-row justify-end items-center w-full ">
                  <TrashIcon
                    className="h-4 w-4 text-red-500"
                    onClick={() => removeFilter(id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueryFilterSelector;
