import { Customers } from "./customers";
import { Products } from "./products";

export type InvoiceItem = {
    id: number;
    product_id: string;
    product: string;
    quantity: string | number;
    unit_price: string;
    unit: string;
    amount: string;
};

export type PaymentEntry = {
    id?: number;
    paid_amount: string;
    due_amount: string;
    date: string;
};

export type InvoiceData = {
    id: number;
    customer: string | Customers;
    items: string | InvoiceItem[];
    invoice_id: string;
    date: string;
    due_date: string;
    subtotal: string;
    tax: string;
    discount: string;
    total: string;
    paid_amount: string;
    due_amount: string;
    pay_type: string;
    notes: string;
    sub_invoice?: PaymentEntry[];
    user_id?: number;
};

export interface InvoiceApiResponse {
    success: boolean;
    data: InvoiceData[];
    message?: string;
}

export interface InvoicesTableProps {
    invoices: InvoiceData[];
    fetchInvoices: () => void;
    loading: boolean;
}

export interface EditInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentInvoice: InvoiceData | null;
    onSave: (updatedInvoice: InvoiceData) => Promise<void>;
}

export interface InvoicesReportButtonProps {
    invoices: InvoiceData[];
}

export interface InvoicesItemProps {
    InvoiceId: number;
}

export type CustomerOption = {
    value: number;
    label: string;
    customer: Customers;
};

export type ProductOption = {
    value: number;
    label: string;
    product: Products;
};

export interface CustomerInvoicesListProps {
    CustomerId: number;
}

export interface PartialInvoicesItemProps {
    InvoiceId: number;
}

export interface SubInvoice {
    id?: number;
    date: string;
    paid_amount: string;
    due_amount: string;
}

export interface FlattenedInvoice {
    id: number;
    invoice_id: string;
    customer: {
        name: string;
    };
    sub_invoice?: SubInvoice[];
    sub_item?: SubInvoice | null;
}

export interface PartialInvoicesTableProps {
    invoices: Array<{
        id: number;
        invoice_id: string;
        customer: {
            name: string;
        };
        sub_invoice?: SubInvoice[];
    }>;
    loading: boolean;
    fetchInvoices: () => Promise<void>;
}
