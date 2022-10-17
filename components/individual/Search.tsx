import { useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";
import { Combobox } from "@headlessui/react";
import { classNames } from "../../utils/classnames";

interface Option {
  name: string;
  value: string;
}

interface Props {
  options: Option[];
  title?: string;
  value: string;
  setSelectedValue: (x: string) => void;
}

const Search: React.FC<Props> = (props) => {
  const [query, setQuery] = useState("");
  const { options, title, value, setSelectedValue } = props;

  const filteredPeople =
    query === ""
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={value}
      onChange={setSelectedValue}
      className="w-full"
    >
      {title && (
        <Combobox.Label className="block text-sm font-medium ">
          {title}
        </Combobox.Label>
      )}
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm text-zinc-900"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: Option) => option?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((option, id) => (
              <Combobox.Option
                key={id}
                value={option.value}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-primary-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span
                        className={classNames(
                          selected ? "font-semibold" : "",
                          "truncate"
                        )}
                      >
                        {option.name}
                      </span>
                      <span
                        className={classNames(
                          "ml-2 truncate text-gray-500",
                          active ? "text-primary-200" : "text-gray-500"
                        )}
                      >
                        {option.name}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-primary-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default Search;
