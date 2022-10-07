import { Column } from "../../../types/Column";
import InputLabel from "../../individual/common/InputLabel";
import _ from "lodash";
import MiniLoading from "../../individual/MiniLoading";
import queryBuilder, {
  FilterBy,
  FilterOperator,
  SortBy,
  Table,
  QueryVar,
  isNumerical,
} from "../../../utils/query";
import {
  FilterIcon,
  MinusIcon,
  PlusIcon,
  SortAscendingIcon,
  TableIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";
import { useState, Fragment, useEffect } from "react";
import Select from "../../individual/Select";

import { Listbox, Transition } from "@headlessui/react";
import { classNames } from "../../../utils/classnames";

interface VarProps {
  name: string;
  type: string;
  function?: string;
  updateFunc: (x: QueryVar) => void;
}

const QueryFunctionSelector: React.FC<VarProps> = (props) => {
  const { name, type, updateFunc } = props;
  let publishingOptions = [
    {
      title: "None",
      description: "Do not collapse this variable.",
      value: "NONE",
      current: false,
    },
    {
      title: "Group",
      description: "Aggregate numberical values by collapsing this variable.",
      value: "GROUP",
      current: true,
    },
  ];
  if (isNumerical(type)) {
    publishingOptions = publishingOptions.concat([
      {
        title: "Sum",
        description: "Aggregate this variable by summing its values.",
        value: "SUM",
        current: true,
      },
      {
        title: "Average",
        description: "Calculate a simple average of this value.",
        value: "AVG",
        current: false,
      },
      {
        title: "Min",
        description: "Calculate a simple average of this value.",
        value: "MIN",
        current: false,
      },
      {
        title: "Max",
        description: "Calculate a simple average of this value.",
        value: "MAX",
        current: false,
      },
    ]);
  }

  const [selected, setSelected] = useState(publishingOptions[0]);

  // On select
  const onSelect = (x: typeof selected) => {
    setSelected(x);
    updateFunc({ name: name, type: type, function: x.value });
    return;
  };

  return (
    <Listbox value={selected} onChange={onSelect}>
      {({ open }) => {
        return (
          <>
            <Listbox.Label className="sr-only"></Listbox.Label>
            <div className="relative ">
              <div className=" inline-flex justify-center align-center rounded-md ">
                <div className="inline-flex  rounded-md">
                  <div className="inline-flex items-center rounded-l-md  pl-3 pr-1 ">
                    <p className="ml-2.5 text-xs font-medium">
                      {selected.title}
                    </p>
                  </div>
                  <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md   text-sm font-medium  ">
                    <span className="sr-only">Change published status</span>
                    <ChevronDownIcon className="h-3 w-3" aria-hidden="true" />
                  </Listbox.Button>
                </div>
              </div>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-6 w-72 origin-bottom-left divide-y divide-gray-200  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {publishingOptions.map((option) => (
                    <Listbox.Option
                      key={option.title}
                      className={({ active }) =>
                        classNames(
                          active
                            ? "text-white bg-primary-500"
                            : "text-gray-900",
                          "cursor-default select-none p-4 text-xs"
                        )
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p
                              className={
                                selected ? "font-semibold" : "font-normal"
                              }
                            >
                              {option.title}
                            </p>
                            {selected ? (
                              <span
                                className={
                                  active ? "text-white" : "text-primary-500"
                                }
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </div>
                          <p
                            className={classNames(
                              active ? "text-primary-200" : "text-gray-500",
                              "mt-2"
                            )}
                          >
                            {option.description}
                          </p>
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        );
      }}
    </Listbox>
  );
};

export default QueryFunctionSelector;
