import React from "react";

type Props = {
  description?: string;
  classes?: string;
};

const InputDescription: React.FC<Props> = ({ ...props }) => {
  return (
    <p className="text-sm leading-5 dark:text-gray-400 ">{props.description}</p>
  );
};

export default InputDescription;
