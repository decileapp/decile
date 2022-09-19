import { Switch as SwitchComp } from "@headlessui/react";
import { classNames } from "../../utils/classnames";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import InputLabel from "./common/InputLabel";
import InputDescription from "./common/InputDescription";

type Props = {
  title?: string;
  description?: string;
  value?: boolean;
  setSelected: (e: boolean) => void;
};

const Switch: React.FC<Props> = ({ ...props }) => {
  const { value, setSelected, title, description } = props;

  return (
    <div>
      {title && <InputLabel title={title} />}
      {description && <InputDescription description={description} />}
      <SwitchComp
        checked={value || false}
        onChange={() => setSelected(!value)}
        className={
          "outline outline-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-2"
        }
      >
        <span className="sr-only">Use setting</span>

        <span
          className={classNames(
            value
              ? "translate-x-5 bg-slate-900 dark:bg-white"
              : "translate-x-0 border-2 border-slate-900 dark:border-white",
            "pointer-events-none relative inline-block h-5 w-5 rounded-full shadow transform ring-0 transition ease-in-out duration-200 "
          )}
        >
          <span
            className={classNames(
              value
                ? "opacity-0 ease-out duration-100"
                : "opacity-100 ease-in duration-200",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity "
            )}
            aria-hidden="true"
          ></span>
        </span>
      </SwitchComp>
    </div>
  );
};

export default Switch;
