export const Platform = {
  Steam: "steam",
  XboxLive: "xbox_live",
  Psn: "psn",
  NintendoEshop: "nintendo_eshop",
  EaApp: "ea_app",
  Ubisoft: "ubisoft",
  EpicGames: "epic_games",
  BattleNet: "battlenet",
  OfficialWebsite: "official_website",
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];
