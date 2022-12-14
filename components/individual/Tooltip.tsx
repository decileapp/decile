import React from "react";

type Props = {
  helperText: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

const Tooltip: React.FC<Props> = ({ ...props }) => {
  const { children, helperText, position } = props;
  let positionString = "-top-8";
  switch (position) {
    case "top":
      positionString = "-top-8";
      break;

    case "bottom":
      positionString = "-bottom-8";
      break;

    case "left":
      positionString = "right-8 top-0";
      break;

    case "right":
      positionString = "left-8 top-0";
      break;

    default:
      break;
  }

  return (
    <div className="group relative ">
      {children}
      <span
        className={`pointer-events-none absolute ${positionString} w-max opacity-0 transition-opacity group-hover:opacity-100 text-xs bg-white p-2 rounded-md border border-zinc-200`}
      >
        {helperText}
      </span>
    </div>
  );
};

export default Tooltip;
