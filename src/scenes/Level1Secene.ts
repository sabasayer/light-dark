import { COLORS } from "../utils/color-utils";
import { Board } from "../components/Board";
import LevelScene from "./LevelScene";
import { LightSource } from "../components/LightSource";
import { isDebug } from "../utils/debug-utils";
export default class Level1Scene extends LevelScene {
  private lightSources: LightSource[] = [];
  private obstacles: Phaser.GameObjects.Rectangle[] = [];
  private mask: Phaser.Display.Masks.GeometryMask;
  private graphics: Phaser.GameObjects.Graphics;
  private board: Board;
  private darkOverlay: Phaser.GameObjects.Rectangle;
  constructor() {
    super({ key: "Level1Scene" });
  }

  create() {
    super.create();
    this.add.text(0, 0, "Level 1", { fontSize: "32px", color: "#fff" });

    this.createBoard();
    this.createLightSource();
    this.createObstacles();
    this.createMask();
    this.createRays();
  }

  createBoard() {
    // Instantiate BoardScene container, passing this scene and options
    this.board = new Board(this, {
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
    const lightSource = new LightSource(this, {
      x: 200,
      y: 150,
      radius: 1000,
      color: COLORS.BASIC_WHITE,
      intensity: 30,
    });
    this.lightSources.push(lightSource);
  }

  createObstacles() {
    const obstacles = [
      { x: 310, y: 370, width: 50, height: 50, color: COLORS.BASIC_RED },
      { x: 420, y: 470, width: 50, height: 50, color: COLORS.BASIC_RED },
      { x: 530, y: 270, width: 50, height: 50, color: COLORS.BASIC_RED },
    ];

    obstacles.forEach((obstacle) => {
      const obj = this.add
        .rectangle(
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height,
          obstacle.color,
        )
        .setOrigin(0, 0);
      obj.setPipeline("Light2D");
      this.obstacles.push(obj);
    });
  }

  createMask() {
    this.darkOverlay = this.add
      .rectangle(
        0,
        0,
        Number(this.game.config.width),
        Number(this.game.config.height),
        COLORS.DARK_PRIMARY,
        0.6,
      )
      .setOrigin(0, 0)
      .setDepth(10);

    this.graphics = this.make.graphics({
      lineStyle: { color: COLORS.DEBUG_STROKE_COLOR, width: 0.5 },
    });

    if (!isDebug()) {
      this.mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);
      this.mask.setInvertAlpha(true);
    } else {
      this.graphics.setAlpha(0.5);
      this.add.existing(this.graphics);
    }

    this.darkOverlay.setMask(this.mask);
  }

  // Add a buffer to the board bounds so the rays don't intersect with the board edges
  getBoardBounds() {
    return new Phaser.Geom.Rectangle(
      this.board.getBounds().x - 20,
      this.board.getBounds().y - 20,
      this.board.getBounds().width + 40,
      this.board.getBounds().height + 40,
    );
  }

  createRays() {
    const rects = [
      ...this.obstacles.map((obstacle) => this.getRectangle(obstacle)),
      this.getBoardBounds(),
    ];

    const edges = rects.flatMap((rect) => this.getRectEdges(rect));
    const vertices = rects.flatMap((rect) => this.getRectVertices(rect));

    const rays = vertices.map(() => new Phaser.Geom.Line());

    const lightSource = this.lightSources[0];

    let intersectingRays = this.calculateIntersectingRays(
      lightSource,
      vertices,
      edges,
      rays,
    );
    intersectingRays = this.sortClockwise(intersectingRays, lightSource);
    console.log(intersectingRays);
    this.drawRays(intersectingRays, rays, edges);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  getRectangle(obstacle: Phaser.GameObjects.Rectangle) {
    return new Phaser.Geom.Rectangle(
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height,
    );
  }

  getRectEdges(rect: Phaser.Geom.Rectangle) {
    return [rect.getLineA(), rect.getLineB(), rect.getLineC(), rect.getLineD()];
  }

  getRectVertices(rect: Phaser.Geom.Rectangle) {
    const { left, top, right, bottom } = rect;
    const EPSILON = Phaser.Math.EPSILON;

    const left1 = left + EPSILON;
    const top1 = top + EPSILON;
    const right1 = right - EPSILON;
    const bottom1 = bottom - EPSILON;

    const left2 = left - EPSILON;
    const top2 = top - EPSILON;
    const right2 = right + EPSILON;
    const bottom2 = bottom + EPSILON;

    return [
      new Phaser.Geom.Point(left1, top1),
      new Phaser.Geom.Point(right1, top1),
      new Phaser.Geom.Point(right1, bottom1),
      new Phaser.Geom.Point(left1, bottom1),
      new Phaser.Geom.Point(left2, top2),
      new Phaser.Geom.Point(right2, top2),
      new Phaser.Geom.Point(right2, bottom2),
      new Phaser.Geom.Point(left2, bottom2),
    ];
  }

  drawRays(
    vertices: Phaser.Math.Vector2[],
    rays: Phaser.Geom.Line[],
    edges: Phaser.Geom.Line[],
  ) {
    this.graphics.clear();
    this.graphics.fillStyle(COLORS.DEBUG_FILL_COLOR);
    this.graphics.fillPoints(vertices, true);

    if (isDebug()) {
      for (const ray of rays) {
        this.graphics.strokeLineShape(ray);
      }

      for (const edge of edges) {
        this.graphics.strokeLineShape(edge);
      }

      this.graphics.fillStyle(COLORS.DEBUG_FILL_COLOR);

      for (const vert of vertices) {
        this.graphics.fillPointShape(vert, 4);
      }
    }
  }

  calculateIntersectingRays(
    source: LightSource,
    vertices: Phaser.Geom.Point[],
    edges: Phaser.Geom.Line[],
    rays: Phaser.Geom.Line[],
  ) {
    const sx = source.x;
    const sy = source.y;
    return rays.map((ray, i) => {
      console.log(vertices[i].x, vertices[i].y);
      ray.setTo(sx, sy, vertices[i].x, vertices[i].y);
      console.log(ray);
      Phaser.Geom.Line.Extend(ray, 0, this.rayExtensionValue);

      for (const edge of edges) {
        this.getRayToEdge(ray, edge);
      }

      return ray.getPointB();
    });
  }

  sortClockwise(points: Phaser.Math.Vector2[], source: LightSource) {
    const cx = source.x;
    const cy = source.y;

    return points.sort((a, b) => {
      if (a.x - cx >= 0 && b.x - cx < 0) {
        return -1;
      }

      if (a.x - cx < 0 && b.x - cx >= 0) {
        return 1;
      }

      if (a.x - cx === 0 && b.x - cx === 0) {
        if (a.y - cy >= 0 || b.y - cy >= 0) {
          return a.y > b.y ? 1 : -1;
        }

        return b.y > a.y ? 1 : -1;
      }

      const det = (a.x - cx) * -(b.y - cy) - (b.x - cx) * -(a.y - cy);

      if (det < 0) {
        return -1;
      }

      if (det > 0) {
        return 1;
      }

      const d1 = (a.x - cx) * (a.x - cx) + (a.y - cy) * (a.y - cy);
      const d2 = (b.x - cx) * (b.x - cx) + (b.y - cy) * (b.y - cy);

      return d1 > d2 ? -1 : 1;
    });
  }

  getRayToEdge(ray: Phaser.Geom.Line, edge: Phaser.Geom.Line) {
    const out = new Phaser.Geom.Point();
    if (Phaser.Geom.Intersects.LineToLine(ray, edge, out)) {
      console.log({ out, edge, ray });
      ray.x2 = out.x;
      ray.y2 = out.y;

      return out;
    }

    return null;
  }

  get rayExtensionValue() {
    return Math.sqrt(
      this.board.getBounds().width * this.board.getBounds().width +
        this.board.getBounds().height * this.board.getBounds().height,
    );
  }
}
