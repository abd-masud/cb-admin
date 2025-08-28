"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Modal } from "antd";
import { User } from "next-auth";
import Image from "next/image";
import warning from "../../../public/images/warning.webp";
import { signOut } from "next-auth/react";
import { FaRightFromBracket } from "react-icons/fa6";
import { useAuth } from "@/contexts/AuthContext";

export default function CompanyCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [modalsShown, setModalsShown] = useState({
    profileModal: false,
    inactiveModal: false,
  });

  useEffect(() => {
    const excludedPaths = [
      "/",
      "/privacy-policy",
      "/terms-and-conditions",
      "/login",
      "/auth/login",
    ];

    if (excludedPaths.includes(pathname)) {
      return;
    }

    if (
      !modalsShown.inactiveModal &&
      user &&
      user?.role?.toLowerCase() !== "admin" &&
      user?.status?.toLowerCase() == "inactive"
    ) {
      setShowInactiveModal(true);
      setModalsShown((prev) => ({ ...prev, inactiveModal: true }));
      return;
    }

    if (!modalsShown.profileModal && user?.role.toLowerCase() == "admin") {
      const requiredFields: (keyof User)[] = [
        "contact",
        "company",
        "logo",
        "address",
      ];
      const isMissingField = requiredFields.some((field) => !user[field]);

      if (isMissingField) {
        setShowModal(true);
        setModalsShown((prev) => ({ ...prev, profileModal: true }));
      }
    }
  }, [user, pathname, modalsShown]);

  return (
    <>
      {children}
      <Modal open={showModal} footer={null} closable={false}>
        <div className="py-4 px-2">
          <div className="flex justify-center">
            <Image
              height={150}
              width={150}
              src={warning}
              alt={"Warning"}
            ></Image>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">
            Profile Information Required
          </h2>
          <p className="text-center">
            Please set up your profile information continue using the platform.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Set Up Later
            </button>
            <button
              onClick={() => {
                router.push("/profile");
                setShowModal(false);
              }}
              className="text-[14px] font-[500] py-2 px-3 rounded cursor-pointer transition-all duration-300 text-white bg-[#307EF3] hover:bg-[#478cf3] focus:bg-[#307EF3]"
            >
              Set Up Profile
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={showInactiveModal} footer={null} closable={false}>
        <div className="py-4 px-2">
          <div className="flex justify-center">
            <Image
              height={150}
              width={150}
              src={warning}
              alt={"Warning"}
            ></Image>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">
            Account Inactive
          </h2>
          <p className="text-center">
            Your account is currently inactive. Please contact your admin.
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={async () => {
                setShowInactiveModal(false);
                localStorage.removeItem("cb_user");
                localStorage.removeItem("userEmail");
                await signOut({
                  redirect: false,
                  callbackUrl: "/auth/login",
                });
                router.push("/auth/login");
              }}
              className="flex items-center bg-red-500 text-white hover:bg-red-600 cursor-pointer transition-all duration-300  py-2 px-5 rounded-md ml-3 font-[500]"
            >
              <FaRightFromBracket className="mr-2" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
