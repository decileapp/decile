import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import FormLayout from "../../components/layouts/FormLayout";
import TextInput from "../../components/individual/TextInput";
import PageHeading from "../../components/layouts/Page/PageHeading";
import Button from "../../components/individual/Button";
import validator from "validator";

const Signup: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [password2, setPassword2] = useState<string>();
  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const user = supabase.auth.user();

  const validateSignup = () => {
    // Validation
    if (!email || !validator.isEmail(email)) {
      setError("Please enter a valid email.");
      return false;
    }

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

    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError("Something went wrong.");
      setLoading(false);
      return;
    }

    if (user) {
      router.push("/");
    } else {
      console.log(error);
    }
    setLoading(false);
    return;
  };

  useEffect(() => {
    if (user) {
      router.push("/queries");
      return;
    }
  }, [user, router.query]);

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <FormLayout pageLoading={loading}>
        <PageHeading title="Sign up" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {checkEmail && (
          <div>
            <p>
              <span className="text-secondary-500">
                Please check your email to verify your account.
              </span>
            </p>
          </div>
        )}
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
          <Button label="Submit" onClick={() => signUp()} type="primary" />
        </div>
      </FormLayout>
    </div>
  );
};

export default Signup;
