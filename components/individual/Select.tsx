import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { classNames } from "../../utils/classnames";
import InputLabel from "./common/InputLabel";
import InputDescription from "./common/InputDescription";

type Option = {
  name: string;
  value: string;
};

type Props = {
  title?: string;
  description?: string;
  id: string;
  name: string;
  value: string;
  options: Option[];
  setSelected: (e: string) => void;
};

const Select: React.FC<Props> = ({ ...props }) => {
  const { value, setSelected, id, name, title, options, description } = props;
  return (
    <div>
      {title && <InputLabel title={props.title} />}
      {description && <InputDescription description={props.description} />}
      <div className="mt-2">
        <Listbox value={value} onChange={(e) => setSelected(e)}>
          {({ open }) => (
            <>
              <div className="relative">
                <Listbox.Button className=" relative w-full border border-zinc-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                  <span className="block truncate">
                    {value
                      ? options.find((o) => o.value === value)?.name
                      : "Select"}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
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
                  <Listbox.Options className="absolute z-10 mt-1 w-full shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm bg-white dark:bg-zinc-800">
                    {options.map((option, id) => (
                      <Listbox.Option
                        key={id}
                        className={({ active }) =>
                          classNames(
                            active ? "bg-primary-600" : "",
                            "cursor-default select-none relative py-2 pl-3 pr-9"
                          )
                        }
                        value={option.value}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected && active
                                  ? "font-semibold text-white"
                                  : selected
                                  ? "font-semibold text-primary-600 "
                                  : active
                                  ? "font-normal text-white "
                                  : "font-normal",
                                "block truncate "
                              )}
                            >
                              {option.name}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-primary-600",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
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
          )}
        </Listbox>
      </div>
    </div>
  );
};

export default Select;
