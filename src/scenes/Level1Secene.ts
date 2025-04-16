import LevelScene from "./LevelScene";

export default class Level1Scene extends LevelScene {
  constructor() {
    super({ key: "Level1Scene" });
  }

  create() {
    super.create();
    this.add.text(0, 0, "Level 1", { fontSize: "32px", color: "#fff" });
  }
}
