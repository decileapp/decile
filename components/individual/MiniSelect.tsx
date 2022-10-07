import _ from "lodash";

import { QueryVar, isNumerical } from "../../utils/query";
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
import Select from "../individual/Select";

import { Listbox, Transition } from "@headlessui/react";
import { classNames } from "../../utils/classnames";

interface Option {
  title: string;
  description: string;
  value: string;
  current: boolean;
}

interface VarProps {
  updateFunc: (x: string) => void;
  options: Option[];
}

const MiniSelect: React.FC<VarProps> = (props) => {
  const { options, updateFunc } = props;
  const [selected, setSelected] = useState(options[0]);

  // On select
  const onSelect = (x: typeof selected) => {
    setSelected(x);
    updateFunc(x.value);
    return;
  };

  return (
    <Listbox value={selected} onChange={onSelect}>
      {({ open }) => {
        return (
          <>
            <Listbox.Label className="sr-only"></Listbox.Label>
            <div>
              <div className=" inline-flex justify-center align-center rounded-md ">
                <div className="inline-flex  rounded-md">
                  <div className="inline-flex items-start rounded-l-md  pl-3 pr-1 ">
                    <p className="text-sm">{selected.title}</p>
                  </div>
                  <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md   text-sm font-medium  ">
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
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
                <Listbox.Options className="absolute z-10 mt-6 origin-bottom-left divide-y divide-gray-200  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.title}
                      className={({ active }) =>
                        classNames(
                          active
                            ? "text-white bg-primary-500"
                            : "text-gray-900",
                          "cursor-default select-none p-4 text-sm"
                        )
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex flex-row justify-between space-x-2">
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
                          {option.description && (
                            <p
                              className={classNames(
                                active ? "text-primary-200" : "text-gray-500",
                                "mt-2"
                              )}
                            >
                              {option.description}
                            </p>
                          )}
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

export default MiniSelect;
