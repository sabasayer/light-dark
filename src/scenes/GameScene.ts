import Phaser from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

export default class GameScene extends Phaser.Scene {
  rexUI: RexUIPlugin;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Load assets here
  }

  create() {
    this.scene.start("MenuScene");
  }

  update() {
    // Game logic update loop
  }
}
