import "next-auth";

// Extend default NextAuth types
declare module "next-auth" {
    // Augment the Session object with custom user fields
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            last_name?: string | null;
            email?: string | null;
            contact?: string | null;
            company?: string | null;
            logo?: string | null;
            address?: string | null;
            role?: string | null;
            image?: string | null;
            accessToken?: string | null;
        };
    }

    // Extend the User type used in NextAuth callbacks
    interface User {
        id?: string;
        name?: string | null;
        last_name?: string | null;
        email?: string | null;
        contact?: string | null;
        company?: string | null;
        logo?: string | null;
        address?: string | null;
        role?: string | null;
        image?: string | null;
    }

    // Extend JWT structure to persist custom user fields in the token
    declare module "next-auth/jwt" {
        interface JWT {
            id: string;
            name: string;
            last_name?: string;
            email: string;
            contact?: string;
            company?: string;
            logo?: string;
            address?: string;
            role?: string;
            image?: string;
            accessToken?: string;
        }
    }
}
