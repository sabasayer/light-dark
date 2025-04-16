import Label from "phaser3-rex-plugins/templates/ui/label/Label";
import { createButton } from "../utils/button-utils";
import { loadGame } from "../utils/save-game-utilts";
import { COLORS } from "../utils/color-utils";
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    const savedScene = loadGame();

    this.add.text(360, 100, "Light & Dark", {
      fontSize: "64px",
      color: "#fff",
      align: "center",
    });

    const buttons = this.rexUI.add
      .buttons({
        x: 600,
        y: 400,
        width: 700,
        background: this.rexUI.add.roundRectangle(
          0,
          0,
          700,
          100,
          10,
          COLORS.BLACK,
        ),
        buttons: [
          createButton(this, {
            x: 100,
            y: 100,
            width: 700,
            height: 100,
            text: "Continue The Game",
            backgroundColor: savedScene ? COLORS.ORANGE : COLORS.BLACK,
            color: savedScene ? "#fff" : "#777",
          }),
          createButton(this, {
            x: 100,
            y: 100,
            width: 200,
            height: 100,
            text: "Start The Game",
            backgroundColor: COLORS.ORANGE,
            color: "#fff",
          }),
        ],
        orientation: "y",
        align: "center",
        space: {
          item: 10,
        },
      })
      .layout();

    buttons.on("button.click", (button: Label) => {
      console.log(button.text);

      if (button.text === "Start The Game") {
        this.scene.start("Level1Scene");
      }

      if (button.text === "Continue The Game" && savedScene) {
        this.scene.start(savedScene);
      }
    });
  }
}
