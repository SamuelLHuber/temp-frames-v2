import { AuthKitProvider, SignInButton, StatusAPIResponse } from "@farcaster/auth-kit";
import { ClientOnly } from "remix-utils/client-only";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "./Button";
import "@farcaster/auth-kit/styles.css";
import { useCallback } from "react";
import { farcasterConfig } from "~/lib/farcaster-strategy";
import { FarcasterUser } from "~/lib/auth.server";


export function LoginButton(props: { user: FarcasterUser | null; error: string | null; }) {
  const { user, error, } = props;
  const navigate = useNavigate();

  const handleSuccess = useCallback((res: StatusAPIResponse) => {
    if (!res.message) throw new Error("message is required");
    if (!res.signature) throw new Error("signature is required");
    if (!res.nonce) throw new Error("nonce is required");

    const params = new URLSearchParams();
    params.append("message", res.message);
    params.append("signature", res.signature);
    params.append("nonce", res.nonce);
    res.username && params.append("username", res.username);
    res.pfpUrl && params.append("pfpUrl", res.pfpUrl);

    navigate(`/auth/farcaster?${params}`, {
      replace: true,
    });
  }, []);

  return (
    <section className="flex flex-col items-center w-full">
      {error && (
        <div className="mb-8 text-red-500">
          {error}
        </div>
      )}

      {user ? (
        <Button
          className="no-underline relative w-full sm:w-[250px] text-white/80 hover:text-white/100 border-black active:translate-y-[2px] bg-slate-800/80 hover:bg-slate-800 transition-all duration-100"
        >
          <Link to="/list-product" className="w-full">
            Start Selling 
          </Link>
        </Button>
      ) : (
        <>
          <div>
            <ClientOnly>
              {() => {
                return (
                  <AuthKitProvider config={farcasterConfig}>
                    <SignInButton onSuccess={handleSuccess} />
                  </AuthKitProvider>
                );
              }}
            </ClientOnly>
          </div>
        </>
      )}
    </section>
  );
}