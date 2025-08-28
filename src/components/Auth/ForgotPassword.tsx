"use client";

import Image from "next/image";
import logo from "../../../public/images/logo.webp";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

export const ForgotPasswordComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userEmail", email);
        setTimeout(() => router.push("/auth/verify-otp"));
      } else {
        setError(data.message || "Failed to send verification code.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setTimeout(() => setError(null), 5000);
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };
  return (
    <main className="bg-auth_bg bg-no-repeat bg-cover min-h-screen flex justify-center items-center p-4 relative">
      {error && (
        <div className="flex items-center px-4 py-2 mb-4 rounded-lg bg-gray-800 text-red-400 border-2 border-red-400 absolute top-5 right-5">
          <div className="text-sm font-medium">{error}</div>
          <button onClick={handleCloseError}>
            <FaXmark className="ml-3 text-[14px]" />
          </button>
        </div>
      )}
      <div className="bg-white rounded-md border drop-shadow-md p-6 my-16 sm:p-8 w-full max-w-md">
        <div className="flex justify-center mb-5">
          <Link href={"/"}>
            <div className="flex items-center justify-center">
              <Image
                className="mr-3"
                priority
                src={logo}
                height={40}
                width={40}
                alt={"Logo"}
              />
              <p className="text-black font-bold sm:text-[24px] text-[22px]">
                Copa Business
              </p>
            </div>
          </Link>
        </div>
        <h2 className="text-[18px] font-[600] text-[#363636] mb-4">
          Forgot your password?
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="text-[14px]" htmlFor="email">
              Email Address
            </label>
            <input
              placeholder="Enter email address"
              className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:right-0 focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="text-[14px] bg-[#307EF3] hover:bg-[#478cf3] w-full py-2 rounded text-white cursor-pointer focus:bg-[#307EF3] transition-all duration-300  my-4"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
          <Link
            className="text-[#307EF3] text-[14px] tracking-wide flex items-center"
            href={"/auth/login"}
          >
            <FaAngleLeft className="h-3 mr-1 mt-[2px]" />
            Back
          </Link>
        </form>
      </div>
    </main>
  );
};
