import { COLORS } from "../utils/color-utils";
import { saveGame } from "../utils/save-game-utils";

export default class LevelScene extends Phaser.Scene {
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  create() {
    this.add
      .rectangle(
        0,
        0,
        Number(this.game.config.width),
        Number(this.game.config.height),
        COLORS.DARK_PRIMARY,
        1,
      )
      .setOrigin(0, 0);
    this.lights.setAmbientColor(COLORS.BASIC_ORANGE);
    saveGame(this.scene.key);
  }
}
