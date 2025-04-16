import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import MenuScene from "./scenes/MenuScene";
import Level1Scene from "./scenes/Level1Secene";
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: "game-container", // ID of the div to render the game in
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [GameScene, MenuScene, Level1Scene], // Add your scenes here
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI",
      },
    ],
  },
};

const game = new Phaser.Game(config);

export default game;
