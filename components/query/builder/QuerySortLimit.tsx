import _ from "lodash";
import { SortBy } from "../../../utils/query";
import { classNames } from "../../../utils/classnames";
import MiniSelect from "../../individual/MiniSelect";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import {
  queryLimitState,
  querySortByState,
  queryVarsState,
} from "../../../utils/contexts/query/state";
import InputLabel from "../../individual/common/InputLabel";

const QuerySortLimit: React.FC = () => {
  const [queryVars, setQueryVars] = useRecoilState(queryVarsState);
  const [querySortBy, setQuerySortBy] = useRecoilState(querySortByState);

  // Add a variable
  const addVar = () => {
    const newVar = { name: "", type: "ASC" };

    if (querySortBy && querySortBy.length > 0) {
      setQuerySortBy([...querySortBy, newVar]);
      return;
    }

    setQuerySortBy([newVar]);

    return;
  };

  // Update variable
  const removeVar = async (v: number) => {
    if (querySortBy && querySortBy.length > 0) {
      await setQuerySortBy((querySortBy) =>
        querySortBy.filter((s, id) => id !== v)
      );
    }
    return;
  };

  const updateVar = (v: string, index: number) => {
    if (!querySortBy || querySortBy.length === 0) {
      return;
    }
    setQuerySortBy(
      querySortBy.map((q, id) => {
        if (id === index) {
          return {
            name: v,
            type: q.type,
          };
        } else {
          return q;
        }
      })
    );
    return;
  };

  const updateSort = (v: string, index: number) => {
    if (!querySortBy || querySortBy.length === 0) {
      return;
    }
    setQuerySortBy(
      querySortBy.map((q, id) => {
        if (id === index) {
          return { name: q.name, type: v };
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
  const atleastOne = querySortBy.length > 0;
  const selectAllNone = async () => {
    if (!queryVars) return;
    if (atleastOne) {
      setQuerySortBy([]);
    }
    return;
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start items-center space-x-2">
          <InputLabel title="Sort by" />
          <PlusIcon
            className={classNames(
              !queryVars || queryVars.length === 0 ? "opacity-30" : "",
              "h-5 w-5 ml-4 text-primary-500 "
            )}
            onClick={() => addVar()}
          />
        </div>
        {atleastOne && (
          <a className="text-sm" href="#" onClick={() => selectAllNone()}>
            Clear all
          </a>
        )}
      </div>

      {queryVars &&
        queryVars.length > 0 &&
        querySortBy &&
        querySortBy.length > 0 && (
          <div className="grid grid-cols-1 gap-2 mt-2">
            {" "}
            {querySortBy?.map((q, id) => {
              return (
                <div className="grid grid-cols-12 gap-2 justify-start" key={id}>
                  <div className="col-span-4 flex flex-1 flex-row justify-start items-center w-full">
                    <MiniSelect
                      options={filterVarOptions}
                      selected={filterVarOptions.find(
                        (f) => f.value === q.name
                      )}
                      setSelected={(e) => updateVar(e.value, id)}
                    />
                  </div>

                  <div className="col-span-2 flex flex-row justify-start items-center w-full">
                    {q.type === "ASC" ? (
                      <ArrowUpIcon
                        className="h-4 w-4 "
                        onClick={() => updateSort("DESC", id)}
                      />
                    ) : (
                      <ArrowDownIcon
                        className="h-4 w-4 "
                        onClick={() => updateSort("ASC", id)}
                      />
                    )}
                  </div>
                  <div className="col-span-5" />
                  <div className="col-span-1 flex flex-row justify-end items-center w-full">
                    <TrashIcon
                      className="h-4 w-4 text-red-500"
                      onClick={() => removeVar(id)}
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

export default QuerySortLimit;
