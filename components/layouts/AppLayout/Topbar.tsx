import React, { useState, useEffect } from "react";

/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react";
import {
  DatabaseIcon,
  CodeIcon,
  XIcon,
  MenuIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";
import Switch from "../../individual/Switch";
import { classNames } from "../../../utils/classnames";
import axios from "axios";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import Pricing from "../../pricing";
import Loading from "../../individual/Loading";

interface Item {
  name: string;
  icon: any;
  href: string;
  current: Boolean;
}

const Topbar: React.FC = ({ children }) => {
  const [currentLoc, setCurrentLoc] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const session = useSession();
  const { theme, setTheme } = useTheme();
  const supabase = useSupabaseClient();
  const [trialEnded, setTrialEnded] = useState(false);

  let authLeft: Item[] = user
    ? [
        { name: "Learn", href: "/learn", icon: CodeIcon, current: false },
        { name: "Queries", href: "/queries", icon: CodeIcon, current: false },
        { name: "Charts", href: "/charts", icon: ChartBarIcon, current: false },
        {
          name: "Schedule",
          href: "/schedule",
          icon: ClockIcon,
          current: false,
        },
      ]
    : [];

  if (user?.user_metadata.role_id === 1) {
    authLeft.push({
      name: "Sources",
      href: "/sources",
      icon: DatabaseIcon,
      current: false,
    });
  }

  // Signout
  const signout = async () => {
    await supabase.auth.signOut();
    location.reload();
    return;
  };

  const checkTrial = async () => {
    try {
      if (!user) {
        return;
      }
      // Check if free trial is over
      const { data, error } = await supabase
        .from("organisations")
        .select("created_at, id, plan_id")
        .match({ id: user?.user_metadata.org_id })
        .single();
      if (!data) {
        router.push("/onboard/team/new");
        return;
      }

      const d = new Date();
      const cutoff = d.getTime() - 14 * 24 * 60 * 60 * 1000;
      if (new Date(data.created_at) < new Date(cutoff) && data.plan_id === 1) {
        setTrialEnded(true);
      }
    } catch (e) {
      console.error(e);
      return;
    }
  };

  useEffect(() => {
    setCurrentLoc(router.pathname);

    // if (user && user.user_metadata.plan_id === 1) {
    //   checkTrial();
    // }
  }, [router.pathname, user]);

  const trialComp = (
    <div className="flex flex-col h-full w-full  justify-center items-center pt-8">
      <Pricing showTrialExpiry={false} />
    </div>
  );

  return (
    <>
      <div className="flex flex-col  w-full grow overflow-hidden">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          theme={theme}
          rtl={false}
          draggable
          pauseOnHover={false}
        />

        <Disclosure as="nav">
          {({ open }) => (
            <>
              <div className="mx-auto px-4 border-b border-zinc-200 bg-white dark:bg-zinc-800">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <a className="text-lg font-bold" href="/">
                        Decile
                      </a>
                    </div>

                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8 ">
                      {authLeft.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            currentLoc === item.href
                              ? " text-primary-500"
                              : "hover:text-primary-600 hover:bg-opacity-75",
                            "group flex items-center px-2 py-2 text-base rounded-md"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                    {user && (
                      <>
                        <a
                          className="hover:text-primary-600 hover:bg-opacity-75 mr-4 text-base"
                          onClick={() => {
                            router.push("/onboard");
                          }}
                          href="#"
                        >
                          Help
                        </a>
                        <Switch
                          setSelected={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                          }
                          value={theme === "dark" ? true : false}
                          trueIcon={<MoonIcon />}
                          falseIcon={<SunIcon />}
                        />

                        {user.user_metadata.role_id && (
                          <a
                            className="border-transparent 
                              block pl-3 pr-4 py-2 border-l-4 text-base "
                            onClick={() => router.push("/settings")}
                            href="#"
                          >
                            {user?.user_metadata.org_name}
                          </a>
                        )}
                        <a
                          className="hover:text-primary-600 hover:bg-opacity-75 text-base"
                          onClick={() => signout()}
                          href="#"
                        >
                          Logout
                        </a>
                      </>
                    )}

                    {!user && (
                      <a
                        className="hover:text-primary-600 hover:bg-opacity-75 text-base"
                        onClick={() => {
                          router.push("/auth/signin");
                        }}
                        href="#"
                      >
                        Signin
                      </a>
                    )}
                    {!user && (
                      <a
                        className="hover:text-primary-600 hover:bg-opacity-75 text-base"
                        onClick={() => {
                          router.push("/auth/signup");
                        }}
                        href="#"
                      >
                        Signup
                      </a>
                    )}
                  </div>

                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="dark:bg-stone-900 inline-flex items-center justify-center p-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden ">
                {/* LOGGED IN - MOBILE */}

                <div className="pt-2 pb-3 space-y-1 overflow-hidden">
                  {authLeft.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-primary-50 border-primary-500 text-primary-700"
                          : "border-transparent",
                        "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}

                  {user && (
                    <>
                      <a
                        className="border-transparent 
                              block pl-3 pr-4 py-2 border-l-4 text-base"
                        href="/onboard"
                      >
                        Help
                      </a>
                      {user?.user_metadata.role_id && (
                        <a
                          className="border-transparent 
                              block pl-3 pr-4 py-2 border-l-4 text-base"
                          onClick={() => router.push("/settings")}
                          href="#"
                        >
                          {user?.user_metadata.org_name}
                        </a>
                      )}
                      {user && (
                        <a
                          className="border-transparent 
                          block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                          onClick={() => signout()}
                          href="#"
                        >
                          Logout
                        </a>
                      )}
                    </>
                  )}

                  {!user && (
                    <a
                      className="border-transparent 
                          block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      onClick={() => {
                        router.push("auth/signin");
                      }}
                      href="#"
                    >
                      Signin
                    </a>
                  )}
                  {!user && (
                    <a
                      className="border-transparent 
                          block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      onClick={() => {
                        router.push("auth/signup");
                      }}
                      href="#"
                    >
                      Signup
                    </a>
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main className="flex flex-col grow h-full w-full overflow-hidden">
          {loading ? <Loading /> : trialEnded ? trialComp : children}
        </main>
      </div>
    </>
  );
};

export default Topbar;
