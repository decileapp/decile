import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import FormLayout from "../../components/layouts/FormLayout";
import TextInput from "../../components/individual/TextInput";
import PageHeading from "../../components/layouts/Page/PageHeading";
import Button from "../../components/individual/Button";
import updateOrgForSession from "../../utils/organisation/updateOrgForSession";
import Header from "../../components/layouts/Header";

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

    // Add org details
    if (user) {
      const data = await updateOrgForSession(user);
      router.push("/");
    }

    if (error) {
      setError("Incorrect login details.");
      setLoading(false);
      return;
    } else {
      console.log(error);
    }
    return;
  };

  const googleSignIn = async () => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: "google",
    });
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
    <>
      {/*
  This example requires updating your template:

  ```
  <html class="h-full bg-gray-50">
  <body class="h-full">
  ```
*/}
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
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

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md w-full border">
          <div className="bg-white dark:bg-zinc-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 ">
            <form className="space-y-6" action="#">
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
            </form>

            <div className="mt-6 flex flex-col space-y-4">
              <div className="w-full border-t border-gray-300" />

              <div className="relative flex justify-center text-sm">
                <span className=" px-2 text-zinc-500 dark:text-zinc-200">
                  Or continue with
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <a
                    href="#"
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-zinc-500 shadow-sm hover:bg-gray-50"
                    onClick={() => googleSignIn()}
                  >
                    <p>Sign in with Google</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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

export default Signin;
