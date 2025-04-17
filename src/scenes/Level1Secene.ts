import { COLORS } from "../utils/color-utils";
import { Board } from "../components/Board";
import LevelScene from "./LevelScene";
import { LightSource } from "../components/LightSource";

export default class Level1Scene extends LevelScene {
  constructor() {
    super({ key: "Level1Scene" });
  }

  create() {
    super.create();
    this.add.text(0, 0, "Level 1", { fontSize: "32px", color: "#fff" });

    this.createBoard();
    this.createLightSource();
    this.createObstacles();
  }

  createBoard() {
    // Instantiate BoardScene container, passing this scene and options
    new Board(this, {
      x: 200, // Position of the container's top-left corner in Level1Scene
      y: 150,
      rows: 6,
      columns: 8,
      width: 800, // Width of the board within the container
      height: 600, // Height of the board within the container
      backgroundColor: COLORS.DARK_PRIMARY,
      cellColor: COLORS.LIGHT_PRIMARY,
      gap: 10,
    });
  }

  createLightSource() {
    new LightSource(this, {
      x: 200,
      y: 150,
      radius: 1000,
      color: COLORS.BASIC_WHITE,
      intensity: 30,
    });
  }

  createObstacles() {
    const obstacles = [
      { x: 300, y: 350, width: 100, height: 100, color: COLORS.BASIC_GREEN },
      { x: 600, y: 550, width: 100, height: 100, color: COLORS.BASIC_GREEN },
      { x: 800, y: 650, width: 100, height: 100, color: COLORS.BASIC_GREEN },
    ];

    obstacles.forEach((obstacle) => {
      const obj = this.add.rectangle(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height,
        obstacle.color,
      );
      obj.setPipeline("Light2D");
    });
  }
}
