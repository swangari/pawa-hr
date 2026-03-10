"use client";

import React, { useState, Fragment, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Popover, Transition, Dialog } from "@headlessui/react";
import { usePathname } from "next/navigation";
import api from "@/app/lib/api";
import { useUserStore } from "@/store/useUserStore";
// import Avatar from "./Avatar";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const userStore = useUserStore();
  const setUser = useUserStore((state) => state.setUser);

  const noHeaderRoutes = ["/login", "/register", "/forgot-password"];

  // Basic sync is now handled by SyncStore in SessionProvider.tsx
  // Fetch full user profile when modal opens
  useEffect(() => {
    if (isProfileModalOpen && !userStore.role) {
      const fetchProfile = async () => {
        try {
          const response = await api.get<any>("/users/me");
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchProfile();
    }
  }, [isProfileModalOpen, userStore.role, setUser]);

  if (noHeaderRoutes.includes(pathname)) {
    return null;
  }

  // Dynamic Breadcrumbs

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  // Dynamic Breadcrumbs
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    // Always start with Dashboard as root
    breadcrumbs.push({
      label: "Dashboard",
      href: "/dashboard",
      current: pathname === "/dashboard" || pathname === "/",
    });

    parts.forEach((part, index) => {
      // Skip dashboard if it's already the root we added
      if (part === "dashboard") return;

      let label =
        part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
      let href = "/" + parts.slice(0, index + 1).join("/");

      // Specific Mappings
      if (part === "employee") {
        label = "Employees";
      } else if (part === "expenses") {
        label = "Expenses";
      } else if (part === "new-employee") {
        label = "Add new employee";
      } else if (part === "edit") {
        return; // Skip "edit"
      }

      // Handle dynamic IDs (UUIDs)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(part)) {
        label = "Details";
      }

      breadcrumbs.push({
        label,
        href,
        current: index === parts.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-[#F8FAFC] sticky top-0 z-40">
      <nav className="flex items-center text-sm text-slate-500">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="material-icons-outlined text-sm mx-2">
                chevron_right
              </span>
            )}
            {crumb.current ? (
              <span className="text-slate-400 font-normal">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-accent-blue hover:text-sky-500 cursor-pointer transition-colors font-medium"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="flex items-center space-x-6">
        {/* User Profile Popover */}
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button className="outline-none">
                <div className="h-8 w-8 rounded-full bg-accent-blue flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                  {userStore.name?.charAt(0) || "U"}
                </div>
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-50 mt-2">
                  <div className="w-64 bg-white rounded-lg shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)] outline outline-1 outline-offset-[-1px] outline-Echo-300 inline-flex flex-col justify-start items-start overflow-hidden">
                    <div className="self-stretch px-4 py-3 border-b border-Echo-300 inline-flex justify-start items-start gap-2.5 overflow-hidden">
                      <div className="w-6 h-6 rounded-full bg-accent-blue flex items-center justify-center text-white text-[10px] font-bold">
                        {userStore.name?.charAt(0) || "U"}
                      </div>
                      <div className="inline-flex flex-col justify-start items-start gap-2">
                        <div className="flex flex-col justify-start items-start">
                          <div className="self-stretch justify-start text-Colors-Gray-900 text-sm font-normal font-sans leading-5 tracking-tight">
                            {userStore.name || "User Name"}
                          </div>
                          <div className="opacity-30 justify-start text-Colors-Gray-900 text-xs font-normal font-sans leading-4 tracking-tight truncate w-40">
                            {userStore.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch p-1 flex flex-col justify-center items-start gap-0">
                      <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="self-stretch p-3 rounded-lg inline-flex justify-start items-center gap-1 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <div className="w-6 h-6 relative">
                          <div className="w-6 h-6 left-0 top-0 absolute overflow-hidden">
                            <div className="w-4 h-5 left-[4.20px] top-[2.70px] absolute">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M8.00005 7.8C9.65755 7.8 11 6.4575 11 4.8C11 3.1425 9.65755 1.8 8.00005 1.8C6.34255 1.8 5.00005 3.1425 5.00005 4.8C5.00005 6.4575 6.34255 7.8 8.00005 7.8ZM7.25755 9.2C4.79505 9.2 2.80005 11.195 2.80005 13.6575C2.80005 14.0675 3.13255 14.4 3.54255 14.4H12.4575C12.8675 14.4 13.2 14.0675 13.2 13.6575C13.2 11.195 11.205 9.2 8.74255 9.2H7.25755Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="justify-start text-Colors-Gray-900 text-sm font-normal font-sans leading-5 tracking-tight">
                          Profile
                        </div>
                      </button>
                      <button className="w-full flex flex-row items-center justify-start gap-0.5 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left self-stretch">
                        <div className="flex items-center justify-center w-6 h-6 flex-shrink-0 ml-[1.5px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="block"
                          >
                            <path
                              d="M4.83975 0.6375C4.91475 0.2675 5.24225 0 5.62225 0H7.11725C7.49725 0 7.82475 0.2675 7.89975 0.6375L8.26225 2.3875C8.61475 2.5375 8.94475 2.73 9.24475 2.9575L10.9397 2.395C11.2997 2.275 11.6947 2.425 11.8847 2.755L12.6322 4.05C12.8222 4.38 12.7547 4.795 12.4697 5.0475L11.1372 6.2325C11.1597 6.4175 11.1697 6.6075 11.1697 6.8C11.1697 6.9925 11.1572 7.1825 11.1372 7.3675L12.4722 8.555C12.7572 8.8075 12.8222 9.225 12.6347 9.5525L11.8872 10.8475C11.6972 11.175 11.3022 11.3275 10.9422 11.2075L9.24725 10.645C8.94475 10.8725 8.61475 11.0625 8.26475 11.215L7.90475 12.9625C7.82725 13.335 7.49975 13.6 7.12225 13.6H5.62725C5.24725 13.6 4.91975 13.3325 4.84475 12.9625L4.48475 11.215C4.13225 11.065 3.80475 10.8725 3.50225 10.645L1.79975 11.2075C1.43975 11.3275 1.04475 11.1775 0.854746 10.8475L0.107246 9.5525C-0.0827541 9.2225 -0.0152541 8.8075 0.269746 8.555L1.60475 7.3675C1.58225 7.1825 1.57225 6.9925 1.57225 6.8C1.57225 6.6075 1.58475 6.4175 1.60475 6.2325L0.269746 5.045C-0.0152541 4.7925 -0.0802541 4.375 0.107246 4.0475L0.854746 2.7525C1.04475 2.4225 1.43975 2.2725 1.79975 2.3925L3.49475 2.955C3.79725 2.7275 4.12725 2.5375 4.47725 2.385L4.83975 0.6375ZM6.36975 8.8C7.47475 8.795 8.36725 7.8975 8.36225 6.7925C8.35725 5.6875 7.45975 4.795 6.35475 4.8C5.24975 4.805 4.35725 5.7025 4.36225 6.8075C4.36725 7.9125 5.26475 8.805 6.36975 8.8Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>

                        <Link
                          href="/configurations"
                          className="text-gray-900 text-sm font-normal font-sans leading-5 tracking-tight"
                        >
                          Settings
                        </Link>
                      </button>
                    </div>
                    <div className="self-stretch p-1 outline outline-1 outline-offset-[-1px] outline-Echo-300 flex flex-col justify-start items-start gap-2.5">
                      <button
                        onClick={handleLogout}
                        className="group self-stretch p-3  rounded-lg flex flex-row justify-start items-center transition-colors w-full text-left"
                      >
                        <div className="w-6 h-6 ml-0.5 flex items-center justify-center flex-shrink-0">
                          <span className="material-icons-outlined !text-[16px] text-gray-600 transition-colors group-hover:text-red-500">
                            logout
                          </span>
                        </div>
                        <Link
                          href="/logout"
                          className="text-Colors-Gray-900 ml-0.5 text-sm font-normal font-sans leading-5 tracking-tight transition-colors group-hover:text-red-500"
                        >
                          Log out
                        </Link>
                      </button>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>

      {/* Profile Modal */}
      <Transition show={isProfileModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsProfileModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[518px] h-[520px] relative bg-white rounded-2xl shadow-[0px_10px_40px_10px_rgba(0,0,0,0.08)] overflow-hidden text-left align-middle transition-all">
                  <div className="w-[518px] h-48 left-0 top-0 absolute bg-black/20" />
                  <div className="w-[452px] left-[33px] top-[144px] absolute inline-flex flex-col justify-start items-start gap-4">
                    <div className="w-28 h-28 rounded-full bg-candidBlue-200 flex items-center justify-center text-accent-blue text-5xl font-bold ring-4 ring-white shadow-lg">
                      {userStore.name?.charAt(0) || "U"}
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch justify-end text-Echo-900 text-xl font-semibold font-sans">
                        {userStore.name || "User Name"}
                      </div>
                      <div className="self-stretch grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="flex flex-col justify-start items-start gap-1">
                          <div className="justify-start text-Echo-900 text-xs font-semibold font-sans">
                            Email
                          </div>
                          <div className="opacity-80 justify-start text-Echo-900 text-xs font-normal font-sans">
                            {userStore.email || "user@example.com"}
                          </div>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-1">
                          <div className="justify-start text-Echo-900 text-xs font-semibold font-sans">
                            Title
                          </div>
                          <div className="px-2 py-0.5 bg-gray-300 rounded-md inline-flex justify-center items-center gap-2.5 w-fit">
                            <div className="justify-start text-Echo-900 text-xs font-normal font-sans">
                              {userStore.role || "Worker"}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-1">
                          <div className="justify-start text-Echo-900 text-xs font-semibold font-sans">
                            Department
                          </div>
                          <div className="justify-start text-Echo-900 text-xs font-normal font-sans">
                            {userStore.department_name || "N/A"}
                          </div>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-1">
                          <div className="justify-start text-Echo-900 text-xs font-semibold font-sans">
                            Contract Type
                          </div>
                          <div className="justify-start text-Echo-900 text-xs font-normal font-sans capitalize">
                            {userStore.contract_type?.replace(/_/g, " ") ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </header>
  );
}
