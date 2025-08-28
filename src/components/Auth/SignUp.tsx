"use client";

import Image from "next/image";
import logo from "../../../public/images/logo.webp";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";

export const SignUpComponent = () => {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    contact: "",
    company: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTermsChecked(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (errorMessages.length > 0) {
      setError("Please fix password validation errors");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const dataToSubmit = {
      name: formData.name,
      last_name: formData.last_name,
      email: formData.email,
      contact: formData.contact,
      company: formData.company,
      address: formData.address,
      role: "Admin",
      password: formData.password,
    };

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        router.push("/auth/login");
      } else {
        const { message } = await response.json();
        setError(message);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setTimeout(() => setError(null), 5000);
      setIsSubmitting(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
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
    if (formData.password) {
      validatePassword(formData.password);
    } else {
      setErrorMessages([]);
    }
  }, [formData.password, validatePassword]);

  return (
    <main className="bg-auth_bg bg-no-repeat bg-cover min-h-screen flex justify-center items-center p-4 relative">
      {error && (
        <div className="flex items-center px-4 py-2 mb-4 rounded-lg bg-gray-800 text-red-400 border-2 border-red-400 top-5 right-5 fixed">
          <div className="text-sm font-medium">{error}</div>
          <button onClick={handleCloseError}>
            <FaXmark className="ml-3 text-[14px]" />
          </button>
        </div>
      )}
      <div className="py-16">
        <div className="bg-white rounded-md border shadow-lg sm:p-10 p-5 max-w-[800px] m-auto">
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
            Register Here
          </h2>
          <p className="text-[14px] text-[#ACACAC] mb-[25px] mt-1">
            Enter your information
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
              <div className="mb-4">
                <label className="text-[14px]" htmlFor="name">
                  First Name
                </label>
                <input
                  placeholder="Enter first name"
                  className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-[14px]" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  placeholder="Enter last name"
                  className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
                  type="text"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
              <div className="mb-4">
                <label className="text-[14px]" htmlFor="email">
                  Email Address
                </label>
                <input
                  placeholder="Enter email address"
                  className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-[14px]" htmlFor="contact">
                  Contact Number
                </label>
                <input
                  placeholder="Enter contact number"
                  className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      e.key !== "Tab" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  id="contact"
                  minLength={11}
                  maxLength={11}
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[14px]" htmlFor="company">
                Company Name
              </label>
              <input
                placeholder="Enter company name"
                className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
                type="text"
                id="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-[14px]" htmlFor="address">
                Company Address
              </label>
              <input
                placeholder="Enter company address"
                className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
                type="text"
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
              <div className="mb-4">
                <label className="text-[14px]" htmlFor="password">
                  Create Password
                </label>
                <input
                  placeholder="Enter password"
                  className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-[14px]" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  placeholder="Enter password again"
                  className="border text-[14px] py-3 px-[10px] w-full bg-[#EAF2FE] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300  mt-2"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {errorMessages.length > 0 && (
              <div className="text-red-600 text-sm mb-2 -mt-1">
                <ol className="list-disc">
                  {errorMessages.map((message, index) => (
                    <li key={index} className="block">
                      {message}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="flex items-start">
              <input
                className="mr-2 mt-1"
                type="checkbox"
                id="terms"
                onChange={handleTermsChange}
              />
              <label className="text-[14px] text-[#131226]" htmlFor="terms">
                By clicking &quot;Register&quot;, you confirm that you agree to
                Copa Business{" "}
                <Link
                  className="text-[#307EF3] font-bold"
                  href={"/terms-and-conditions"}
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  className="text-[#307EF3] font-bold"
                  href={"/privacy-policy"}
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            <input
              className={`text-[14px] font-[500] py-2 rounded w-full cursor-pointer transition-all duration-300 mt-4 text-white ${
                isTermsChecked
                  ? "bg-[#307EF3]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              type="submit"
              value={isSubmitting ? "Registering..." : "Register"}
              disabled={!isTermsChecked}
            />
            <p className="text-[14px] text-[#9B9B9B] mt-4 tracking-wide">
              Already have an account?{" "}
              <Link className="text-[#307EF3]" href="/auth/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};
