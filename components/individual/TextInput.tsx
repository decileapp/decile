import React from "react";
import InputLabel from "./common/InputLabel";
import InputDescription from "./common/InputDescription";

type Props = {
  title?: string;
  description?: string;
  type: string;
  id: string;
  name: string;
  label: string;
  value: string | number;
  handleChange: (e: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
};

const TextInput: React.FC<Props> = ({ ...props }) => {
  return (
    <div className="space-y-2">
      {props.title && <InputLabel title={props.title} />}
      {props.description && (
        <InputDescription description={props.description} />
      )}

      <input
        type={props.type}
        name={props.name}
        id={props.id}
        value={props.value}
        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md -700 text-zinc-800"
        placeholder={props.label}
        onChange={(e) => props.handleChange(e.target.value)}
        disabled={props.disabled}
        required={props.required}
      />

      {props.error && (
        <p className="text-sm text-red-500 mt-1">{props.error}</p>
      )}
    </div>
  );
};

export default TextInput;
