export interface Store {
    key: string;
    id: number;
    store_id: string;
    store: string;
    address: string;
}

export type StoreApiResponse = {
    success: boolean;
    data: Store[];
    message?: string;
};

export interface StoreTableProps {
    store: Store[];
    loading: boolean;
    fetchStore: () => void;
}

export interface EditStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStore: Store | null;
    onSave: (updatedStore: Store) => Promise<void>;
}

export interface StoreReportButtonProps {
    store: Store[];
}
