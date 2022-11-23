import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import FormLayout from "../../components/layouts/FormLayout";
import TextInput from "../../components/individual/TextInput";
import PageHeading from "../../components/layouts/Page/PageHeading";
import Button from "../../components/individual/Button";
import validator from "validator";

const Reset: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>();
  const [password2, setPassword2] = useState<string>();
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const user = supabase.auth.user();
  const { access_token } = router.query;

  const validateSignup = () => {
    // Validation

    if (password !== password2) {
      setError("Passwords do not match.");
      return false;
    }

    if (password) {
      if (!validator.isStrongPassword(password)) {
        setError(
          "Password must be atleast 8 characters and include: lower case, upper case, number and symbol."
        );
        return false;
      }
    }

    return true;
  };

  const signUp = async () => {
    setError("");
    setLoading(true);
    const validate = validateSignup();
    if (!validate) {
      setLoading(false);
      return;
    }

    const { error, data } = await supabase.auth.api.updateUser(
      access_token as string,
      {
        password: password,
      }
    );

    if (error) {
      setError("Something went wrong.");
      setLoading(false);
      return;
    }
    if (data) {
      setMessage("We've reset your password.");
    }
    setLoading(false);
    return;
  };

  useEffect(() => {
    if (user) {
      router.push("/");
      return;
    }
  }, [user]);

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <FormLayout pageLoading={loading}>
        <PageHeading title="Reset password" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && (
          <p className="text-sm ">
            {`${message} Please log in`}{" "}
            <a className="text-secondary-500" href="/auth/signin">
              here.
            </a>
          </p>
        )}
        <TextInput
          name="password"
          id="password"
          value={password || ""}
          handleChange={setPassword}
          type="password"
          label="Password"
        />
        <TextInput
          name="password2"
          id="password2"
          value={password2 || ""}
          handleChange={setPassword2}
          type="password"
          label="Confirm password"
        />
        <div className="flex flex-row justify-end">
          <Button label="Submit" onClick={() => signUp()} type="primary" />
        </div>
      </FormLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (user) {
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

export default Reset;
