import { COLORS } from "../utils/color-utils";
import { saveGame } from "../utils/save-game-utils";

export default class LevelScene extends Phaser.Scene {
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  create() {
    console.log(this.game.config.width, this.game.config.height);
    this.add.rectangle(
      Number(this.game.config.width) / 2,
      Number(this.game.config.height) / 2,
      Number(this.game.config.width),
      Number(this.game.config.height),
      COLORS.DARK_PRIMARY,
      1,
    );
    this.lights.setAmbientColor(COLORS.BASIC_ORANGE);
    saveGame(this.scene.key);
  }
}
