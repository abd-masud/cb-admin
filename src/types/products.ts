import { Suppliers } from "./suppliers";

type ProductAttribute = {
    name: string;
    value: string;
};

export type Products = {
    cabinet_id: any;
    warehouse_id: any;
    key: string;
    id: number;
    product_id: string;
    type: string;
    sku_id: string;
    name: string;
    supplier: Suppliers;
    attribute: ProductAttribute[];
    description: string;
    buying_price: string;
    price: string;
    category: string;
    stock: string;
    unit: string;
};

export type SupplierOption = {
    value: number;
    label: string;
    supplier: Suppliers;
};

export interface ProductApiResponse {
    success: boolean;
    data: Products[];
    message?: string;
}

export interface ProductsTableProps {
    products: Products[];
    fetchProducts: () => void;
    loading: boolean;
}

export interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProduct: Products | null;
    onSave: (updatedProduct: Products) => Promise<void>;
}

export interface ProductsReportButtonProps {
    products: Products[];
}

