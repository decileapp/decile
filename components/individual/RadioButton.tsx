import React from "react";
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
  options: Option[];
  name: string;
  value: string | number;
  setSelected: (e: string) => void;
  error?: string;
  required?: boolean;
};

const RadioButton: React.FC<Props> = ({ ...props }) => {
  return (
    <div>
      {props.title && <InputLabel title={props.title} />}
      {props.description && (
        <InputDescription description={props.description} />
      )}
      <fieldset className="mt-4">
        <div className="space-y-4">
          {props.options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={option.value}
                name="notification-method"
                type="radio"
                defaultChecked={option.value === props.value}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                onChange={() => props.setSelected(option.value)}
              />
              <label
                htmlFor={option.value}
                className="ml-3 block text-sm font-medium "
              >
                {option.name}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      {props.error && (
        <p className="text-sm text-red-500 mt-1">{props.error}</p>
      )}
    </div>
  );
};

export default RadioButton;
