"use client";

import {
  Table,
  TableColumnsType,
  Input,
  //  Button, Tooltip, Modal
} from "antd";
import React, { useState, useMemo } from "react";
import { Users, UsersTableProps } from "@/types/users";
// import { FaEdit } from "react-icons/fa";
// import { MdOutlineDeleteSweep } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import styled from "styled-components";
import Image from "next/image";

export const UsersListTable: React.FC<UsersTableProps> = ({
  users,
  // fetchUsers,
  loading,
}) => {
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [currentUser, setCurrentUser] = useState<Users | null>(null);
  // const [userToDelete, setUserToDelete] = useState<Users | null>(null);
  const [searchText, setSearchText] = useState("");
  // const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const StyledTable = styled(Table)`
    .ant-table-thead > tr:nth-child(1) > th {
      background-color: #478cf3;
      color: white;
    }
    .ant-table-thead > tr:nth-child(2) > th {
      background-color: #6aa2f5;
      color: white;
    }
  `;

  // const showEditModal = (user: Users) => {
  //   setCurrentUser(user);
  //   setIsEditModalOpen(true);
  // };

  // const showDeleteModal = (user: Users) => {
  //   setUserToDelete(user);
  //   setDeleteConfirmationText("");
  //   setIsDeleteModalOpen(true);
  // };

  const filteredUsers = useMemo(() => {
    const sortedUsers = [...users].sort((a, b) => {
      return b.id - a.id;
    });
    if (!searchText) return sortedUsers;

    return sortedUsers.filter((user) =>
      Object.values(user).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [users, searchText]);

  // const handleEditSubmit = async (updatedUser: Users) => {
  //   try {
  //     const response = await fetch("/api/users", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedUser),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update user");
  //     }

  //     setUserMessage("User updated");
  //     setIsEditModalOpen(false);
  //     fetchUsers();
  //   } catch (err) {
  //     console.error(err);
  //     throw err;
  //   } finally {
  //     setTimeout(() => setUserMessage(null), 5000);
  //   }
  // };

  // const handleDelete = async () => {
  //   if (!userToDelete) return;

  //   try {
  //     const response = await fetch("/api/users", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id: userToDelete.id }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to delete user");
  //     }

  //     setUserMessage("User deleted");
  //     setIsDeleteModalOpen(false);
  //     setDeleteConfirmationText("");
  //     fetchUsers();
  //   } catch {
  //     setUserMessage("Delete failed");
  //   } finally {
  //     setTimeout(() => setUserMessage(null), 5000);
  //   }
  // };

  const columns: TableColumnsType<Users> = [
    {
      title: "#",
      width: "40px",
      render: (_, __, index) => index + 1,
    },
    // {
    //   title: "User ID",
    //   dataIndex: "user_id",
    // },
    {
      title: "Image",
      dataIndex: "image",
      render: (src: string) =>
        src ? (
          <Image
            src={src}
            alt="User Image"
            width={40}
            height={40}
            className="rounded object-cover"
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: "User Name",
      dataIndex: "name",
    },
    {
      title: "Email Address",
      dataIndex: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contact",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Logo",
      dataIndex: "logo",
      render: (src: string) =>
        src ? (
          <Image
            src={src}
            alt="Company Logo"
            width={50}
            height={30}
            className="object-contain"
          />
        ) : (
          <span>No Logo</span>
        ),
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Action",
      render: () => (
        // _, record
        <div className="flex justify-center items-center gap-2">
          {/* <Tooltip title="Edit">
            <button
              className="text-white text-[14px] bg-blue-500 hover:bg-blue-600 h-6 w-6 rounded transition-colors duration-300 flex justify-center items-center"
              onClick={() => showEditModal(record)}
            >
              <FaEdit />
            </button>
          </Tooltip> */}
          {/* <Tooltip title="Invoice">
            <Link
              className="text-white hover:text-white text-[16px] bg-green-600 hover:bg-green-700 h-6 w-6 rounded transition-colors duration-300 flex justify-center items-center"
              href={`/invoices/user-invoices/${record.id}`}
            >
              <PiInvoiceBold />
            </Link>
          </Tooltip>
          <Tooltip title="Quote">
            <Link
              className="text-white hover:text-white text-[15px] bg-yellow-500 hover:bg-yellow-600 h-6 w-6 rounded transition-colors duration-300 flex justify-center items-center"
              href={`/quotes/user-quotes/${record.id}`}
            >
              <LiaFileInvoiceDollarSolid />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              className="text-white text-[17px] bg-red-500 hover:bg-red-600 h-6 w-6 rounded transition-colors duration-300 flex justify-center items-center"
              onClick={() => showDeleteModal(record)}
            >
              <MdOutlineDeleteSweep />
            </button>
          </Tooltip> */}
        </div>
      ),
    },
  ];

  const handleCloseMessage = () => {
    setUserMessage(null);
  };

  return (
    <main className="bg-white p-5 mt-6 rounded-lg border shadow-md">
      {userMessage && (
        <div className="left-1/2 top-10 transform -translate-x-1/2 fixed z-50">
          <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800 text-green-600 border-2 border-green-600 mx-auto">
            <div className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {userMessage}
            </div>
            <button
              onClick={handleCloseMessage}
              className="ml-3 focus:outline-none hover:text-green-600"
            >
              <FaXmark className="text-[14px]" />
            </button>
          </div>
        </div>
      )}
      <div className="flex sm:justify-between justify-end items-center mb-5">
        <div className="sm:flex items-center hidden">
          <div className="h-2 w-2 bg-[#307EF3] rounded-full mr-2"></div>
          <h2 className="text-[13px] font-[500]">Users Info</h2>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Input
            type="text"
            placeholder="Search..."
            className="border text-[14px] sm:w-40 w-32 py-1 px-[10px] bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <StyledTable<any>
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        bordered
        rowKey="id"
      />
      {/* <Modal
        title="Confirm Delete User"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleDelete}
            disabled={deleteConfirmationText !== "DELETE"}
          >
            Delete User
          </Button>,
        ]}
        destroyOnClose
      >
        <div className="space-y-4">
          <p>
            To confirm, type{" "}
            <span className="font-bold">&quot;DELETE&quot;</span> in the box
            below
          </p>
          <input
            placeholder="DELETE"
            className="border text-[14px] py-3 px-[10px] w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md transition-all duration-300 mt-2"
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
          />
          <p className="text-red-500 text-[12px] font-bold">
            Warning: This action will permanently delete the user record.
          </p>
        </div>
      </Modal> */}
    </main>
  );
};
