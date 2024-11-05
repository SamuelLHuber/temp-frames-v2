import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { authenticator, FarcasterUser } from "~/lib/auth.server";
import { Navbar } from "./components/NavBar";

import "./tailwind.css";
import { fromFarcasterTime, validateFrameSignature } from "./lib/farcaster";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const signedmessagebytes = (new URL(request.url).searchParams.get('signedmessagebytes'));
  const action: boolean = (new URL(request.url).searchParams.get("action")) ? true: false;
  let user: FarcasterUser | null;
  if(signedmessagebytes) {
    // if signedmessagebytes we assume it's form an action and validate for
    // timestamp being recent -> less likelyhood of replay attacks
    // signature being valid -> user proves they are who they claim to be
    const { isValid, message } = await validateFrameSignature(signedmessagebytes);
    if(isValid) {
      const actionTimestamp = fromFarcasterTime(message.data.timestamp);
      // Farcaster timestamp is seconds since Farcaster epoch, while Date.now is milliseconds since Unix epoch
      // Farcaster Epoch is Jan 1, 2021 00:00:00 UTC (unix timestamp: 1609455600) -> https://docs.farcaster.xyz/learn/what-is-farcaster/messages#timestamps
      if ((actionTimestamp + (1000 * 60 * 5)) < Date.now().valueOf()) {
        // don't allow messages older than 5 minutes, .valueOf() for UTC
        console.error('actionTimestamp too old. Unix Action Timestamp:', actionTimestamp, 'Now:', Date.now().valueOf())
        user = null;
      } else {
        user = {
          fid: message.data.fid
        }
      }
    } else {
      user = null
    }
  } else {
  // server side lookup to validate authentication status and get the user object we need for the frontend
    user = await authenticator.isAuthenticated(request);
  }
  return { action, user };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { action, user } = useLoaderData<typeof loader>();
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {action ? null : <Navbar user={user} />}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
