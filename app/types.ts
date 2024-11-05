export type FrameData = {
  buttonIndex: number;
  castId: {
    fid: number;
    hash: string;
  };
  inputText: string;
  fid: number;
  messageHash: string;
  network: number;
  state: string;
  timestamp: number;
  transactionId?: string;
  url: string;
};

export type FrameRequest = {
  untrustedData: FrameData;
  trustedData: {
    messageBytes: string;
  };
};
