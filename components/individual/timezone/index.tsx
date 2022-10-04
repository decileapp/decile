import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/outline";
import { classNames } from "../../../utils/classnames";
import moment from "moment-timezone";
import { Combobox } from "@headlessui/react";
import { useState } from "react";

interface Timezone {
  id: number;
  name: string;
}

interface Props {
  updateZone: (x: string) => void;
}

const Timezone: React.FC<Props> = (props) => {
  const { updateZone } = props;
  const timezones = moment.tz.names().map((t, id) => {
    return {
      id: id,
      name: t,
    };
  });
  const [query, setQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState(
    timezones.find((t) => t.name === moment.tz.guess())
  );

  const filteredPeople =
    query === ""
      ? timezones
      : timezones.filter((timezone) => {
          return timezone.name.toLowerCase().includes(query.toLowerCase());
        });

  // On change
  const onChange = (x: Timezone) => {
    setSelectedZone(x);
    updateZone(x.name);
    return;
  };

  return (
    <Combobox as="div" value={selectedZone} onChange={onChange}>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person: Timezone) => person.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDownIcon
            className="h-3 w-3 text-zinc-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((person) => (
              <Combobox.Option
                key={person.id}
                value={person}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-primary-600 text-white" : "text-zinc-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        selected ? "font-semibold" : "",
                        "block truncate"
                      )}
                    >
                      {person.name}
                    </span>

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

export default Timezone;
