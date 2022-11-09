import { useState } from "react";
import TextInput from "../../../components/individual/TextInput";
import { supabase } from "../../../utils/supabaseClient";
import { toast } from "react-toastify";
import MiniLoading from "../../../components/individual/MiniLoading";
import FormLayout from "../../../components/layouts/FormLayout";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import axios from "axios";

interface Props {
  open: boolean;
}

const OrganisationPopup: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [orgName, setOrgName] = useState<string>();
  const user = supabase.auth.user();
  const router = useRouter();

  const updateOrg = async () => {
    try {
      if (!user || !orgName) {
        return;
      }
      setLoading(true);
      const res = await axios.post("/api/org/create", { orgName: orgName });

      if (res.data.success) {
        router.push("/");
      }
      setLoading(false);
      return;
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <FormLayout heading="Set up organisation">
        <TextInput
          name="orgName"
          id="orgName"
          value={orgName || ""}
          handleChange={setOrgName}
          description="What's the name of your company?"
          type="text"
          label="Acme"
        />

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          {loading ? (
            <MiniLoading />
          ) : (
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-primary-500 shadow-sm px-4 py-2 text-primary-600 text-base font-medium  hover:bg-primary-700 hover:text-white sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={() => updateOrg()}
            >
              Save
            </button>
          )}
        </div>
      </FormLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (!user || !token) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  // Admins only
  if (user.user_metadata.role_id) {
    if (user.user_metadata.role_id !== 1) {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    }
  }

  supabase.auth.setAuth(token);

  const { data: role, error } = await supabase
    .from("org_users")
    .select("id")
    .single();

  if (role) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default OrganisationPopup;
