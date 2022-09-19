import { InboxIcon, LinkIcon, PhotographIcon } from "@heroicons/react/outline";
import { WalletNft } from "../../types/Nfts";

import Image from "next/image";
import {
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { SiSubstack } from "react-icons/si";
import { ReactNode } from "react";

const Features: React.FC = () => {
  const socialLinks = [
    <FaLinkedin className="h-12 w-12" />,
    <FaTiktok className="h-12 w-12" />,
    <FaInstagram className="h-12 w-12" />,
    <FaYoutube className="h-12 w-12" />,
    <FaTwitter className="h-12 w-12" />,
    <SiSubstack className="h-12 w-12" />,
  ];

  const linkComponent = (
    <div className="grid container grid-cols-2 gap-4 h-full">
      {socialLinks.map((file, x) => {
        return (
          <div key={x} className="flex items-center justify-center w-full">
            {file}
          </div>
        );
      })}
    </div>
  );

  const audienceComp = (
    <div className="h-full w-full ">
      <Image
        src={`/audience.svg`}
        height={`${(100 * 480) / 640}`}
        width="100"
        layout="responsive"
        className="rounded-lg "
      />
    </div>
  );

  const sampleNft: WalletNft = {
    id: "1",
    contractId: "1",
    title: "Noun 218",
    description: "",
    imageUrl:
      "https://openseauserdata.com/files/8b9f68792153903b90738f1342c73e97.svg",
    displayed: false,
    owner: "",
    network: "Ethereum",
    askPrice: "22",
  };
  const nftGrid = (
    <div className="w-full h-full border border-zinc-600 rounded-lg overflow-auto">
      <div className="">
        <img src={sampleNft.imageUrl} alt="" className="w-full self-center" />
      </div>
      <div className="flex flex-col space-y-4 justify-between items-start w-full p-2 mt-1">
        <div className="flex flex-row justify-between items-start w-full ">
          <p className="block text-sm font-medium  pointer-events-none ">
            {sampleNft.title}
          </p>
          {sampleNft.network === "Ethereum" ? (
            <Image src={"/ethereum.svg"} height={25} width={25} />
          ) : (
            <Image src={"/solana.svg"} height={20} width={20} />
          )}
        </div>

        <p className=" text-sm ">{`Price: ${sampleNft.askPrice} ETH`}</p>
      </div>
    </div>
  );

  const featureComp = ({
    heading,
    comp,
    text,
  }: {
    heading: string;
    comp: ReactNode;
    text: string[];
  }) => {
    return (
      <div className="col-span-1 flex flex-col">
        <div className="grid grid-cols-1 grid-rows-9  gap-4  border-2 border-zinc-400 p-4 rounded-xl h-full">
          <div className="row-start-1 row-span-1 ">
            <p className="text-2xl font-extrabold text-center text-primary-400">
              {heading}
            </p>
          </div>

          <div className="row-start-2 row-span-4 ">{comp}</div>
          <div className="row-start-6 row-span-3 flex flex-col justify-start h-full">
            {text.map((item, id) => {
              return (
                <p className="text-center  text-md" key={id}>
                  {item}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const featureList = [
    {
      heading: "Drive traffic",
      comp: linkComponent,
      text: ["One link for all your links."],
    },
    {
      heading: "Display and sell NFTs",
      comp: nftGrid,
      text: [
        "Display and sell NFTs.",
        "Our trading fees are 1%.",
        "Royalties are always paid.",
      ],
    },
    {
      heading: "Own your audience",
      comp: audienceComp,
      text: ["Algorithms can change.", "Collect emails and export anytime."],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full lg:w-2/3 2xl:w-1/2 place-self-center gap-4">
      {featureList.map((f, id) => {
        return featureComp({ heading: f.heading, comp: f.comp, text: f.text });
      })}
    </div>
  );
};

export default Features;
