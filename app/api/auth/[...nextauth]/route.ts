import { prisma } from "@/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),
	],
	secret: process.env.NEXTAUTH_SECRET || "secret",
	pages: {
		signIn: "/sign-in",
		error: "/error",
	},
	callbacks: {
		async signIn(params) {
			if (!params.user.email || !params.user.name || !params.user.image) {
				console.log("Unauthenticated");
				return false;
			}
			try {
				await prisma.user.upsert({
					where: { email: params.user.email },
					update: {
						provider: "GOOGLE",
					},
					create: {
						email: params.user.email,
						provider: "GOOGLE",
						username: params.user.name,
						cover: params.user.image
					},
				});
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
	},
});

export { handler as GET, handler as POST };
