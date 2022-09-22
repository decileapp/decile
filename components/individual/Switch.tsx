import { Switch as SwitchComp } from "@headlessui/react";
import { classNames } from "../../utils/classnames";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import InputLabel from "./common/InputLabel";
import InputDescription from "./common/InputDescription";
import { ReactElement } from "react";

type Props = {
  title?: string;
  description?: string;
  value?: boolean;
  setSelected: (e: boolean) => void;
  trueIcon?: React.ComponentProps<"svg">;
  falseIcon?: React.ComponentProps<"svg">;
};

const Switch: React.FC<Props> = ({ ...props }) => {
  const { value, setSelected, title, description, trueIcon, falseIcon } = props;

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
            value ? "translate-x-5" : "translate-x-0",
            "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        >
          <span
            className={classNames(
              value
                ? "opacity-0 ease-out duration-100"
                : "opacity-100 ease-in duration-200",
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            {falseIcon && (
              <p className="h-3 w-3 text-primary-600">{falseIcon}</p>
            )}
            {!falseIcon && (
              <div className="h-3 w-3  border border-primary-600 rounded-full"></div>
            )}
          </span>
          <span
            className={classNames(
              value
                ? "opacity-100 ease-in duration-200"
                : "opacity-0 ease-out duration-100",
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            {trueIcon && <p className="h-3 w-3 text-primary-600">{trueIcon}</p>}
            {!trueIcon && (
              <div className="h-3 w-3 bg-primary-600 rounded-full"></div>
            )}
          </span>
        </span>
      </SwitchComp>
    </div>
  );
};

export default Switch;
