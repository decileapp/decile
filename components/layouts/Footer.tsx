import React from "react";

const Footer: React.FC = () => {
  return (
    <p className="text-sm flex text-center">
      Made with
      <a
        href={process.env.NEXT_PUBLIC_ORIGIN}
        className="text-primary-500 ml-1"
      >
        Bonzi
      </a>
    </p>
  );
};

export default Footer;
