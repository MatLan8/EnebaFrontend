export const ProductType = {
  Game: "game",
  Dlc: "dlc",
  GiftCard: "gift_card",
  Subscription: "subscription",
  Software: "software",
  TopUp: "top_up",
} as const;

export type ProductType = (typeof ProductType)[keyof typeof ProductType];
