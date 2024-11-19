import type { MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import { useState } from "react";
import { useRootLoaderData } from "~/hooks/useRootLoaderData";

// Step type definition
type Step = "token" | "vault" | "amount" | "confirmation";

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
  const title = "Morpho Deposit";
  return [
    { title: title },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { rel: "manifest", href: "/manifest.json" },
    { name: "theme-color", content: "#7C65C1" },
    { name: "description", content: "Deposit to Morpho Vaults" },

    { property: "og:title", content: title },
    { property: "og:image", content: data?.imageUrl },
    { property: "fc:frame", content: "vNext" },
    { property: "fc:frame:image", content: data?.imageUrl },
    { property: "fc:frame:image:aspect_ratio", content: "1:1" },
    { property: "fc:frame:button:1", content: "Deposit" },
    { property: "fc:frame:button:1:action", content: "link" },
    { property: "fc:frame:button:1:target", content: data?.deepLink },
  ];
};

export default function Index() {
  const { user } = useRootLoaderData();
  const [currentStep, setCurrentStep] = useState<Step>("token");
  const [selectedToken, setSelectedToken] = useState<"ETH" | "USDC" | null>(
    null
  );
  const [selectedVault, setSelectedVault] = useState<number | null>(null);

  const steps = [
    { id: "token", label: "Select Token" },
    { id: "vault", label: "Choose Vault" },
    { id: "amount", label: "Deposit Amount" },
    { id: "confirmation", label: "Confirmation" },
  ];

  const vaultCards = Array(6).fill(null);

  return (
    <div className="bg-white dark:bg-[#17101F] min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    currentStep === step.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {index + 1}
                </div>
                <div className="ml-2 text-sm hidden sm:block">{step.label}</div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 mx-2 bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* Content based on current step */}
          <div className="max-w-6xl mx-auto">
            {currentStep === "token" && (
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold mb-6">Select Token</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setSelectedToken("ETH");
                      setCurrentStep("vault");
                    }}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-lg"
                  >
                    ETH
                  </button>
                  <button
                    onClick={() => {
                      setSelectedToken("USDC");
                      setCurrentStep("vault");
                    }}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-lg"
                  >
                    USDC
                  </button>
                </div>
              </div>
            )}

            {currentStep === "vault" && (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6">Select Vault</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {vaultCards.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedVault(index);
                        setCurrentStep("amount");
                      }}
                      className="p-8 bg-gray-100 dark:bg-gray-800 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="mt-6 h-6 w-3/4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "amount" && (
              <div className="flex flex-col items-center w-full">
                <h2 className="text-2xl font-bold mb-6">Deposit Amount</h2>
                <div className="w-full max-w-2xl p-8 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <button
                    onClick={() => setCurrentStep("confirmation")}
                    className="w-full mt-8 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-lg"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            )}

            {currentStep === "confirmation" && (
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 mb-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your deposit has been processed successfully.
                </p>
                <button
                  onClick={() => {
                    navigator.share?.({
                      title: "My Morpho Deposit",
                      text: "I just made a deposit on Morpho!",
                      url: window.location.href,
                    });
                  }}
                  className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-lg"
                >
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
