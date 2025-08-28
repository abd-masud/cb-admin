"use client";

import Image from "next/image";
import logo from "../../../public/images/logo.webp";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";

export const VerifyOtpComponent = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendText, setResendText] = useState("Resend");
  const [timer, setTimer] = useState(0);
  const router = useRouter();
  const firstOtpInputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleOtpSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleCloseError = () => {
    setError(null);
    setOtp(Array(6).fill(""));
    if (firstOtpInputRef.current) firstOtpInputRef.current.focus();
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
  };

  const autoCloseError = () => {
    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
      setOtp(Array(6).fill(""));
      if (firstOtpInputRef.current) firstOtpInputRef.current.focus();
    }, 5000);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleOtpSubmit = async (enteredOtp: string) => {
    if (!email) {
      setError("User not found");
      autoCloseError();
      return;
    }
    setVerifying(true);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: enteredOtp, email }),
      });

      if (!response.ok) throw new Error("Invalid OTP");

      router.push("/auth/new-password");
    } catch {
      setError("Invalid OTP");
      autoCloseError();
    } finally {
      setTimeout(() => setError(null), 5000);
      setVerifying(false);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("User not found");
      autoCloseError();
      return;
    }

    setLoading(true);
    setResendText("Resending...");
    setTimeout(() => {
      setResendText("Resend");
      setTimer(120);
    }, 2000);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to resend OTP");
    } catch {
      setError("Network error. Please check your connection.");
      autoCloseError();
    } finally {
      setTimeout(() => setError(null), 5000);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer]);
  return (
    <main className="bg-auth_bg bg-no-repeat bg-cover min-h-screen flex justify-center items-center p-4 relative">
      {error && (
        <div className="flex items-center p-4 mb-4 rounded-lg bg-gray-800 text-red-400 absolute top-5 right-5">
          <div className="text-sm font-medium">{error}</div>
          <button onClick={handleCloseError}>
            <FaXmark className="ml-3 text-[14px]" />
          </button>
        </div>
      )}
      <div className="flex justify-center items-center">
        <div className="bg-white rounded-md border shadow-lg sm:p-10 p-5 max-w-[800px] m-auto">
          <div className="flex items-center mb-5 justify-center">
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-[600] text-[#363636]">
                Verify Email Address
              </h2>
              <p className="text-[14px] text-[#ACACAC] mb-[25px] mt-1">
                Enter OTP
              </p>
            </div>
            {verifying && (
              <div className="scale-50">
                <div className="loader"></div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-between py-2 gap-2">
              {otp.map((_, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  ref={index == 0 ? firstOtpInputRef : null}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="sm:w-12 w-8 sm:h-12 h-8 text-center font-[600] border rounded border-[#B9C1CC] text-[#131226] bg-[#EAF2FE] focus:outline-none focus:border-[#307EF3] transition-all duration-300"
                />
              ))}
            </div>
            <p className="text-[14px] text-[#363636] font-[500] mt-4">
              Didn&apos;t receive any code?{" "}
              <button
                type="button"
                className="text-[#363636] hover:text-[#307EF3] ml-1 transition duration-300"
                onClick={handleResendOtp}
                disabled={loading || timer > 0}
              >
                {resendText}{" "}
                <span className="text-red-600">
                  {timer > 0 && `(${Math.floor(timer / 60)}:${timer % 60})`}
                </span>
              </button>
            </p>
            <p className="text-[14px] text-[#363636] font-[500] mt-4">
              <Link
                className="text-[#307EF3] text-[14px] tracking-wide flex items-center"
                href={"/auth/login"}
              >
                <FaAngleLeft className="h-3 mr-1 mt-[2px]" />
                Back
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};
