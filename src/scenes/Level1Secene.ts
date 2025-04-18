import { COLORS } from "../utils/color-utils";
import LevelScene from "./LevelScene";
export default class Level1Scene extends LevelScene {
  constructor() {
    super({
      key: "Level1Scene",
      levelNumber: 1,
      boardOptions: { rows: 6, columns: 8 },
      lightSources: [
        {
          x: 400,
          y: 350,
          radius: 1000,
          color: COLORS.BASIC_WHITE,
          intensity: 10,
        },
      ],
      obstacles: [
        { x: 310, y: 370, width: 50, height: 50, color: COLORS.BASIC_RED },
        { x: 420, y: 470, width: 50, height: 50, color: COLORS.BASIC_RED },
        { x: 530, y: 270, width: 50, height: 50, color: COLORS.BASIC_RED },
      ],
    });
  }
}
