import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TextInput from "../../components/individual/TextInput";
import Button from "../../components/individual/Button";
import validator from "validator";
import { toast } from "react-toastify";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

const Signup: NextPage = () => {
  const router = useRouter();
  const { orgId, roleId } = router.query;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [password2, setPassword2] = useState<string>();
  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const user = useUser();
  const supabase = useSupabaseClient();

  const signUp = async () => {
    try {
      setError("");
      setLoading(true);
      // Validation
      if (!email || !validator.isEmail(email)) {
        setError("Please enter a valid email.");
        return;
      }

      if (!password) {
        setError("Please enter a password.");
        return;
      }

      if (password !== password2) {
        setError("Passwords do not match.");
        return;
      }

      if (password) {
        if (!validator.isStrongPassword(password)) {
          setError(
            "Password must be atleast 8 characters and include: lower case, upper case, number and symbol."
          );
          return;
        }
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError("Something went wrong.");
        setLoading(false);
        return;
      }

      setCheckEmail(true);
      setLoading(false);
      return;
    } catch (e) {
      toast.error("Something went wrong.");
      setLoading(false);
      return;
    }
  };

  const googleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      return;
    } catch (e) {
      toast.error("Something went wrong");
      return;
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/queries");
      return;
    }
  }, [user, router.query]);

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Signup
          </h2>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          {checkEmail && (
            <p className="text-sm text-center text-secondary-500 mt-1">
              Please check your email to verify your account and login.
            </p>
          )}
        </div>

        {!checkEmail && (
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md w-full border rounded-lg">
            <div className="bg-white dark:bg-zinc-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 ">
              <form className="space-y-6" action="#">
                {!checkEmail && (
                  <>
                    <TextInput
                      name="email"
                      id="email"
                      value={email || ""}
                      handleChange={setEmail}
                      type="email"
                      label="Email"
                    />
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

                    <p className="text-sm mt-1">
                      Already have an account?{" "}
                      <a
                        href="#"
                        onClick={() => router.push("/auth/signin")}
                        className="text-secondary-500"
                      >
                        {" "}
                        Sign in.
                      </a>
                    </p>

                    <div className="flex flex-row justify-end">
                      <Button
                        label="Submit"
                        onClick={() => signUp()}
                        type="primary"
                      />
                    </div>
                  </>
                )}
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
                      onClick={() => googleSignUp()}
                    >
                      <p>Google</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
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

export default Signup;
