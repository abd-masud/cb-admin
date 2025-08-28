export interface SMTPSettings {
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: "none" | "ssl" | "tls";
    email: string;
    company: string;
}