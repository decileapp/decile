import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { toast } from "react-toastify";
import axios from "axios";
import TextInput from "../../components/individual/TextInput";
import Select from "../../components/individual/Select";
import Button from "../../components/individual/Button";
import FormLayout from "../../components/layouts/FormLayout";
import { Org_User } from "../../types/Organisation";

interface Props {
  people: Org_User[];
}

const InviteOrganisation: React.FC<Props> = (props) => {
  const router = useRouter();
  const user = supabase.auth.user();
  const session = supabase.auth.session();
  const [email, setEmail] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();

  // Invite user
  async function inviteMember() {
    try {
      if (!user) return;
      if (!email) {
        toast.error("Please enter an email address.");
      }
      const res = await axios.post("/api/email", {
        email: email,
        admin: user?.email,
        link: `${process.env.NEXT_PUBLIC_ORIGIN}auth/signup?orgId=${session?.user?.user_metadata.org_id}&roleId=${role}`,
      });

      if (res.data) {
        toast.success("User invited.");
      }

      return;
    } catch (error: any) {
      toast.error("Failed to invite user.");
    }
  }

  // Variable map
  const fields = ["Email", "Role", "", ""];

  return (
    <>
      <FormLayout heading="Invite user">
        <TextInput
          type="text"
          name="email"
          id="email"
          handleChange={setEmail}
          value={email || ""}
          label="joebloggs@email.com"
          title="Email address"
        />
        <Select
          name="role"
          id="role"
          setSelected={setRole}
          value={role || ""}
          options={[
            { name: "Admin", value: "1" },
            { name: "Member", value: "2" },
          ]}
          title="Role"
        />
        <div className="flex flex-row justify-end items-center">
          <Button
            label="Invite"
            onClick={() => inviteMember()}
            type="primary"
          />
        </div>
      </FormLayout>
    </>
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

  return {
    props: {},
  };
};

export default InviteOrganisation;
