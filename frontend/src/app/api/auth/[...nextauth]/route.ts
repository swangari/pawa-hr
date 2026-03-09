import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SignJWT } from "jose";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          hd: "pawait.co.ke",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60, // 3 hours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email || (profile as any)?.email;
        if (!email) return false;

        const allowedDomain = "@pawait.co.ke";
        const isAllowed = email.toLowerCase().endsWith(allowedDomain);

        console.log(
          `[NextAuth] Sign-in attempt: ${email} - Domain restriction: ${allowedDomain} - Allowed: ${isAllowed}`,
        );

        return isAllowed;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    // Generate a signed JWT for the backend and expose it in the session
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id || token.sub;
        session.user.image = token.picture as string;

        const secretKey =
          process.env.NEXTAUTH_JWT_SECRET || process.env.NEXTAUTH_SECRET;

        if (secretKey) {
          try {
            const secret = new TextEncoder().encode(secretKey);
            const backendToken = await new SignJWT({
              id: (session.user as any).id,
              email: session.user.email,
              name: session.user.name,
              picture: session.user.image,
            })
              .setProtectedHeader({ alg: "HS256" })
              .setIssuedAt()
              .setExpirationTime("3h") // matches session length
              .sign(secret);

            // @ts-ignore
            session.accessToken = backendToken;
          } catch (e) {
            console.error("Error signing backend token:", e);
          }
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
