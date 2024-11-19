import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { FrameRequest } from "~/types";

export async function action({ request }: ActionFunctionArgs) {
  const data = (await request.json()) as FrameRequest;
  console.log(data);

  if (request.method === "POST") {
    return json({
      type: "form",
      title: "dTech Mini App",
      url: `${process.env.PUBLIC_URL}/?action=true&signedmessagebytes=${data.trustedData.messageBytes}`, // make sure this is your public URL e.g. http://localhost:3000 for local testing
    });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}

export async function loader() {
  return json({
    type: "composer",
    name: "dTech Mini App",
    icon: "check", // supported list: https://docs.farcaster.xyz/reference/actions/spec#valid-icons
    description: "dTech Mini App Template",
    aboutUrl: process.env.PUBLIC_URL,
    imageUrl: `${process.env.PUBLIC_URL}/icon.png`,
    action: {
      type: "post",
    },
  });
}
