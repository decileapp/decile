import {
  isNumerical,
  numericalSummarise,
  textSummarise,
} from "../../../utils/query";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import MiniSelect from "../../individual/MiniSelect";
import { classNames } from "../../../utils/classnames";
import { useRecoilState } from "recoil";
import {
  queryGroupByState,
  queryVarsState,
} from "../../../utils/contexts/query/state";
import InputLabel from "../../individual/common/InputLabel";

const QueryGroupBy = () => {
  const [queryVars, setQueryVars] = useRecoilState(queryVarsState);
  const [queryGroupBy, setQueryGroupBy] = useRecoilState(queryGroupByState);

  // Filters
  const addGroupBy = () => {
    if (queryGroupBy) {
      setQueryGroupBy([
        ...queryGroupBy,
        {
          name: "",
          type: "",
          function: "",
        },
      ]);
      return;
    } else {
      setQueryGroupBy([
        {
          name: "",
          type: "",
          function: "",
        },
      ]);
    }
  };

  const removeGroupby = (v: number) => {
    if (queryGroupBy && queryGroupBy.length > 0) {
      setQueryGroupBy(queryGroupBy.filter((s, id) => id !== v));
    }
    return;
  };

  const updateFunction = (v: string, index: number) => {
    if (!queryGroupBy || queryGroupBy.length === 0) return;
    setQueryGroupBy(
      queryGroupBy.map((q, id) => {
        if (id === index) {
          return { name: q.name, type: q.type, function: v };
        } else {
          return q;
        }
      })
    );
    return;
  };

  const updateVar = (v: string, index: number) => {
    if (!queryGroupBy || queryGroupBy.length === 0) return;

    // get type
    let type = "";
    if (queryVars && queryVars.length > 0) {
      const found = queryVars.find((q) => q.name === v);
      if (found) {
        type = found.type;
      }
    }

    setQueryGroupBy(
      queryGroupBy.map((q, id) => {
        if (id === index) {
          return { name: v, type: type, function: q.function };
        } else {
          return q;
        }
      })
    );
    return;
  };

  const filterVarOptions = queryVars
    ? queryVars.map((q) => {
        return {
          title: q.name,
          description: "",
          current: false,
          value: q.name,
        };
      })
    : [];

  // Select all none
  const atleastOne = queryGroupBy.length > 0;
  const selectAllNone = async () => {
    if (!queryVars) return;
    if (atleastOne) {
      setQueryGroupBy([]);
    }
    return;
  };

  return (
    <div className="flex flex-col h-full w-full space-y-2">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start items-center space-x-2">
          <InputLabel title="Summarise" />
          <PlusIcon
            className={classNames(
              !queryVars || queryVars.length === 0 ? "opacity-30" : "",
              "h-5 w-5 ml-4 text-primary-500"
            )}
            onClick={() => addGroupBy()}
          />
        </div>
        {atleastOne && (
          <a className="text-sm" href="#" onClick={() => selectAllNone()}>
            Clear all
          </a>
        )}
      </div>
      {queryGroupBy && queryGroupBy.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          {queryGroupBy?.map((q, id) => {
            const summarise = isNumerical(q.type)
              ? numericalSummarise
              : textSummarise;

            return (
              <div className="grid grid-cols-12 gap-2 justify-start" key={id}>
                <div className="col-span-4 flex flex-row justify-start items-center w-full">
                  <MiniSelect
                    options={filterVarOptions}
                    selected={filterVarOptions.find((f) => f.value === q.name)}
                    setSelected={(e) => updateVar(e.value, id)}
                  />
                </div>

                <div className="col-span-4 flex flex-row justify-start items-center w-full">
                  <MiniSelect
                    options={summarise}
                    selected={summarise.find((f) => f.value === q.function)}
                    setSelected={(e) => updateFunction(e.value, id)}
                  />
                </div>
                <div className="col-span-3" />
                <div className="col-span-1 flex flex-row justify-end items-center w-full">
                  <TrashIcon
                    className="h-4 w-4 text-red-500"
                    onClick={() => removeGroupby(id)}
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

export default QueryGroupBy;
