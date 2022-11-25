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
    <div className="flex flex-1 flex-col h-full w-full">
      {title && <InputLabel title={title} />}
      {description && <InputDescription description={description} />}
      <div className="mt-1 flex h-full">
        <textarea
          rows={4}
          name={name}
          id={id}
          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md  text-zinc-800 dark:bg-zinc-700 dark:text-white"
          onChange={(e) => handleChange(e.target.value)}
          placeholder={label}
          value={value}
        />
      </div>
    </div>
  );
};

export default TextArea;
