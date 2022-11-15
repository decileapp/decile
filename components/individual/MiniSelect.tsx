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
  title?: string;
  selected?: Option;
  setSelected: (x: Option) => void;
  options: Option[];
  emptyLabel?: string;
}

const MiniSelect: React.FC<VarProps> = (props) => {
  const { options, selected, setSelected, emptyLabel, title } = props;

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => {
        return (
          <>
            <Listbox.Label className="block text-sm font-semibold">
              {title}
            </Listbox.Label>
            <div className="relative">
              <Listbox.Button className="relative  cursor-default rounded-md  dark:bg-zinc-700 py-2 pr-10 text-left  sm:text-sm">
                <span className="block truncate">
                  {selected ? selected.title : "Select"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    className="h-5 w-5 text-primary-500"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white dark:bg-zinc-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.title}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-primary-500" : "",
                          "relative cursor-default select-none py-2 pl-8 pr-4"
                        )
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {option.title}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-primary-600",
                                "absolute inset-y-0 left-0 flex items-center pl-1.5"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
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
