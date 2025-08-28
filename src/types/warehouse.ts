export interface Warehouse {
    key: string;
    id: number;
    warehouse_id: string;
    warehouse: string;
    address: string;
}

export type WarehouseApiResponse = {
    success: boolean;
    data: Warehouse[];
    message?: string;
};

export interface WarehouseTableProps {
    warehouse: Warehouse[];
    loading: boolean;
    fetchWarehouse: () => void;
}

export interface EditWarehouseModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentWarehouse: Warehouse | null;
    onSave: (updatedWarehouse: Warehouse) => Promise<void>;
}

export interface WarehouseReportButtonProps {
    warehouse: Warehouse[];
}
