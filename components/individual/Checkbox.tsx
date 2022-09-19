import React from "react";
import InputLabel from "./common/InputLabel";
import InputDescription from "./common/InputDescription";

type Props = {
  title?: string;
  description?: string;
  id: string;
  name: string;
  value: boolean;
  handleChange: () => void;
};

const Checkbox: React.FC<Props> = ({ ...props }) => {
  const { id, name, handleChange, value } = props;
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          aria-describedby="comments-description"
          name={name}
          type="checkbox"
          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
          onClick={() => handleChange()}
        />
      </div>
      <div className="ml-3 text-sm">
        {props.title && <InputLabel title={props.title} />}
        {props.description && (
          <InputDescription description={props.description} />
        )}
      </div>
    </div>
  );
};

export default Checkbox;
