export const createButton = (
  scene: Phaser.Scene,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    backgroundColor: number;
    color: string;
  },
) => {
  const { x, y, width, height, text, backgroundColor, color } = options;
  return scene.rexUI.add.label({
    x: x,
    y: y,
    width: width,
    height: height,
    background: scene.rexUI.add.roundRectangle(
      0,
      0,
      width,
      height,
      10,
      backgroundColor,
    ),
    text: scene.add.text(0, 0, text, { fontSize: "24px", color: color }),
    align: "center",
  });
};
