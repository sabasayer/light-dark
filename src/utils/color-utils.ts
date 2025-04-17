export const COLORS = {
  // Core Light
  LIGHT_PRIMARY: 0xfff5e1, // Pale Warm Yellow
  LIGHT_SECONDARY: 0xffddaa, // Soft Orange
  LIGHT_TERTIARY: 0xffebcd, // Blanched Almond

  // Core Dark
  DARK_PRIMARY: 0x1a0a2e, // Deep Indigo/Purple
  DARK_SECONDARY: 0x301934, // Dark Byzantium
  DARK_TERTIARY: 0x483d8b, // Dark Slate Blue

  // Player & Interaction
  PLAYER_NEUTRAL: 0x87ceeb, // Sky Blue
  PLAYER_BURN_WARN: 0xff4500, // Orange Red
  PLAYER_CONSUME_WARN: 0x9370db, // Medium Purple
  INTERACTION_FLIP: 0x00ff7f, // Spring Green

  // UI & Neutral
  UI_LIGHT_BG: 0xf5f5f5, // White Smoke
  UI_DARK_TEXT: 0x2f4f4f, // Dark Slate Gray
  UI_NEUTRAL_TEXT: 0x778899, // Light Slate Gray
  UI_BALANCE_GOLD: 0xffd700, // Gold

  // Keep basic colors if needed elsewhere, prefix with BASIC_
  BASIC_WHITE: 0xffffff,
  BASIC_BLACK: 0x000000,
  BASIC_RED: 0xff0000,
  BASIC_GREEN: 0x00ff00,
  BASIC_BLUE: 0x0000ff,
  BASIC_ORANGE: 0xffa500,
} as const;
