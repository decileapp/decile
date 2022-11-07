import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/outline";
import { ReactElement, SVGProps } from "react";
import { classNames } from "../../utils/classnames";

interface Props {
  name: string;
  stat: string;
  change: string;
  icon: typeof ArrowDownIcon;
  changeType: string;
}

const Tile: React.FC<Props> = (props) => {
  const { name, stat, change, changeType } = props;
  return (
    <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
      <dt>
        <div className="absolute rounded-md bg-indigo-500 p-3">
          <props.icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500">
          {name}
        </p>
      </dt>

      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900">{stat}</p>
        <p
          className={classNames(
            changeType === "increase" ? "text-green-600" : "text-red-600",
            "ml-2 flex items-baseline text-sm font-semibold"
          )}
        >
          {changeType === "increase" ? (
            <ArrowUpIcon
              className="h-5 w-5 flex-shrink-0 self-center text-green-500"
              aria-hidden="true"
            />
          ) : (
            <ArrowDownIcon
              className="h-5 w-5 flex-shrink-0 self-center text-red-500"
              aria-hidden="true"
            />
          )}

          <span className="sr-only">
            {" "}
            {changeType === "increase" ? "Increased" : "Decreased"} by{" "}
          </span>
          {change}
        </p>
      </dd>
    </div>
  );
};

export default Tile;
