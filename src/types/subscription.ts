export interface Subscription {
    name: string;
    price: number;
    duration: string;
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
    savings?: string;
}
