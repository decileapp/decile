import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import FormLayout from "../../components/layouts/FormLayout";
import TextInput from "../../components/individual/TextInput";
import PageHeading from "../../components/layouts/Page/PageHeading";
import Button from "../../components/individual/Button";

const Signin: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [forgot, setForgot] = useState(false);
  const user = supabase.auth.user();

  const signIn = async () => {
    setLoading(true);

    if (!password) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    const { user, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });

    if (error) {
      setError("Incorrect login details.");
      setLoading(false);
      return;
    }

    if (user) {
      router.push("/queries");
    } else {
      console.log(error);
    }
    return;
  };

  const resetPassword = async () => {
    setLoading(true);
    setError("");
    if (!email) {
      setError("Please enter an email address.");
      return;
    }
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(
      email
    );

    if (error) {
      setError("Something went wrong.");
      setLoading(false);
      return;
    }

    if (data) {
      setMessage("We've emailed you a link to reset your password.");
    }
    setLoading(false);
    return;
  };

  useEffect(() => {
    if (user) {
      router.push("/queries");
      return;
    }
  }, [user]);

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <FormLayout pageLoading={loading}>
        <div>
          <PageHeading title="Sign in" />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          {message && (
            <p className="text-sm text-secondary-500 mt-1">{message}</p>
          )}
          {forgot && !message && (
            <p className="text-sm mt-1">
              Please enter your email to reset your password.
            </p>
          )}
        </div>
        <TextInput
          name="email"
          id="email"
          value={email || ""}
          handleChange={setEmail}
          type="email"
          label="Email"
        />
        {!forgot && (
          <TextInput
            name="password"
            id="password"
            value={password || ""}
            handleChange={setPassword}
            type="password"
            label="Password"
          />
        )}
        {!forgot && (
          <div>
            <p className="text-sm">
              If you've forgotten your password, create a new password{" "}
              <a
                href="#"
                onClick={() => setForgot(true)}
                className="text-primary-500"
              >
                here.
              </a>
            </p>
          </div>
        )}
        <div className="flex flex-row justify-end items-center">
          <Button
            label="Submit"
            onClick={() => (forgot ? resetPassword() : signIn())}
            type="primary"
          />
        </div>
      </FormLayout>
    </div>
  );
};

export default Signin;
