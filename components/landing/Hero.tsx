import { useRouter } from "next/router";
import Button from "../individual/Button";

interface Props {
  handleText?: string;
}

const Hero: React.FC<Props> = (props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center space-y-24">
      <div className="mb-12" />
      <div className="space-y-8">
        <p className=" font-extrabold  text-4xl sm:text-4xl text-center">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500  text-transparent bg-clip-text ">
            Dataverse
          </span>
        </p>
        <p className="text-center text-xl">
          Helping you make data-led decisions
        </p>
        <div className="flex flex-col items-center w-full">
          <Button
            label="Sign up"
            onClick={() => router.push("/api/auth/login")}
            type="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
