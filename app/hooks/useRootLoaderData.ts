import { useMatches } from "@remix-run/react";
import type { FarcasterUser } from "~/lib/auth.server";

export function useRootLoaderData() {
  const matches = useMatches();
  const root = matches.find((route) => route.id === "root");
  return root?.data as { action: boolean; user: FarcasterUser | null};
} 