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
	pages: {
		signIn: "/sign-in",
		error: "/error",
	},
	callbacks: {
		async signIn(params) {
			if (!params.user.email || !params.user.name) {
				console.log("Unauthenticated");
				return false;
			}
			try {
				await prisma.user.create({
					data: {
						email: params.user.email,
						provider: "GOOGLE",
						username: params.user.name,
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
