import React, { useState, useEffect } from "react";

/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react";
import {
  DatabaseIcon,
  HomeIcon,
  CodeIcon,
  XIcon,
  MenuIcon,
  ClockIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { supabase } from "../../../utils/supabaseClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";
import Switch from "../../individual/Switch";
import { classNames } from "../../../utils/classnames";

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
  const user = supabase.auth.user();
  const session = supabase.auth.session();
  const { theme, setTheme } = useTheme();

  let authLeft: Item[] = user
    ? [
        { name: "Home", href: "/", icon: HomeIcon, current: false },

        { name: "Queries", href: "/queries", icon: CodeIcon, current: false },

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

  useEffect(() => {
    setCurrentLoc(router.pathname);
  }, [router.pathname, user]);

  return (
    <>
      <div className="flex flex-col  w-full grow pt-1">
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
              <div className="mx-auto px-4 sm:px-6 border-b border-zinc-200">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <a className="text-lg font-bold" href="/">
                        Subtable
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
                              : "hover:text-primary-300 hover:bg-opacity-75",
                            "group flex items-center px-2 py-2 text-base rounded-md"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    {user && (
                      <>
                        <Switch
                          setSelected={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                          }
                          value={theme === "dark" ? true : false}
                          trueIcon={<MoonIcon />}
                          falseIcon={<SunIcon />}
                        />

                        {session && (
                          <a
                            className="border-transparent 
                              block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            href="/organisation"
                          >
                            {session?.user?.user_metadata.org_name}
                          </a>
                        )}
                        <a
                          className="hover:text-secondary-600 hover:bg-opacity-75 ml-4 text-base"
                          onClick={() => {
                            supabase.auth.signOut();
                            location.reload();
                          }}
                          href="#"
                        >
                          Logout
                        </a>
                      </>
                    )}
                    {!user && (
                      <a
                        className="hover:text-secondary-600 hover:bg-opacity-75 ml-4 text-base"
                        onClick={() => {
                          router.push("/auth/signin");
                        }}
                        href="#"
                      >
                        Signin
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
                      {session && (
                        <a
                          className="border-transparent 
                              block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                          href="/organisation"
                        >
                          {session?.user?.user_metadata.org_name}
                        </a>
                      )}
                      {user && (
                        <a
                          className="border-transparent 
                          block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                          onClick={() => {
                            supabase.auth.signOut();
                            location.reload();
                          }}
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
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main className="flex flex-col grow h-full w-full">{children}</main>
      </div>
    </>
  );
};

export default Topbar;
