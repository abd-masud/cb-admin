import { Customers } from "./customers";
import { Products } from "./products";

export type QuoteItem = {
    id: number;
    product_id: string;
    product: string;
    quantity: string;
    unit_price: string;
    unit: string;
    amount: string;
};

export type QuoteData = {
    id: number;
    customer: Customers;
    items: QuoteItem[];
    quote_id: string;
    date: string;
    subtotal: string;
    tax: string;
    discount: string;
    total: string;
    notes: string;
    user_id?: string;
};

export interface QuoteApiResponse {
    success: boolean;
    data: QuoteData[];
    message?: string;
}

export interface QuotesTableProps {
    quotes: QuoteData[];
    fetchQuotes: () => void;
    loading: boolean;
}

export interface EditQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentQuote: QuoteData | null;
    onSave: (updatedQuote: QuoteData) => Promise<void>;
}

export interface QuotesReportButtonProps {
    quotes: QuoteData[];
}

export interface QuotesItemProps {
    QuoteId: number;
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

export interface CustomerQuotesListProps {
    CustomerId: number;
}