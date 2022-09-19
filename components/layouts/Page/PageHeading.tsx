import React from "react";

type Props = {
  title: string;
};

const PageHeading: React.FC<Props> = ({ ...props }) => {
  return (
    <h1 className="text-xl font-semibold" id="heading">
      {props.title}
    </h1>
  );
};

export default PageHeading;
