import type { NextAuthOptions } from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
      // The provider doesn't default to more than "openid" on its own —
      // without an explicit scope, Cognito returns no email/name claims
      // and session.user.email/.name (header, ConfirmationScreen) come
      // back empty.
      authorization: { params: { scope: "openid email profile" } },
      // Cognito always embeds a nonce claim in the ID tokens it issues,
      // even though this provider never sends a nonce in the authorize
      // request — NextAuth's default nonce check then fails with
      // "expected undefined, got: <value>". State-only CSRF protection
      // is still enforced; this only drops the mismatched nonce check.
      checks: ["state"],
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
}
