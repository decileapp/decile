import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  DatabaseIcon,
  HomeIcon,
  CodeIcon,
  PlusIcon,
  XIcon,
  SearchIcon,
  MenuIcon,
} from "@heroicons/react/outline";
import { LogoutIcon, UserIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import { classNames } from "../../../utils/classnames";

const sidebarNavigation = [
  { name: "Home", href: "/queries", icon: HomeIcon, current: false },
  { name: "Queries", href: "/queries", icon: CodeIcon, current: false },
  { name: "Sources", href: "/sources", icon: DatabaseIcon, current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#", icon: UserIcon, current: false },
  { name: "Sign out", href: "/auth/signout", icon: LogoutIcon, current: false },
];

const SideBarShell: React.FC = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = supabase.auth.user();

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full overflow-hidden">
        ```
      */}
      <div className="flex h-full w-full">
        {/* Narrow sidebar */}

        <div className="hidden w-28 overflow-y-auto bg-indigo-700 md:block">
          <div className="flex w-full h-full flex-col items-center py-6">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                alt="Your Company"
              />
            </div>
            <div className="mt-6 w-full flex-1 space-y-1 px-2">
              {sidebarNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                    "group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-white"
                        : "text-indigo-300 group-hover:text-white",
                      "h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  <span className="mt-2">{item.name}</span>
                </a>
              ))}
            </div>
            <div className=" w-full flex-1 space-y-1 px-2 flex flex-col justify-end">
              {userNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                    "group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-white"
                        : "text-indigo-300 group-hover:text-white",
                      "h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  <span className="mt-2">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-20 md:hidden"
            onClose={setMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-1 right-0 -mr-14 p-1">
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Close sidebar</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=white"
                      alt="Your Company"
                    />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                    <nav className="flex h-full flex-col justify-between">
                      <div className="space-y-1">
                        {sidebarNavigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-indigo-800 text-white"
                                : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                              "group py-2 px-3 rounded-md flex items-center text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-white"
                                  : "text-indigo-300 group-hover:text-white",
                                "mr-3 h-6 w-6"
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </a>
                        ))}
                      </div>
                      <div className="space-y-1">
                        {userNavigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-indigo-800 text-white"
                                : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                              "group py-2 px-3 rounded-md flex items-center text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-white"
                                  : "text-indigo-300 group-hover:text-white",
                                "mr-3 h-6 w-6"
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}
        <div className=" flex flex-1 flex-col overflow-hidden">
          <header className="md:hidden w-full">
            <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 "
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </header>

          {/* Main content */}
          <div className="flex flex-1 items-stretch overflow-hidden ">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBarShell;
