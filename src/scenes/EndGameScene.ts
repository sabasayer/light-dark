import Phaser from "phaser";

export const END_GAME_SCENE_KEY = "EndGameScene";

export default class EndGameScene extends Phaser.Scene {
  constructor() {
    super({ key: END_GAME_SCENE_KEY });
  }

  create() {
    this.add.text(100, 100, "End Game", { fontSize: "32px", color: "#fff" });
  }
}
