export type Permissions = {
    id: string;
    name: string;
};

export type ModulePermission = {
    id: string;
    name: string;
    canView: boolean;
};

export type PermissionResponse = {
    role: string;
    allowedModules: string[];
};