// Modules
import React from "react";

const MiniLoading: React.FC = () => {
  return (
    <div>
      <div
        className="        object-center
      animate-spin
      rounded-full
      h-8
      w-8
      border-t-2 border-b-2 border-primary-500
      grow"
        role="status"
      />
    </div>
  );
};

export default MiniLoading;
