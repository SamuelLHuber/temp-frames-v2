import { Authenticator } from "remix-auth";
import { createCookie, createCookieSessionStorage } from "@remix-run/node";
import { FarcasterStrategy } from "./farcaster-strategy";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    secrets: [process.env.SESSION_SECRET || "STRONG_SECRET"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const redirectCookie = createCookie("redirectTo", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60,
  secure: process.env.NODE_ENV === "production",
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export const authenticator = new Authenticator<FarcasterUser>(sessionStorage, {
  throwOnError: true,
});

export type FarcasterUser = {
  fid: string;
  username?: string;
  pfpUrl?: string;
};

authenticator.use(new FarcasterStrategy(verifyFarcasterUser));

export async function verifyFarcasterUser(args: FarcasterUser & { request: Request }) {
  const user: FarcasterUser = {
    fid: args.fid,
    username: args.username,
    pfpUrl: args.pfpUrl,
  }
  return user;
}