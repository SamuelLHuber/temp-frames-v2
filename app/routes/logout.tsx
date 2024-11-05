import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/lib/auth.server";

export const loader: LoaderFunction = async () => {
  // Redirect GET requests to home
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/" });
  return redirect("/");
};

export default function LogoutRoute() {
  return <div>Logging out...</div>;
}
