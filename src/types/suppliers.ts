export interface Suppliers {
    key: string;
    id: number;
    supplier_id: string;
    company: string;
    owner: string;
    address: string;
    email: string;
    contact: string;
    products: string;
}

export type SupplierApiResponse = {
    success: boolean;
    data: Suppliers[];
    message?: string;
};

export interface SuppliersTableProps {
    suppliers: Suppliers[];
    loading: boolean;
    fetchSuppliers: () => void;
}

export interface EditSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSupplier: Suppliers | null;
    onSave: (updatedSupplier: Suppliers) => Promise<void>;
}

export interface SuppliersReportButtonProps {
    suppliers: Suppliers[];
}
