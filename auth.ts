import NextAuth, { NextAuthConfig, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (typeof user.email !== "string") return false;
            if (!user.email.endsWith("dons.usfca.edu")) return false;

            return true;
        }
    },
    pages: {
        error: "/auth/error"
    }
} satisfies NextAuthConfig;

export const {
    handlers: { GET, POST },
    auth
} = NextAuth(authOptions);

type authenticatedUser = {
    name: string;
    email: string;
}

export function authenticate(session: Session | null): authenticatedUser | false {
    if (!session) return false;
    if (!session.user) return false;
    if (!session.user.name) return false;
    if (!session.user.email) return false;
    if (!session.user.email.endsWith("dons.usfca.edu")) return false;

    return session.user as authenticatedUser;
}

export function getUsername(authenticatedUser: authenticatedUser): string {
    return authenticatedUser.email.split("@")[0];
}
