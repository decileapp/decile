import React from "react";

type Props = {
  description: string;
};

const PageDescription: React.FC<Props> = ({ ...props }) => {
  return (
    <p className="mt-2 text-base  dark:" id="descripton">
      {props.description}
    </p>
  );
};

export default PageDescription;
