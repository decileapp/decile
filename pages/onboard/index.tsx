import { useRouter } from "next/router";
import Page from "../../components/layouts/Page";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const OnboardGuide: React.FC = () => {
  const router = useRouter();
  const [onboardingType, setOnboardingType] = useState<string>();

  return (
    <Page>
      <div className="flex flex-col h-full w-full items-center justify-center">
        <div className="flex flex-col  items-start justify-center space-y-2">
          <p className="font-bold mb-4 text-xl">
            What are you hoping to achieve with Decile?
          </p>

          <a href="/onboard/learn" className="hover:text-primary-500">
            I'm here to learn SQL on a sample database.
          </a>
          <a href="/onboard/analytics" className="hover:text-primary-500">
            I want to use Decile to get the data I need at my job.
          </a>
        </div>
      </div>
    </Page>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

export default OnboardGuide;
