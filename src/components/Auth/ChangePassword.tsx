"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useAuth } from "@/contexts/AuthContext";

export const ChangePasswordComponent = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (errorMessages.length > 0) {
      setError("Please fix password validation errors");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      email: user?.email,
      oldPassword,
      password,
    };

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error || data.message || "Password change failed";
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      localStorage.removeItem("cb_user");
      localStorage.removeItem("userEmail");
      router.push("/auth/login");
    } catch (err) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsSubmitting(false);
    } finally {
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleCloseError = () => {
    setError("");
  };

  const passwordRules = useMemo(
    () => ({
      minLength: (password: string) => password.length >= 8,
      hasUpperCase: (password: string) => /[A-Z]/.test(password),
      hasLowerCase: (password: string) => /[a-z]/.test(password),
      hasNumber: (password: string) => /\d/.test(password),
      hasSpecialChar: (password: string) => /[!@#$%^&*]/.test(password),
    }),
    []
  );

  const validatePassword = useCallback(
    (password: string) => {
      const newErrorMessages: string[] = [];

      if (!passwordRules.minLength(password)) {
        newErrorMessages.push("At least 8 characters long.");
      }
      if (!passwordRules.hasUpperCase(password)) {
        newErrorMessages.push("At least one uppercase letter.");
      }
      if (!passwordRules.hasLowerCase(password)) {
        newErrorMessages.push("At least one lowercase letter.");
      }
      if (!passwordRules.hasNumber(password)) {
        newErrorMessages.push("At least one number.");
      }
      if (!passwordRules.hasSpecialChar(password)) {
        newErrorMessages.push("At least one special character.");
      }

      setErrorMessages(newErrorMessages);
    },
    [passwordRules]
  );

  useEffect(() => {
    if (password) {
      validatePassword(password);
    } else {
      setErrorMessages([]);
    }
  }, [password, validatePassword]);
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
        <h2 className="text-[18px] font-[600] text-[#363636]">
          Create new password
        </h2>
        <p className="text-[14px] text-[#ACACAC] mb-[25px] mt-1">
          Enter your old and new password
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="oldPassword">
              Old Password
            </label>
            <input
              placeholder="Enter old password"
              className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:right-0 focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-[14px]" htmlFor="newPassword">
              New Password
            </label>
            <input
              placeholder="Enter new password"
              className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:right-0 focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {!isSubmitting ? "Change Password" : "Changing..."}
          </button>
        </form>
      </div>
    </main>
  );
};
