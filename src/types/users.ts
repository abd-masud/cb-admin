export interface Users {
    key: string;
    id: number;
    user_id: string;
    name: string;
    last_name: string;
    email: string;
    contact: string;
    company: string;
    logo: string;
    address: string;
    image: string;
    status: string;
}

export type UserApiResponse = {
    success: boolean;
    data: Users[];
    message?: string;
};

export interface UsersTableProps {
    users: Users[];
    loading: boolean;
    fetchUsers: () => void;
}

export interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: Users | null;
    onSave: (updatedUser: Users) => Promise<void>;
}

export interface UsersReportButtonProps {
    users: Users[];
}
