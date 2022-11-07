import React from "react";

const TooltipContainer: React.FC = (props) => {
  return <div className="py-1 px-2 border">{props.children}</div>;
};

export default TooltipContainer;
