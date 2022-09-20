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
