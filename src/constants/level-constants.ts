import { COLORS } from "../utils/color-utils";

export const LEVEL_BOARD_OPTIONS = {
  x: 200, // Position of the container's top-left corner in Level1Scene
  y: 150,
  width: 800, // Width of the board within the container
  height: 600, // Height of the board within the container
  backgroundColor: COLORS.DARK_PRIMARY,
  cellColor: COLORS.LIGHT_PRIMARY,
  gap: 10,
};

export const BOARD_BOUNDS_BUFFER = 20;
export const DARK_OVERLAY_ALPHA = 0.6;
export const AMBIENT_LIGHT_ENABLED = false;
export const AMBIENT_LIGHT_COLOR = COLORS.BASIC_ORANGE;
