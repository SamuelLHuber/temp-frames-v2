import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userId?: string;
};

type SessionFlashData = {
  error?: string;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60, // 1 hour
    path: "/",
    sameSite: "lax",
    secrets: ["your-secret-key"], // Replace with your actual secret key
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  },
});

export { getSession, commitSession, destroySession };