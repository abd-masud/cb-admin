"use client";

import { useAuth } from "@/contexts/AuthContext";
import { TermsItem } from "@/types/terms";
import { Modal, Tooltip } from "antd";
import { useState, useEffect, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdOutlineDeleteSweep } from "react-icons/md";

export const TermsSettingsForm = () => {
  const { user } = useAuth();
  const [terms, setTerms] = useState<TermsItem[]>([]);
  const [newTerm, setNewTerm] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTermValue, setEditTermValue] = useState("");
  const MAX_TERMS = 5;

  const fetchPolicyTerms = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/terms?user_id=${user.id}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const termsData = result.data?.terms || [];
          const formattedTerms = termsData
            .map((term: string | TermsItem) =>
              typeof term == "string" ? { name: term } : term
            )
            .slice(0, MAX_TERMS);
          setTerms(formattedTerms);
        }
      } else {
        console.error("Failed to fetch terms:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching terms terms:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchPolicyTerms();
    }
  }, [user?.id, fetchPolicyTerms]);

  const handleSave = async (termsToSave: TermsItem[]) => {
    if (!user?.id) return false;
    setIsLoading(true);
    try {
      const response = await fetch("/api/terms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          user_id: user.id.toString(),
        },
        body: JSON.stringify({
          user_id: user.id,
          terms: termsToSave.map((item) => item.name),
        }),
      });

      if (!response.ok) throw new Error(await response.text());

      await fetchPolicyTerms();
      return true;
    } catch (error) {
      console.error("Error saving terms terms:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTerm = async () => {
    if (!newTerm.trim()) return;

    if (terms.length >= MAX_TERMS) {
      setUserMessage(`Maximum ${MAX_TERMS} terms allowed`);
      setTimeout(() => setUserMessage(null), 5000);
      return;
    }

    const newItem = { name: newTerm.trim() };
    const updatedTerms = [...terms, newItem];

    const success = await handleSave(updatedTerms);
    if (success) {
      setTerms(updatedTerms);
      setNewTerm("");
      setUserMessage("Term added");
      setTimeout(() => setUserMessage(null), 5000);
    }
  };

  const handleEditTerm = (index: number) => {
    setEditingIndex(index);
    setEditTermValue(terms[index].name);
    setIsEditModalOpen(true);
  };

  const handleUpdateTerm = async () => {
    if (editingIndex == null || !editTermValue.trim()) return;

    const updatedTerms = [...terms];
    updatedTerms[editingIndex] = { name: editTermValue.trim() };

    const success = await handleSave(updatedTerms);
    if (success) {
      setTerms(updatedTerms);
      setEditingIndex(null);
      setEditTermValue("");
      setIsEditModalOpen(false);
      setUserMessage("Term updated");
      setTimeout(() => setUserMessage(null), 5000);
    }
  };

  const handleDeleteTerm = async () => {
    if (itemToDeleteIndex == null) return;

    const updatedTerms = terms.filter(
      (_, index) => index !== itemToDeleteIndex
    );

    const success = await handleSave(updatedTerms);
    if (success) {
      setTerms(updatedTerms);
      setIsDeleteModalOpen(false);
      setItemToDeleteIndex(null);
      setUserMessage("Term deleted");
      setTimeout(() => setUserMessage(null), 5000);
    }
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
              onClick={() => setUserMessage(null)}
              className="ml-3 hover:text-green-400"
            >
              <FaXmark className="text-[14px]" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center pb-5">
        <div className="h-2 w-2 bg-[#307EF3] rounded-full mr-2"></div>
        <h2 className="text-[13px] font-[500]">Terms & Conditions Settings</h2>
      </div>

      <div className="mb-4">
        <label className="text-[14px]" htmlFor="term">
          Terms & Conditions{" "}
          {terms.length > 0 && (
            <span className="text-gray-500 text-xs">
              ({terms.length}/{MAX_TERMS})
            </span>
          )}
        </label>
        <div className="flex items-center gap-2 mb-4 mt-2">
          <input
            type="text"
            id="term"
            maxLength={100}
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            placeholder={
              terms.length >= MAX_TERMS && editingIndex == null
                ? "Maximum terms reached"
                : editingIndex !== null
                ? "Update term"
                : "Add new term"
            }
            className="border text-[14px] py-2 px-4 w-full flex-1 bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md"
            disabled={
              isLoading || (terms.length >= MAX_TERMS && editingIndex == null)
            }
          />
          {editingIndex !== null ? (
            <>
              <button
                onClick={handleUpdateTerm}
                className="bg-[#307EF3] hover:bg-[#478cf3] text-white px-4 py-[9px] rounded text-sm"
                disabled={isLoading}
              >
                Update
              </button>
              <button
                onClick={() => {
                  setEditingIndex(null);
                  setNewTerm("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-[9px] rounded text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAddTerm}
              className="bg-[#307EF3] hover:bg-[#478cf3] text-white px-4 py-[9px] rounded text-sm"
              disabled={
                isLoading || !newTerm.trim() || terms.length >= MAX_TERMS
              }
            >
              Add
            </button>
          )}
        </div>

        <div className="border rounded-md overflow-hidden">
          {terms.length == 0 ? (
            <div className="p-4 text-center text-gray-500">
              No terms added yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {terms.map((item, index) => (
                <li
                  key={index}
                  className="p-3 flex justify-between items-center"
                >
                  <span>{item.name}</span>
                  <div className="flex gap-2">
                    <Tooltip title="Edit">
                      <button
                        onClick={() => handleEditTerm(index)}
                        className="text-white text-[14px] bg-blue-500 hover:bg-blue-600 h-6 w-6 rounded flex justify-center items-center"
                        disabled={isLoading}
                      >
                        <FaEdit />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <button
                        onClick={() => {
                          setItemToDeleteIndex(index);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-white text-[17px] bg-red-500 hover:bg-red-600 h-6 w-6 rounded flex justify-center items-center"
                        disabled={isLoading}
                      >
                        <MdOutlineDeleteSweep />
                      </button>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal
        title="Confirm Delete Term"
        open={isDeleteModalOpen}
        onOk={handleDeleteTerm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setItemToDeleteIndex(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={isLoading}
      >
        <p>Are you sure you want to delete this term?</p>
      </Modal>

      <Modal
        title="Edit Term"
        open={isEditModalOpen}
        onOk={handleUpdateTerm}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingIndex(null);
          setEditTermValue("");
        }}
        okText="Update"
        confirmLoading={isLoading}
      >
        <input
          type="text"
          maxLength={100}
          value={editTermValue}
          onChange={(e) => setEditTermValue(e.target.value)}
          className="border text-[14px] py-2 px-4 w-full bg-[#F2F4F7] hover:border-[#B9C1CC] focus:outline-none focus:border-[#B9C1CC] rounded-md"
          placeholder="Update term"
        />
      </Modal>
    </main>
  );
};
