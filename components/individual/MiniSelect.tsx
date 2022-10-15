import _ from "lodash";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { classNames } from "../../utils/classnames";

interface Option {
  title: string;
  description: string;
  value: string;
  current: boolean;
}

interface VarProps {
  selected?: Option;
  setSelected: (x: Option) => void;
  options: Option[];
  emptyLabel?: string;
}

const MiniSelect: React.FC<VarProps> = (props) => {
  const { options, selected, setSelected, emptyLabel } = props;

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => {
        return (
          <>
            <Listbox.Label className="sr-only"></Listbox.Label>
            <div>
              <div className=" inline-flex justify-center align-center rounded-md ">
                <div className="inline-flex  rounded-md">
                  <div className="inline-flex items-start rounded-l-md pr-1 ">
                    <p className="text-sm">
                      {selected ? selected.title : emptyLabel || "Select"}
                    </p>
                  </div>
                  <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md  text-sm font-medium  ">
                    <ChevronDownIcon
                      className="h-4 w-4 text-primary-500"
                      aria-hidden="true"
                    />
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
                <Listbox.Options className="absolute z-10 mt-6 origin-bottom-left divide-y divide-zinc-200 rounded-lg  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.title}
                      className={({ active }) =>
                        classNames(
                          active
                            ? "text-white bg-primary-500"
                            : "text-zinc-900",
                          "cursor-default select-none px-1 py-2 text-sm rounded-lg"
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
                                active ? "text-primary-200" : "text-zinc-500",
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
