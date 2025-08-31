"use client";

import { AuthContextType, User } from "@/types/context";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provides auth context to the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("cb_admin");

    if (storedUser) {
      try {
        const decode = jwtDecode<JwtPayload & User>(storedUser);
        const userData: User = {
          id: decode.id,
          name: decode.name,
          last_name: decode.last_name,
          email: decode.email,
          contact: decode.contact,
          company: decode.company,
          logo: decode.logo,
          address: decode.address,
          role: decode.role,
          status: decode.status,
          image: decode.image,
        };
        setUser(userData);
      } catch {
        localStorage.removeItem("cb_admin");
        router.push("/");
      }
    } else {
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context == undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
