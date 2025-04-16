import { saveGame } from "../utils/save-game-utilts";

export default class LevelScene extends Phaser.Scene {
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  create() {
    saveGame(this.scene.key);
  }
}
