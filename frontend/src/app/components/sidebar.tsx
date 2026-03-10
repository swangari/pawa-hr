"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[222px] h-screen bg-pawa-navy shrink-0" />;
  }

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M1.59998 8C1.59998 4.465 4.46498 1.6 7.99998 1.6C11.535 1.6 14.4 4.465 14.4 8C14.4 11.535 11.535 14.4 7.99998 14.4C4.46498 14.4 1.59998 11.535 1.59998 8ZM9.59998 10.4C9.59998 9.7275 9.18748 9.1525 8.59998 8.9175V4.6C8.59998 4.2675 8.33248 4 7.99998 4C7.66748 4 7.39998 4.2675 7.39998 4.6V8.9175C6.81248 9.155 6.39998 9.73 6.39998 10.4C6.39998 11.2825 7.11748 12 7.99998 12C8.88248 12 9.59998 11.2825 9.59998 10.4ZM5.19998 6C5.64248 6 5.99998 5.6425 5.99998 5.2C5.99998 4.7575 5.64248 4.4 5.19998 4.4C4.75748 4.4 4.39998 4.7575 4.39998 5.2C4.39998 5.6425 4.75748 6 5.19998 6ZM4.79998 8C4.79998 7.5575 4.44248 7.2 3.99998 7.2C3.55748 7.2 3.19998 7.5575 3.19998 8C3.19998 8.4425 3.55748 8.8 3.99998 8.8C4.44248 8.8 4.79998 8.4425 4.79998 8ZM12 8.8C12.4425 8.8 12.8 8.4425 12.8 8C12.8 7.5575 12.4425 7.2 12 7.2C11.5575 7.2 11.2 7.5575 11.2 8C11.2 8.4425 11.5575 8.8 12 8.8ZM11.6 5.2C11.6 4.7575 11.2425 4.4 10.8 4.4C10.3575 4.4 9.99998 4.7575 9.99998 5.2C9.99998 5.6425 10.3575 6 10.8 6C11.2425 6 11.6 5.6425 11.6 5.2Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      href: "/expenses",
      label: "Expenses",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M0.800049 4.8C0.800049 3.91634 1.51639 3.2 2.40005 3.2H13.6C14.4837 3.2 15.2 3.91634 15.2 4.8V11.2C15.2 12.0837 14.4837 12.8 13.6 12.8H2.40005C1.51639 12.8 0.800049 12.0837 0.800049 11.2V4.8ZM2.40005 4.8V11.2H13.6V4.8H2.40005ZM8.00005 10C9.10462 10 10 9.10457 10 8C10 6.89543 9.10462 6 8.00005 6C6.89548 6 6.00005 6.89543 6.00005 8C6.00005 9.10457 6.89548 10 8.00005 10Z"
            fill="currentColor"
          />
        </svg>
      ),
    },

    {
      href: "/employee",
      label: "Employees",
      icon: <span className="material-icons-outlined text-[20px]">groups</span>,
    },
  ];

  return (
    <div
      className={cn(
        "flex h-screen py-[24px] px-[12px] flex-col justify-between items-start shrink-0 bg-pawa-navy text-white transition-all duration-300 ease-in-out relative",
        sidebarOpen ? "w-[222px]" : "w-[64px]",
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        /* Changed: -right-3 (adjusted for better overhang)
     Changed: rounded-full rounded-br-none (this creates the teardrop)
  */
        className="absolute -right-3 top-12 flex items-center justify-center bg-white text-pawa-navy border border-pawa-navy shadow-lg h-7 w-7 rounded-full rounded-br-full shadow-md transition-colors z-50"
      >
        <span className="material-icons-outlined !text-[18px] leading-none block">
          {sidebarOpen ? "chevron_left" : "chevron_right"}
        </span>
      </button>

      <div className="flex flex-col items-start gap-[24px] self-stretch overflow-hidden">
        <div
          className={cn(
            "flex items-center ml-[9px]",
            !sidebarOpen && "!ml-0 justify-center w-full",
          )}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={sidebarOpen ? 68 : 32}
            height={sidebarOpen ? 36 : 24}
            priority
            className="transition-all duration-300"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <div className="flex flex-col p-[8px] justify-between items-start gap-[6px] self-stretch">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-[4px] self-stretch px-0 py-2 rounded-lg transition-all text-[13px] font-[family:var(--Font-family-body,'Source_Sans_Pro')] font-normal leading-normal group",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5",
                )}
              >
                <div
                  className={cn(
                    "w-[24px] h-[24px] flex items-center justify-center shrink-0",
                    !sidebarOpen && "w-full",
                  )}
                >
                  {item.icon}
                </div>
                {sidebarOpen && (
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col p-[8px] gap-2 self-stretch overflow-hidden">
        <Link
          href="/configurations"
          className={cn(
            "flex items-center self-stretch py-2 rounded-lg transition-all text-[13px] font-[family:var(--Font-family-body,'Source_Sans_Pro')] font-normal leading-normal group",
            pathname.startsWith("/configurations")
              ? "bg-white/10 text-white"
              : "text-white/70 hover:text-white hover:bg-white/5",
          )}
        >
          <div
            className={cn(
              "w-[24px] h-[24px] flex items-center justify-center shrink-0",
              !sidebarOpen && "w-full",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
            >
              <path
                d="M4.83975 0.6375C4.91475 0.2675 5.24225 0 5.62225 0H7.11725C7.49725 0 7.82475 0.2675 7.89975 0.6375L8.26225 2.3875C8.61475 2.5375 8.94475 2.73 9.24475 2.9575L10.9397 2.395C11.2997 2.275 11.6947 2.425 11.8847 2.755L12.6322 4.05C12.8222 4.38 12.7547 4.795 12.4697 5.0475L11.1372 6.2325C11.1597 6.4175 11.1697 6.6075 11.1697 6.8C11.1697 6.9925 11.1572 7.1825 11.1372 7.3675L12.4722 8.555C12.7572 8.8075 12.8222 9.225 12.6347 9.5525L11.8872 10.8475C11.6972 11.175 11.3022 11.3275 10.9422 11.2075L9.24725 10.645C8.94475 10.8725 8.61475 11.0625 8.26475 11.215L7.90475 12.9625C7.82725 13.335 7.49975 13.6 7.12225 13.6H5.62725C5.24725 13.6 4.91975 13.3325 4.84475 12.9625L4.48475 11.215C4.13225 11.065 3.80475 10.8725 3.50225 10.645L1.79975 11.2075C1.43975 11.3275 1.04475 11.1775 0.854746 10.8475L0.107246 9.5525C-0.0827541 9.2225 -0.0152541 8.8075 0.269746 8.555L1.60475 7.3675C1.58225 7.1825 1.57225 6.9925 1.57225 6.8C1.57225 6.6075 1.58475 6.4175 1.60475 6.2325L0.269746 5.045C-0.0152541 4.7925 -0.0802541 4.375 0.107246 4.0475L0.854746 2.7525C1.04475 2.4225 1.43975 2.2725 1.79975 2.3925L3.49475 2.955C3.79725 2.7275 4.12725 2.5375 4.47725 2.385L4.83975 0.6375ZM6.36975 8.8C7.47475 8.795 8.36725 7.8975 8.36225 6.7925C8.35725 5.6875 7.45975 4.795 6.35475 4.8C5.24975 4.805 4.35725 5.7025 4.36225 6.8075C4.36725 7.9125 5.26475 8.805 6.36975 8.8Z"
                fill="currentColor"
              />
            </svg>
          </div>
          {sidebarOpen && (
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Settings
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
