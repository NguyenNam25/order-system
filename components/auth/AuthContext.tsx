"use client";

import { createContext, useContext } from "react";

import type { User } from "@/types/user";
import { useRouter } from "next/navigation";
import authApi from "@/api/Routes/authApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  currentUser: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.fetchMe,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const login = (user: User) => {
    queryClient.setQueryData(["me"], user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error: ", error);
    } finally {
      queryClient.setQueryData(["me"], null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser ?? null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
