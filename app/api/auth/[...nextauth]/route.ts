import { prisma } from "@/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"; // ✅ Correct package for NextAuth v4+
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/sign-in",
		error: "/error",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token) {
				session.user.id = token.id as string;
			}
			return session;
		},
		async signIn({ user, account, profile }) {
			if (!user.email || !user.name || !user.image) {
				console.log("SignIn blocked: missing fields");
				return false;
			}

			const existingUser = await prisma.user.findUnique({
				where: { email: user.email },
			});

			if (existingUser && account) {
				try {
					await prisma.account.upsert({
						where: {
							provider_providerAccountId: {
								provider: account.provider,
								providerAccountId: account.providerAccountId,
							},
						},
						update: {},
						create: {
							userId: existingUser.id,
							type: account.type,
							provider: account.provider,
							providerAccountId: account.providerAccountId,
							access_token: account.access_token,
							refresh_token: account.refresh_token,
							expires_at: account.expires_at,
							id_token: account.id_token,
							token_type: account.token_type,
							scope: account.scope,
							session_state: account.session_state,
						},
					});
				} catch (err) {
					console.error("Account upsert failed:", err);
					return false;
				}
			}

			return true;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
