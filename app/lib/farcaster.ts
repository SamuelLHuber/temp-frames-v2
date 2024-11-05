export function hexStringToUint8Array(hexstring: string): Uint8Array {
  return new Uint8Array(
    hexstring.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
  );
}

/**
 * Validates a frame message by querying a Farcaster hub.
 * @param body The frame action payload containing the message to validate.
 * @returns A Promise that resolves with an object containing whether the message signature is valid and the validated message.
 */
export async function validateFrameSignature(
  signedmessagebytes: string
): Promise<{
  isValid: boolean;
  message?;
}> {
  const hubBaseUrl = process.env.HUB_URL;
  const validateMessageResponse = await fetch(
    `${hubBaseUrl}/v1/validateMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: hexStringToUint8Array(signedmessagebytes),
    }
  );
  const result = await validateMessageResponse.json();

  if (result && result.valid) {
    return {
      isValid: result.valid,
      message: result.message,
    };
  } else {
    return {
      isValid: false,
    };
  }
}

export const FARCASTER_EPOCH = 1609459200000; // January 1, 2021 UTC

/**
 * Get the current Farcaster time.
 * @returns seconds since the Farcaster Epoch
 */
export const getFarcasterTime = () => {
  return toFarcasterTime(Date.now());
};

/**
 * Converts from a Unix to Farcaster timestamp.
 * @param time unix milliseconds
 * @returns seconds since the Farcaster Epoch
 */
export const toFarcasterTime = (time: number) => {
  if (time < FARCASTER_EPOCH) {
    throw Error(
      "bad_request.invalid_param: time must be after Farcaster epoch (01/01/2022)"
    );
  }
  const secondsSinceEpoch = Math.round((time - FARCASTER_EPOCH) / 1000);
  if (secondsSinceEpoch > 2 ** 32 - 1) {
    throw new Error("bad_request.invalid_param: time too far in future");
  }
  return secondsSinceEpoch;
};

/**
 * Converts from a Farcaster to Unix timestamp.
 * @param time seconds since the Farcaster Epoch
 * @returns unix milliseconds
 */
export const fromFarcasterTime = (time: number) => {
  return time * 1000 + FARCASTER_EPOCH;
};
