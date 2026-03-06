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
      href: "/objectives",
      label: "Objectives",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
        >
          <path
            d="M11.2 6.4C11.2 3.75 9.05 1.6 6.4 1.6C3.75 1.6 1.6 3.75 1.6 6.4C1.6 9.05 3.75 11.2 6.4 11.2C9.05 11.2 11.2 9.05 11.2 6.4ZM0 6.4C0 2.865 2.865 0 6.4 0C9.935 0 12.8 2.865 12.8 6.4C12.8 9.935 9.935 12.8 6.4 12.8C2.865 12.8 0 9.935 0 6.4ZM6.4 8.4C7.505 8.4 8.4 7.505 8.4 6.4C8.4 5.295 7.505 4.4 6.4 4.4C5.295 4.4 4.4 5.295 4.4 6.4C4.4 7.505 5.295 8.4 6.4 8.4ZM6.4 2.8C8.3875 2.8 10 4.4125 10 6.4C10 8.3875 8.3875 10 6.4 10C4.4125 10 2.8 8.3875 2.8 6.4C2.8 4.4125 4.4125 2.8 6.4 2.8ZM5.6 6.4C5.6 5.9575 5.9575 5.6 6.4 5.6C6.8425 5.6 7.2 5.9575 7.2 6.4C7.2 6.8425 6.8425 7.2 6.4 7.2C5.9575 7.2 5.6 6.8425 5.6 6.4Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      href: "/checkin",
      label: "Check-ins",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M14.6 8.8C14.9325 8.8 15.2 9.0675 15.2 9.4V12C15.2 12.8825 14.4825 13.6 13.6 13.6H2.40005C1.51755 13.6 0.800049 12.8825 0.800049 12V9.4C0.800049 9.0675 1.06755 8.8 1.40005 8.8C1.73255 8.8 2.00005 9.0675 2.00005 9.4V12C2.00005 12.22 2.18005 12.4 2.40005 12.4H13.6C13.82 12.4 14 12.22 14 12V9.4C14 9.0675 14.2675 8.8 14.6 8.8ZM11.2 2.4C12.0825 2.4 12.8 3.1175 12.8 4V9.6C12.8 10.4825 12.0825 11.2 11.2 11.2H4.80005C3.91755 11.2 3.20005 10.4825 3.20005 9.6V4C3.20005 3.1175 3.91755 2.4 4.80005 2.4H11.2ZM10.2725 4.515C10.005 4.32 9.63005 4.38 9.43505 4.6475L7.29505 7.59L6.63255 6.905C6.40255 6.6675 6.02255 6.66 5.78505 6.89C5.54755 7.12 5.54005 7.5 5.77005 7.7375L6.93005 8.9375C7.05255 9.065 7.22505 9.1325 7.40255 9.12C7.58005 9.1075 7.74255 9.0175 7.84755 8.875L10.405 5.3525C10.6 5.085 10.54 4.71 10.2725 4.515Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      href: "/1on1s",
      label: "1-on-1s",
      icon: (
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
      ),
    },

    {
      href: "/people",
      label: "People",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 2C9.435 2 10.6 3.165 10.6 4.6C10.6 6.035 9.435 7.2 8 7.2C6.565 7.2 5.4 6.035 5.4 4.6C5.4 3.165 6.565 2 8 2ZM2.4 3.8C3.395 3.8 4.2 4.605 4.2 5.6C4.2 6.595 3.395 7.4 2.4 7.4C1.405 7.4 0.6 6.595 0.6 5.6C0.6 4.605 1.405 3.8 2.4 3.8ZM0 12C0 10.2325 1.4325 8.8 3.2 8.8C3.52 8.8 3.83 8.8475 4.1225 8.935C3.3 9.855 2.8 11.07 2.8 12.4V12.8C2.8 13.085 2.86 13.355 2.9675 13.6H0.8C0.3575 13.6 0 13.2425 0 12.8V12ZM13.0325 13.6C13.14 13.355 13.2 13.085 13.2 12.8V12.4C13.2 11.07 12.7 9.855 11.8775 8.935C12.17 8.8475 12.48 8.8 12.8 8.8C14.5675 8.8 16 10.2325 16 12V12.8C16 13.2425 15.6425 13.6 15.2 13.6H13.0325ZM11.8 5.6C11.8 4.605 12.605 3.8 13.6 3.8C14.595 3.8 15.4 4.605 15.4 5.6C15.4 6.595 14.595 7.4 13.6 7.4C12.605 7.4 11.8 6.595 11.8 5.6ZM4 12.4C4 10.19 5.79 8.4 8 8.4C10.21 8.4 12 10.19 12 12.4V12.8C12 13.2425 11.6425 13.6 11.2 13.6H4.8C4.3575 13.6 4 13.2425 4 12.8V12.4Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      href: "/reports",
      label: "Reports",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3.19995 3.2C3.19995 2.3175 3.91745 1.6 4.79995 1.6H8.53745C8.96245 1.6 9.36995 1.7675 9.66995 2.0675L12.3324 4.7325C12.6325 5.0325 12.8 5.44 12.8 5.865V12.8C12.8 13.6825 12.0825 14.4 11.2 14.4H4.79995C3.91745 14.4 3.19995 13.6825 3.19995 12.8V10.4H4.70745L5.92745 11.9675C6.05495 12.1325 6.25995 12.2175 6.46745 12.195C6.67495 12.1725 6.85495 12.0425 6.94495 11.855L8.01745 9.575L8.26495 10.07C8.36745 10.2725 8.57495 10.4025 8.80245 10.4025H10.6025C10.935 10.4025 11.2025 10.135 11.2025 9.8025C11.2025 9.47 10.935 9.2025 10.6025 9.2025H9.17245L8.53745 7.935C8.43495 7.73 8.22245 7.6 7.99245 7.6025C7.76245 7.605 7.55495 7.74 7.45745 7.9475L6.27495 10.4625L5.47495 9.435C5.35995 9.285 5.18495 9.2 4.99995 9.2H3.19995V3.2ZM8.39995 3.0625V5.4C8.39995 5.7325 8.66745 6 8.99995 6H11.3375L8.39995 3.0625Z"
            fill="currentColor"
          />
        </svg>
      ),
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
            src="/logo.svg"
            alt="Logo"
            width={sidebarOpen ? 68 : 32}
            height={sidebarOpen ? 36 : 24}
            className="transition-all duration-300"
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
