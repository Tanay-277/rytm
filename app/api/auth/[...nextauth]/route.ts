import { prisma } from "@/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AuthOptions } from "next-auth";

const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: "openid email profile",
					prompt: "select_account",
				},
			},
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name || profile.given_name || profile.email?.split('@')[0] || 'Unknown User',
					email: profile.email,
					image: profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || profile.email || 'User')}&background=0D8ABC&color=fff`,
				};
			},
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
		async signIn({ user, account }) {
			// console.log("SignIn attempt:", {
			// 	userEmail: user.email,
			// 	userName: user.name,
			// 	userImage: user.image,
			// 	provider: account?.provider,
			// });

			// Only require email - provide fallbacks for missing fields
			if (!user.email) {
				console.log("SignIn blocked: missing email");
				return false;
			}

			// Provide fallbacks for missing fields
			if (!user.name) {
				user.name = user.email.split('@')[0] || 'Unknown User';
				console.log("Using fallback name:", user.name);
			}

			if (!user.image) {
				user.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`;
				console.log("Using fallback image:", user.image);
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

			console.log("SignIn successful for:", user.email);
			return true;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
