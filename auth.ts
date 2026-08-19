import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID;
const sharePointResource = (process.env.NEXT_PUBLIC_SHAREPOINT_RESOURCE ?? "https://nubiaville.sharepoint.com").replace(/\/+$/, "");

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    if (!tenantId || !process.env.AUTH_MICROSOFT_ENTRA_ID_ID || !process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET) {
      return { ...token, authError: "Configuration" };
    }

    const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
        client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
        grant_type: "refresh_token",
        refresh_token: String(token.refreshToken ?? ""),
      }),
    });

    const refreshed = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
      refresh_token?: string;
    };

    if (!response.ok || !refreshed.access_token) throw new Error("Microsoft token refresh failed.");

    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + Number(refreshed.expires_in ?? 3600) * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      authError: undefined,
    };
  } catch {
    return { ...token, authError: "RefreshAccessTokenError" };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      authorization: {
        params: {
          scope: `openid profile email offline_access ${sharePointResource}/AllSites.Read ${sharePointResource}/AllSites.Write`,
        },
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: Number(account.expires_at ?? 0) * 1000,
          refreshToken: account.refresh_token,
        };
      }

      if (typeof token.accessTokenExpires === "number" && Date.now() < token.accessTokenExpires - 60_000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) session.user.email = (token.email as string) ?? session.user.email;
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.authError = typeof token.authError === "string" ? token.authError : undefined;
      return session;
    },
  },
});
