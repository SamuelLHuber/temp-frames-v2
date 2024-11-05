import type { MetaFunction } from "@remix-run/node";
import { useCallback } from "react";

export const loader = async () => {
  const actionUrl = encodeURIComponent(`${process.env.PUBLIC_URL}/action`);
  const deepLink = `https://warpcast.com/~/composer-action?url=${actionUrl}`;
  const imageUrl = `${process.env.PUBLIC_URL}/icon.png`;
  return {
    actionUrl,
    deepLink,
    imageUrl,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = "dTech Mini App";
  return [
    { title: title },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { rel: "manifest", href: "/manifest.json" },
    { name: "theme-color", content: "#7C65C1" },
    { name: "description", content: "Welcome to dTech.vision" },

    { property: "og:title", content: title },
    { property: "og:image", content: data?.imageUrl },
    { property: "fc:frame", content: "vNext" },
    { property: "fc:frame:image", content: data?.imageUrl },
    { property: "fc:frame:image:aspect_ratio", content: "1:1" },
    { property: "fc:frame:button:1", content: "Open App" },
    { property: "fc:frame:button:1:action", content: "link" },
    { property: "fc:frame:button:1:target", content: data?.deepLink },
  ];
};

export default function Index() {
  const generateId = () => crypto.randomUUID();

  const handleSendEth = useCallback(() => {
    window.parent.postMessage(
      {
        jsonrpc: "2.0",
        id: generateId(),
        method: "fc_requestWalletAction",
        params: {
          action: {
            method: "eth_sendTransaction",
            chainId: "eip155:1", // Ethereum mainnet
            params: {
              abi: [], // Empty ABI for simple ETH transfer
              to: "0x0000000000000000000000000000000000000000", // zero address, change this :)
              value: "1000000000000000000", // 1 ETH in wei
            },
          },
        },
      },
      "*"
    );
  }, []);

  const handleCreatePost = useCallback(() => {
    window.parent.postMessage(
      {
        jsonrpc: "2.0",
        id: generateId(),
        method: "fc_createCast",
        params: {
          text: "@samuellhuber made the best mini app template",
          embeds: [],
        },
      },
      "*"
    );
  }, []);

  return (
    <div className="bg-white dark:bg-[#17101F] min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mt-4 space-y-4">
          <button
            onClick={handleSendEth}
            className="bg-[#7C65C1] hover:bg-[#6A44BB] text-white font-bold py-2 px-4 rounded w-full max-w-xs mx-auto block"
          >
            Send ETH
          </button>
          <button
            onClick={handleCreatePost}
            className="bg-[#7C65C1] hover:bg-[#6A44BB] text-white font-bold py-2 px-4 rounded w-full max-w-xs mx-auto block"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
}
