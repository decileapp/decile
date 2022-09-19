import { WalletNft } from "../../types/Nfts";
import { LinkItem } from "../../types/Links";
import Link from "next/link";
import { Mint } from "../../types/Mint";
import MintNftCard from "../nfts/common/MintNftCard";
import Ethereum from "../../public/ethereum.png";
import Solana from "../../public/solana.png";
import Image from "next/image";

const Multichain: React.FC = () => {
  const multiChainContent = (
    <div className="grid container grid-cols-2 gap-4 ">
      <div className="relative ">
        <Image src={"/ethereum.svg"} height="40" width="40" />
      </div>

      <div>
        <Image src="/solana.svg" height="40" width="40" />
      </div>
    </div>
  );

  const sampleNfts: WalletNft[] = [
    {
      id: "1",
      contractId: "1",
      title: "Noun 218",
      description: "",
      imageUrl:
        "https://openseauserdata.com/files/8b9f68792153903b90738f1342c73e97.svg",
      displayed: false,
      owner: "",
      network: "Ethereum",
    },
    {
      id: "2",
      contractId: "2",
      title: "Primate #3665",
      description: "",
      imageUrl:
        "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https://bafybeiadlposym2tmthqd3rxyfr2fkcjkuwbi7b6mocrfcr2eke4k5idoe.ipfs.dweb.link/3664.png?ext=png",
      displayed: false,
      owner: "",
      network: "Solana",
    },
    {
      id: "3",
      contractId: "3",
      title: "BAYC #2815",
      description: "",
      imageUrl:
        "https://img.seadn.io/files/d67477e51780cdeaf45fd96d97b1dfa9.png?fit=max&auto=format&w=600",
      displayed: false,
      owner: "",
      network: "Ethereum",
    },
    {
      id: "4",
      contractId: "4",
      title: "Solana Monkey Business",
      description: "",
      imageUrl:
        "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://cdn.solanamonkey.business/gen2/2848.png",
      displayed: false,
      owner: "",
      network: "Solana",
    },
  ];

  const nftGrid = (
    <div className="grid container grid-cols-2 gap-4 ">
      {sampleNfts.map((file, x) => {
        return (
          <div key={x} className="col-span1 border border-zinc-100 rounded-lg">
            <div
              className={
                "group block w-full aspect-w-1 aspect-h-1 rounded-t-lg  overflow-hidden drop-shadow-md "
              }
            >
              <img
                src={file.imageUrl}
                alt=""
                className="object-cover pointer-events-none "
              />
            </div>
            <div className="flex flex-row justify-between items-start w-full p-2 mt-1">
              <p className="block text-sm font-medium  pointer-events-none ">
                {file.title}
              </p>
              {file.network === "Ethereum" ? (
                <Image src={"/ethereum.svg"} height={25} width={25} />
              ) : (
                <Image src={"/solana.svg"} height={20} width={20} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <p className="text-4xl font-extrabold mb-4 sm:mb-8 text-center ">
        NFT ready
      </p>
      <div className="col-span-1 flex flex-col justify-start  rounded-lg  p-4 border dark:border-none">
        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          <div className="hidden sm:flex flex-col flex-grow-0 rounded-lg items-center ">
            {nftGrid}
          </div>
          <div className="flex flex-col space-y-2 ">
            <p className="text-lg sm:text-left">Display NFTs in a gallery.</p>
            <p className="text-lg sm:text-left">
              We support Ethereum and Solana.
            </p>
          </div>

          <div className="flex sm:hidden flex-col flex-grow-0 rounded-lg items-center justify-center ">
            {nftGrid}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Multichain;
