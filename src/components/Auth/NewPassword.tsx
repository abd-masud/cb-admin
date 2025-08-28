"use client";

import Image from "next/image";
import logo from "../../../public/images/logo.webp";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";

export const NewPasswordComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [createNewPassword, setCreateNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError("Invalid session.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      setError("Email not found.");
      setIsSubmitting(false);
      return;
    }

    if (errorMessages.length > 0) {
      setError("Please fix password validation errors");
      setIsSubmitting(false);
      return;
    }

    if (createNewPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      email,
      newPassword: createNewPassword,
    };

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        localStorage.removeItem("cb_user");
        localStorage.removeItem("userEmail");
        router.push("/auth/login");
      } else {
        const { message } = await response.json();
        setError(message || "Password reset failed. Try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const passwordRules = useMemo(
    () => ({
      minLength: (createNewPassword: string) => createNewPassword.length >= 8,
      hasUpperCase: (createNewPassword: string) =>
        /[A-Z]/.test(createNewPassword),
      hasLowerCase: (createNewPassword: string) =>
        /[a-z]/.test(createNewPassword),
      hasNumber: (createNewPassword: string) => /\d/.test(createNewPassword),
      hasSpecialChar: (createNewPassword: string) =>
        /[!@#$%^&*]/.test(createNewPassword),
    }),
    []
  );

  const validatePassword = useCallback(
    (createNewPassword: string) => {
      const newErrorMessages: string[] = [];

      if (!passwordRules.minLength(createNewPassword)) {
        newErrorMessages.push("At least 8 characters long.");
      }
      if (!passwordRules.hasUpperCase(createNewPassword)) {
        newErrorMessages.push("At least one uppercase letter.");
      }
      if (!passwordRules.hasLowerCase(createNewPassword)) {
        newErrorMessages.push("At least one lowercase letter.");
      }
      if (!passwordRules.hasNumber(createNewPassword)) {
        newErrorMessages.push("At least one number.");
      }
      if (!passwordRules.hasSpecialChar(createNewPassword)) {
        newErrorMessages.push("At least one special character.");
      }

      setErrorMessages(newErrorMessages);
    },
    [passwordRules]
  );

  useEffect(() => {
    if (createNewPassword) {
      validatePassword(createNewPassword);
    } else {
      setErrorMessages([]);
    }
  }, [createNewPassword, validatePassword]);

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
        <h2 className="text-[18px] font-[600] text-[#363636]">
          Create new password
        </h2>
        <p className="text-[14px] text-[#ACACAC] mb-[25px] mt-1">
          Enter your new password
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="newPassword">
              New Password
            </label>
            <input
              placeholder="Enter new password"
              className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:right-0 focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
              type="password"
              id="password"
              value={createNewPassword}
              onChange={(e) => setCreateNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              placeholder="Enter new password again"
              className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:right-0 focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
              type="password"
              id="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {errorMessages.length > 0 && (
            <div className="text-red-600 text-sm">
              <ol className="list-disc">
                {errorMessages.map((message, index) => (
                  <li key={index} className="block">
                    {message}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <button
            className="text-[14px] bg-[#307EF3] hover:bg-[#478cf3] w-full py-2 rounded text-white cursor-pointer focus:bg-[#307EF3] transition-all duration-300  my-4"
            disabled={isSubmitting}
          >
            {!isSubmitting ? "Change password" : "Changing..."}
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
