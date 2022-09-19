import React, { useState, useEffect } from "react";

/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react";
import { XIcon, MenuIcon, CogIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

import { LinkIcon, PhotographIcon } from "@heroicons/react/solid";
import { ProfileItem } from "../../../types/Profile";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";
import Header from "../Header";
import { useUser } from "@auth0/nextjs-auth0";

interface Item {
  label: string;
  icon: any;
  link: string;
  current: Boolean;
}

const Sidebar: React.FC = ({ children }) => {
  const [currentLoc, setCurrentLoc] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileItem>();
  const { user, error, isLoading } = useUser();

  const { theme } = useTheme();

  let authLeft: Item[] = [
    {
      label: "Preview",
      link: `/preview`,
      icon: LinkIcon,
      current: false,
    },
    {
      label: "Profile",
      link: "/profile",
      icon: CogIcon,
      current: false,
    },
    {
      label: "NFTs",
      link: "/nfts",
      icon: PhotographIcon,
      current: false,
    },

    {
      label: "Links",
      link: "/links",
      icon: LinkIcon,
      current: false,
    },
    {
      label: "Subscribers",
      link: "/subscribers",
      icon: PhotographIcon,
      current: false,
    },
  ];

  let unAuthRight: Item[] = [
    { label: "", link: "", icon: CogIcon, current: false },
    {
      label: "Sign Up",
      link: "/auth/signup",
      icon: CogIcon,
      current: false,
    },
    {
      label: "Sign In",
      link: "/auth/signin",
      icon: CogIcon,
      current: false,
    },
  ];

  let unAuthLeft: Item[] = [
    // {
    //   label: "Mints",
    //   link: `/mints`,
    //   icon: LinkIcon,
    //   current: false,
    // },
    // {
    //   label: "Analytics",
    //   link: "/analytics",
    //   icon: CogIcon,
    //   current: false,
    // },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    setCurrentLoc(router.pathname);
  }, [router.pathname, user]);

  return (
    <>
      <div className="flex flex-col grow px-4 sm:px-6 pt-1">
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
              <div className="flex grow justify-center w-full">
                {!user && (
                  <div className="grid  grid-cols-3 py-2 gap-2 w-full">
                    <div className="flex flex-1 justify-start col-span-1 items-center">
                      <div className="hidden sm:grid grid-cols-3 gap-4">
                        {unAuthLeft.map((item, id) => (
                          <a
                            key={id}
                            href={item.link}
                            className={classNames(
                              currentLoc === item.link
                                ? " text-primary-600"
                                : "hover:text-secondary-600 hover:bg-opacity-75",
                              "group flex items-center px-2 py-2 text-base rounded-md"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-1 justify-center col-span-1 items-center">
                      <Header />
                    </div>

                    <div className="hidden sm:grid grid-cols-3 gap-4  ">
                      {unAuthRight.map((item, id) => (
                        <a
                          key={id}
                          href={item.link}
                          className={classNames(
                            currentLoc === item.link
                              ? " text-primary-600"
                              : "hover:text-secondary-600 hover:bg-opacity-75",
                            "group flex items-center justify-end px-2 py-2 text-base rounded-md"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>

                    <div className="-mr-2 flex items-center justify-end sm:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="dark:bg-stone-900 inline-flex items-center justify-center p-2 rounded-md ">
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
                )}
              </div>

              {!user && (
                <Disclosure.Panel className="sm:hidden ">
                  {/* NOT LOGGED IN - MOBILE */}

                  <div className="pt-2 pb-3 space-y-1 overflow-hidden">
                    {unAuthLeft
                      .concat(unAuthRight)
                      .filter((item) => item.label !== "")
                      .map((item, id) => (
                        <Disclosure.Button
                          key={id}
                          as="a"
                          href={item.link}
                          className={classNames(
                            item.current
                              ? "bg-primary-50 border-primary-500 text-primary-700"
                              : "border-transparent",
                            "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.label}
                        </Disclosure.Button>
                      ))}
                  </div>
                </Disclosure.Panel>
              )}

              {user && (
                <div className="mx-auto px-4 sm:px-6 border-b border-zinc-200">
                  <div className="flex justify-between h-16">
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center">
                        <a
                          className="text-lg font-bold"
                          href={user ? "/nfts" : "/"}
                        >
                          Dataverse
                        </a>
                      </div>

                      <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8 ">
                        {authLeft.map((item) => (
                          <a
                            key={item.label}
                            href={item.link}
                            className={classNames(
                              currentLoc === item.link
                                ? " text-primary-500"
                                : "hover:text-primary-300 hover:bg-opacity-75",
                              "group flex items-center px-2 py-2 text-base rounded-md"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                      <a
                        className="hover:text-secondary-600 hover:bg-opacity-75 ml-4 text-base"
                        onClick={() =>
                          router.push("http://localhost:3000/api/auth/logout")
                        }
                        href="#"
                      >
                        Logout
                      </a>
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
              )}

              {user && (
                <Disclosure.Panel className="sm:hidden ">
                  {/* LOGGED IN - MOBILE */}

                  <div className="pt-2 pb-3 space-y-1 overflow-hidden">
                    {authLeft.map((item) => (
                      <Disclosure.Button
                        key={item.label}
                        as="a"
                        href={item.link}
                        className={classNames(
                          item.current
                            ? "bg-primary-50 border-primary-500 text-primary-700"
                            : "border-transparent",
                          "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.label}
                      </Disclosure.Button>
                    ))}
                    <p
                      className="border-transparent 
                              block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    >
                      {user.email}
                    </p>
                    <a
                      className="border-transparent 
                          block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      onClick={() =>
                        router.push("http://localhost:3000/api/auth/logout")
                      }
                      href="#"
                    >
                      Logout
                    </a>
                  </div>
                </Disclosure.Panel>
              )}
            </>
          )}
        </Disclosure>

        <main className="flex flex-col grow">
          <div className="flex flex-col grow py-4 px-4 sm:px-6 ">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default Sidebar;
