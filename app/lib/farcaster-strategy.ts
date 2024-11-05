import { FarcasterUser } from "./auth.server";
import { AuthenticateOptions, Strategy } from "remix-auth";
import { SessionStorage } from "@remix-run/node";
import { createAppClient, viemConnector } from "@farcaster/auth-kit";

export const farcasterConfig = {
  rpcUrl: `https://mainnet.optimism.io`,
  domain: process.env.PUBLIC_URL || "https://dtech.example.com",
  siweUri: `${new URL(
    process.env.PUBLIC_URL || "https://dtech.example.com"
  )}/login`,
};

export class FarcasterStrategy extends Strategy<
  FarcasterUser,
  FarcasterUser & { request: Request }
> {
  name = "farcaster";

  async authenticate(
    request: Request,
    sessionStorage: SessionStorage,
    options: AuthenticateOptions
  ): Promise<FarcasterUser> {
    const url = new URL(request.url);
    const credentials = Object.fromEntries(url.searchParams.entries());

    if (!credentials.message || !credentials.signature || !credentials.nonce) {
      return await this.failure(
        "Missing message, signature or nonce",
        request,
        sessionStorage,
        options
      );
    }

    const appClient = createAppClient({
      ethereum: viemConnector({
        rpcUrl: farcasterConfig.rpcUrl,
      }),
    });

    const verifyResponse = await appClient.verifySignInMessage({
      message: credentials.message,
      signature: credentials.signature as `0x${string}`,
      domain: farcasterConfig.domain,
      nonce: credentials.nonce,
    });
    // console.log("verifyResponse", JSON.stringify(verifyResponse, null, 2));
    const { success, fid, error } = verifyResponse;

    if (!success) {
      return await this.failure(
        "Invalid signature",
        request,
        sessionStorage,
        options,
        error
      );
    }

    let user;
    try {
      user = await this.verify({
        fid: fid.toString(),
        username: credentials.username,
        pfpUrl: credentials.pfpUrl,
        request,
      });
    } catch (err) {
      console.error(err);

      return await this.failure(
        (err as Error).message,
        request,
        sessionStorage,
        options
      );
    }

    return this.success(user, request, sessionStorage, options);
  }
}
