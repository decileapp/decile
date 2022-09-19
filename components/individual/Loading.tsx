// Modules
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col m-auto">
      <div
        className="
        object-center
        animate-spin
        rounded-full
        h-32
        w-32
        border-t-2 border-b-2 border-primary-500
        grow
        "
      />
    </div>
  );
};

export default Loading;
