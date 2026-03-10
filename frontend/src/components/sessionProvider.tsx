"use client";

import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import api from "@/app/lib/api";

function SyncStore() {
  const { data: session, status } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const isSyncing = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const store = useUserStore.getState();
      const emailInStore = store.email;
      const tokenInStore = store.accessToken;

      // Basic sync if email or token is missing or different
      if (
        !emailInStore ||
        emailInStore !== session.user.email ||
        tokenInStore !== (session as any).accessToken
      ) {
        setUser({
          id: (session.user as any).id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          // @ts-ignore
          accessToken: session.accessToken,
        });
      }

      // Fetch full profile if not already syncing and missing important data
      const departmentNameInStore = useUserStore.getState().department_name;
      if (!departmentNameInStore && !isSyncing.current) {
        isSyncing.current = true;
        const fetchProfile = async () => {
          try {
            const response = await api.get<any>("/users/me");
            setUser({
              role: response.data.role,
              department_name: response.data.department_name,
              department_id: response.data.department_id,
              contract_type: response.data.contract_type,
              name: response.data.name, // Ensure we have the full name from DB
            });
          } catch (error) {
            console.error("Error fetching user profile:", error);
          } finally {
            isSyncing.current = false;
          }
        };
        fetchProfile();
      }
    } else if (status === "unauthenticated") {
      clearUser();
      isSyncing.current = false;
    }
  }, [session?.user?.email, status, setUser, clearUser]);

  return null;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={5 * 60}>
      <SyncStore />
      {children}
    </SessionProvider>
  );
}
