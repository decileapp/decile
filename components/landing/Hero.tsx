import { useRouter } from "next/router";
import Button from "../individual/Button";

interface Props {
  handleText?: string;
}

const Hero: React.FC<Props> = (props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center space-y-24">
      <div className="mb-12" />
      <div className="flex flex-col items-center justify-center space-y-8 w-full">
        <p className=" font-extrabold  text-4xl sm:text-4xl text-center">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500  text-transparent bg-clip-text ">
            Subtable
          </span>
        </p>
        <p className="text-center text-xl">
          Helping you make data-led decisions
        </p>
        <div className="flex flex-row justify-center space-x-8 w-full">
          <Button
            label="Sign up"
            onClick={() => router.push("/auth/signup")}
            type="primary"
          />
          <Button
            label="Sign in"
            onClick={() => router.push("/auth/signin")}
            type="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
