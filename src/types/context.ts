// Interface representing a user object
export interface User {
    status: string;
    id: number;
    name: string;
    last_name: string;
    email: string;
    contact: string;
    company: string;
    logo: string;
    address: string;
    role: string;
    image: string;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}