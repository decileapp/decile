import React from "react";
import InputLabel from "./common/InputLabel";
import InputDescription from "./common/InputDescription";

type Props = {
  title?: string;
  description?: string;
  id: string;
  name: string;
  label: string;
  value: string | number;
  handleChange: (e: string) => void;
  disabled?: boolean;
};

const TextArea: React.FC<Props> = ({ ...props }) => {
  const { title, description, id, name, label, value, handleChange, disabled } =
    props;
  return (
    <div>
      {title && <InputLabel title={title} />}
      {description && <InputDescription description={description} />}
      <div className="mt-1">
        <textarea
          rows={4}
          name={name}
          id={id}
          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md -700 text-zinc-800"
          onChange={(e) => handleChange(e.target.value)}
          placeholder={label}
          value={value}
        />
      </div>
    </div>
  );
};

export default TextArea;
