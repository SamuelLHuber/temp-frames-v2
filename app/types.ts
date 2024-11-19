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

// https://docs.farcaster.xyz/developers/frames/app-frames#api
type AppFrameConfig = {
  /** URL that hosts the App Frame */
  url: string;
  /** Image to show on the Splash Screen */
  splashImageUrl: string;
  /** Background color to show on the Splash Screen */
  splashBackgroundColor: string;
};

type AppFrameUntrustedUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type CastFrameEmbedLaunchContext = {
  type: "cast_frame_embed";
  castHash: string;
};

type DirectCastFrameEmbedLaunchContext = {
  type: "direct_cast_frame_embed";
};

type CastActionLaunchContext = {
  type: "cast_action";
  castHash: string;
};

type ComposerActionLaunchContext = {
  type: "composer_action";
  cast: {
    parent?: string; // Cast parent hash
    text?: string; // Cast text, can include @mentions
    embeds?: string[]; // Embed URLs
  };
};

type ChannelProfileLaunchContext = {
  type: "channel_profile";
  channelKey: string;
};

type LaunchContext =
  | CastFrameEmbedLaunchContext
  | DirectCastFrameEmbedLaunchContext
  | CastActionLaunchContext
  | ComposerActionLaunchContext
  | ChannelProfileLaunchContext;
