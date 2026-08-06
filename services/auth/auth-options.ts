import type { NextAuthOptions } from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"

import { prismaUserStore } from "@/services/user/prisma-user-store"

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
      // Cognito embeds a nonce claim in every ID token it issues. Omitting
      // "nonce" here does NOT skip the check — NextAuth only generates and
      // sends a nonce when it's listed (core/lib/oauth/checks.js), so leaving
      // it out makes openid-client compare the token's nonce against
      // `undefined` and fail with "nonce mismatch, expected undefined, got:
      // <value>". Listing it means we send one, Cognito echoes it, and the
      // two match — which also restores the replay protection a nonce is for.
      checks: ["state", "nonce"],
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Nothing else creates the User row, and assessments and blueprints both
    // have a foreign key to it. Sessions stay JWT-only (ADR-001) — this is a
    // write on sign-in, not a database session adapter.
    async signIn({ user }) {
      if (!user.id || !user.email) return false

      try {
        await prismaUserStore.upsertFromAuth({
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
        })
        return true
      } catch (error) {
        // Most likely a Cognito `sub` that changed under an existing email.
        // Failing the sign-in is recoverable by a human; merging accounts is
        // not. Tracked in reference/DATABASE_DECISIONS.md.
        console.error("Failed to upsert user on sign-in:", error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
}
