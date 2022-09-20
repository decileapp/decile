import React from "react";
import Image from "next/image";
import IconImage from "../../public/logo.svg";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();
  return (
    <div
      className="flex flex-row items-center cursor-pointer"
      onClick={() => router.push("/")}
    >
      <Image
        alt="Mountains"
        src={IconImage}
        layout="intrinsic"
        quality={100}
        height="24"
        width="24"
      />
      <h1 className="tracking-tight font-extrabold text-2xl ml-2">Subtable</h1>
    </div>
  );
};

export default Header;
