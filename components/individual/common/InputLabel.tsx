import React from "react";

type Props = {
  title?: string;
  classes?: string;
};

const InputLabel: React.FC<Props> = ({ ...props }) => {
  return (
    <label htmlFor="email" className="block text-md font-bold mb-1">
      {props.title}
    </label>
  );
};

export default InputLabel;
