export interface Employees {
    key?: string;
    id: number;
    employee_id: string;
    name: string;
    email: string;
    contact: string;
    department: string;
    role: string;
    status: string;
    password?: string;
}

export type EmployeeApiResponse = {
    success: boolean;
    data: Employees[];
    message?: string;
};

export interface EmployeesTableProps {
    employees: Employees[];
    loading: boolean;
    fetchEmployees: () => void;
}

export interface EditEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmployee: Employees | null;
    onSave: (updatedEmployee: Employees) => Promise<void>;
}

export interface EmployeesReportButtonProps {
    employees: Employees[];
}
