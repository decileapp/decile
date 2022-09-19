import React from "react";
import Image from "next/image";
import TwitterImage from "../../public/twitter.svg";

const LandingFooter: React.FC = () => {
  return (
    <div className="flex flex-row w-full justify-center">
      <p className="text-sm text-center mr-2">© Dataverse</p>
      <a href="https://twitter.com/bonzi_app" target="_blank">
        <Image
          alt="Mountains"
          src={TwitterImage}
          layout="intrinsic"
          quality={100}
          height={16}
          width={16}
        />
      </a>
    </div>
  );
};

export default LandingFooter;
