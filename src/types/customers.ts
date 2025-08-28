export interface Customers {
    key: string;
    id: number;
    customer_id: string;
    name: string;
    delivery: string;
    email: string;
    contact: string;
    status: string;
}

export type CustomerApiResponse = {
    success: boolean;
    data: Customers[];
    message?: string;
};

export interface CustomersTableProps {
    customers: Customers[];
    loading: boolean;
    fetchCustomers: () => void;
}

export interface EditCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentCustomer: Customers | null;
    onSave: (updatedCustomer: Customers) => Promise<void>;
}

export interface CustomersReportButtonProps {
    customers: Customers[];
}
