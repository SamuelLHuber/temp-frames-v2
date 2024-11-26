# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

make sure you have dependencies installed ```bun install```

## Development

Run the dev server:

```shellscript
bun run dev
```

## Deployment

First, build your app for production:

```sh
bun run build
```

Then run the app in production mode:

```sh
bun start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `bun run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

## Build log

### Getting started

### Add Farcaster Frames SDK

```bash
bun add @farcaster/frame-sdk
```

now in the pages where we want to interact with the Farcaster client import the sdk

```typescript
import sdk from "@farcaster/frame-sdk"
```

#### Install and setup Wagmi for Blockchain interaction from Typescript

add wagmi for interacting with the wallet in app frame

```bash
bun add wagmi viem@2.x @tanstack/react-query
```

now create the wagmi config

```typescript
import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
```

we now have to use the [Wagmi Provider](https://wagmi.sh/react/api/WagmiProvider) and to make use of our config in code.
Additionally the TanStack Query provider is also needed since it's a dependency of Wagmi. In `root.tsx` we wrap our Layout function.

>We can use loader data and all other remix functionality here. The following code sample merely illustrates the setup

```typescript
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
      </head>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

We are now ready to building tblockchain and transaction based App Frames
