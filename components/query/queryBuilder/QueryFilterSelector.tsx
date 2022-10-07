import _ from "lodash";
import { FilterBy, QueryVar } from "../../../utils/query";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import MiniSelect from "../../individual/MiniSelect";

interface Props {
  queryVars: QueryVar[];
  queryFilterBy: FilterBy[];
  setQueryFilterBy: (x: FilterBy[]) => void;
  updateQuery: () => void;
}

const QueryFilterSelector: React.FC<Props> = (props) => {
  const { queryVars, queryFilterBy, setQueryFilterBy, updateQuery } = props;

  // Filters
  const addFilter = () => {
    if (queryFilterBy) {
      setQueryFilterBy([
        ...queryFilterBy,
        {
          var: "",
          operator: "=",
          value: "",
          combo: "AND",
        },
      ]);
      return;
    } else {
      setQueryFilterBy([
        {
          var: "",
          operator: "=",
          value: "",
          combo: "AND",
        },
      ]);
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
    updateQuery();
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
    updateQuery();
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
    updateQuery();
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
    updateQuery();
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

  const filterOperatorOptions = queryVars
    ? ["=", ">", "<", ">=", "<=", "!="].map((q) => {
        return {
          title: q,
          description: "",
          current: false,
          value: q,
        };
      })
    : [];

  const filterComboOptions = queryVars
    ? ["AND", "OR"].map((q) => {
        return {
          title: q,
          description: "",
          current: false,
          value: q,
        };
      })
    : [];

  return (
    <div className="flex flex-col  w-full  p-2 overflow-scroll">
      <div className="flex flex-row justify-start items center">
        <p>Filters</p>
        <PlusIcon className="h-5 w-5 ml-4" onClick={() => addFilter()} />
      </div>
      {queryVars &&
        queryFilterBy &&
        queryFilterBy.length > 0 &&
        queryFilterBy?.map((q, id) => {
          return (
            <div
              className="grid grid-cols-10 gap-1  p-2  justify-start"
              key={id}
            >
              <div className="col-span-3 flex flex-row justify-start items-center w-full">
                <MiniSelect
                  options={filterVarOptions}
                  updateFunc={(e) => updateVar(e, id)}
                />
              </div>

              {/* {!excluded && icons} */}
              <div className="col-san-1 flex flex-row justify-center items-center w-full">
                <MiniSelect
                  options={filterOperatorOptions}
                  updateFunc={(e) => updateOperator(e, id)}
                />
              </div>
              <div className="col-span-3 flex flex-row justify-start items-center w-full">
                <input
                  className="p-1 border rounded-md"
                  value={q.value}
                  onChange={(e) => updateValue(e.target.value, id)}
                />
              </div>
              <div className="col-span-2 flex flex-row justify-start items-center w-full">
                <MiniSelect
                  options={filterComboOptions}
                  updateFunc={(e) => updateComboOption(e, id)}
                />
              </div>
              <div className="col-san-1 flex flex-row justify-end items-center w-full">
                <TrashIcon
                  className="h-4 w-4 text-green-500"
                  onClick={() => removeFilter(id)}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default QueryFilterSelector;
