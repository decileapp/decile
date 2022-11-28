import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { useRecoilState } from "recoil";
import { queryTypeState } from "../../../utils/contexts/query/state";
import { classNames } from "../../../utils/classnames";

const editorOptions = [
  {
    title: "Query with text (Beta)",
    description: "Get the data you need using AI and natural language.",
    current: false,
    value: "ai",
  },
  {
    title: "Query builder",
    description: "Use our query builder.",
    current: false,
    value: "query_builder",
  },
  {
    title: "SQL Editor",
    description: "Write SQL",
    current: false,
    value: "sql",
  },
];

const QueryTypeSelector = () => {
  const [queryType, setQueryType] = useRecoilState(queryTypeState);

  return (
    <Listbox value={queryType} onChange={setQueryType}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Query type</Listbox.Label>
          <div className="relative">
            <div className="inline-flex rounded-md ">
              <div className="inline-flex  rounded-md hover:bg-primary-500 hover:text-white">
                <div className="inline-flex items-center rounded-l-md border border-transparent py-2 pl-3 pr-4 ">
                  <p className="ml-2.5 text-sm font-semibold">
                    {editorOptions.find((e) => e.value === queryType)?.title}
                  </p>
                </div>
                <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md  p-2 text-sm font-medium ">
                  <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
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
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-zinc-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {editorOptions.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-primary-500" : "text-zinc-900",
                        "cursor-default select-none p-4 text-sm"
                      )
                    }
                    value={option.value}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between text-sm">
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
                            active ? "text-primary-200" : "text-zinc-500",
                            "mt-2 text-xs"
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
      )}
    </Listbox>
  );
};

export default QueryTypeSelector;
