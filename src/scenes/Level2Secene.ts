import { COLORS } from "../utils/color-utils";
import LevelScene from "./LevelScene";
export default class Level2Scene extends LevelScene {
  constructor() {
    super({
      key: "Level2Scene",
      isLastLevel: true,
      levelNumber: 2,
      boardOptions: { rows: 6, columns: 8 },
      playerConfig: {
        x: 40,
        y: 70,
        width: 20,
        height: 20,
      },
      lightSources: [
        {
          x: 200,
          y: 170,
          radius: 1000,
          color: COLORS.BASIC_ORANGE,
          intensity: 10,
        },
        {
          x: 600,
          y: 550,
          radius: 1000,
          color: COLORS.BASIC_WHITE,
          intensity: 10,
        },
      ],
      obstacles: [
        { x: 310, y: 370, width: 50, height: 50, color: COLORS.BASIC_RED },
        { x: 420, y: 470, width: 50, height: 50, color: COLORS.BASIC_RED },
        { x: 530, y: 270, width: 50, height: 50, color: COLORS.BASIC_RED },
        { x: 630, y: 170, width: 50, height: 50, color: COLORS.BASIC_RED },
      ],
    });
  }
}
