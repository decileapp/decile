import { useRouter } from "next/router";
import { join } from "path";
import { classNames } from "../../utils/classnames";

interface Props {
  label: string;
  onClick: () => void;
  type:
    | "primary"
    | "secondary"
    | "outline-primary"
    | "outline-secondary"
    | "text-primary"
    | "text-secondary";
  id?: string;
}

const Button: React.FC<Props> = (props) => {
  const { label, onClick, type, id } = props;
  const router = useRouter();

  const format = () => {
    const common =
      "inline-flex items-center justify-center rounded-md  px-4 py-2 font-medium  shadow-sm   sm:w-auto";
    let result: string;
    switch (type) {
      case "primary":
        result = classNames(
          common,
          "bg-primary-600 hover:bg-primary-700  text-white text-sm "
        );

        break;

      case "secondary":
        result = classNames(
          common,
          "bg-secondary-600 hover:bg-secondary-700  text-white text-sm "
        );
        break;

      case "outline-primary":
        result = classNames(
          common,
          "border border-primary-600 hover:bg-primary-700  text-primary-500 hover:text-white text-sm "
        );
        break;

      case "outline-secondary":
        result = classNames(
          common,
          "border border-secondary-600 hover:bg-secondary-700 text-secondary-500 hover:text-white text-sm "
        );
        break;

      case "text-primary":
        result = classNames(
          common,
          "text-primary-400 hover:bg-primary-700  hover:text-white text-base"
        );
        break;

      case "text-secondary":
        result = classNames(
          common,
          "text-secondary-400 hover:bg-secondary-700  hover:text-white text-base"
        );
        break;

      default:
        result = common;
        break;
    }
    return result;
  };
  return (
    <button
      id={id ? id : label}
      type="button"
      className={format()}
      onClick={() => onClick()}
    >
      {label}
    </button>
  );
};

export default Button;
