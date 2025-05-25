import NextAuth, { NextAuthConfig, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Client-side authentication example:
 * const { data: session } = useSession();
 * const authenticatedUser = authenticate(session);
 * const loggedIn = authenticatedUser !== false;
 * 
 * Server-side authentication example:
 * const session = await auth();
 * const authenticatedUser = authenticate(session);
 * const loggedIn = authenticatedUser !== false;
 */

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

export type AuthenticatedUser = {
    name: string;
    email: string;
}

export function authenticate(session: Session | null): AuthenticatedUser | false {
    if (!session) return false;
    if (!session.user) return false;
    if (!session.user.name) return false;
    if (!session.user.email) return false;
    if (!session.user.email.endsWith("dons.usfca.edu")) return false;

    return session.user as AuthenticatedUser;
}

export function getUsername(authenticatedUser: AuthenticatedUser): string {
    return authenticatedUser.email.split("@")[0];
}
