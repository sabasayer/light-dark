import Phaser from "phaser";
import LevelScene from "../scenes/LevelScene";
import { COLORS } from "../utils/color-utils";

export interface BoardOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: number;
  rows: number;
  columns: number;
  cellColor: number;
  gap: number;
}

export class Board extends Phaser.GameObjects.Container {
  private options: BoardOptions;
  private cells: Phaser.GameObjects.Rectangle[] = [];
  private cellCenters: Phaser.GameObjects.Arc[] = [];
  constructor(scene: LevelScene, options: BoardOptions) {
    super(scene, options.x, options.y); // Pass scene, x, y to Container constructor
    this.options = options;

    // Add the container itself to the scene
    scene.add.existing(this);

    this.createBoard();
    this.createCells();
  }

  createBoard() {
    // Create rectangle relative to container origin (0,0) using scene.add
    const boardBackground = this.scene.add.rectangle(
      0,
      0,
      this.options.width,
      this.options.height,
      this.options.backgroundColor,
      1,
    );
    // Ensure the rectangle is positioned correctly if origin isn't (0,0) - default is (0.5, 0.5)
    boardBackground.setOrigin(0, 0);
    // Add the rectangle graphics to this container
    this.add(boardBackground);
    boardBackground.setPipeline("Light2D");
  }

  createCells() {
    const cellWidth =
      (this.options.width - this.options.gap * (this.options.columns + 1)) / // Adjusted gap calculation
      this.options.columns;
    const cellHeight =
      (this.options.height - this.options.gap * (this.options.rows + 1)) / // Adjusted gap calculation
      this.options.rows;

    // Calculate starting offset based on gap
    const startX = this.options.gap;
    const startY = this.options.gap;

    for (let rowNumber = 0; rowNumber < this.options.rows; rowNumber++) {
      for (
        let columnNumber = 0;
        columnNumber < this.options.columns;
        columnNumber++
      ) {
        // Calculate position relative to container origin (0,0)
        const x = startX + columnNumber * (cellWidth + this.options.gap);
        const y = startY + rowNumber * (cellHeight + this.options.gap);

        const cell = this.scene.add.rectangle(
          x,
          y,
          cellWidth,
          cellHeight,
          this.options.cellColor,
          1,
        );

        const cellCenter = this.scene.add.circle(
          x + cellWidth / 2,
          y + cellHeight / 2,
          2,
          COLORS.DEBUG_FILL_COLOR,
          1,
        );

        cell.setOrigin(0, 0); // Set origin for consistency
        // Add the cell graphics to this container
        this.add(cell);
        this.add(cellCenter);
        this.cells.push(cell);
        this.cellCenters.push(cellCenter);
        cell.setPipeline("Light2D");
      }
    }
  }

  getDarkLightPercentage() {
    const totalCells = this.cellCenters.length;
    let darkCells = 0;
    console.log({ totalCells });
    this.cellCenters.forEach((cellCenter) => {
      const isInShadow = (this.scene as LevelScene).isInTheShadow(
        cellCenter.x + this.x,
        cellCenter.y + this.y,
      );
      if (isInShadow) {
        console.log("darkCell", cellCenter.x, cellCenter.y);
        darkCells++;
      }
    });
    return Math.round((darkCells / totalCells) * 100);
  }
}
