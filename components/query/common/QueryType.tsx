import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { useRecoilState } from "recoil";
import { queryTypeState } from "../../../utils/contexts/query/state";
import { classNames } from "../../../utils/classnames";

const allEditorOptions = [
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

interface Props {
  types?: string[];
}

const QueryTypeSelector: React.FC<Props> = ({
  types = ["ai", "sql", "query_builder"],
}) => {
  const [queryType, setQueryType] = useRecoilState(queryTypeState);
  let editorOptions = allEditorOptions;

  if (types && types.length > 0) {
    editorOptions = allEditorOptions.filter((f) => types.includes(f.value));
  }

  return (
    <Listbox value={queryType} onChange={setQueryType}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Query type</Listbox.Label>
          <div className="relative ">
            <div className="inline-flex rounded-md">
              <div className="inline-flex  rounded-md hover:text-primary-500">
                <div className="inline-flex items-start rounded-l-md py- pl-3 pr-4 ">
                  <p className="ml-2.5 text-sm font-semibold">
                    {editorOptions.find((e) => e.value === queryType)?.title}
                  </p>
                </div>
                <Listbox.Button className="inline-flex items-start rounded-l-none rounded-r-md  px-2 text-sm font-medium ">
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
