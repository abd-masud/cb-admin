export interface Cabinet {
    key: string;
    id: number;
    warehouse_id: string;
    cabinet_id: string;
    cabinet: string;
}

export type CabinetApiResponse = {
    success: boolean;
    data: Cabinet[];
    message?: string;
};

export interface CabinetTableProps {
    cabinet: Cabinet[];
    loading: boolean;
    fetchCabinet: () => void;
}

export interface EditCabinetModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentCabinet: Cabinet | null;
    onSave: (updatedCabinet: Cabinet) => Promise<void>;
}

export interface CabinetReportButtonProps {
    cabinet: Cabinet[];
}
