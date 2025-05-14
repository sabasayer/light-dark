import { Board, BoardOptions } from "../components/Board";
import { LightSource, LightSourceOptions } from "../components/LightSource";
import { Player, PlayerConfig } from "../components/Player";
import {
  AMBIENT_LIGHT_COLOR,
  AMBIENT_LIGHT_ENABLED,
  BOARD_BOUNDS_BUFFER,
  DARK_OVERLAY_ALPHA,
  LEVEL_BOARD_OPTIONS,
} from "../constants/level-constants";
import { COLORS } from "../utils/color-utils";
import { isDebug } from "../utils/debug-utils";
import { saveGame } from "../utils/save-game-utils";
import { loadSpriteSheet } from "../utils/sprite-utils";
import { END_GAME_SCENE_KEY } from "./EndGameScene";

export interface ObstacleOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
}

export interface LevelSceneOptions extends Phaser.Types.Scenes.SettingsConfig {
  levelNumber: number;
  boardOptions: Pick<BoardOptions, "rows" | "columns">;
  lightSources: LightSourceOptions[];
  obstacles: ObstacleOptions[];
  playerConfig: PlayerConfig;
  nextLevelScene?: string;
  isLastLevel?: boolean;
}

export default class LevelScene extends Phaser.Scene {
  private lightSources: LightSource[] = [];
  private obstacles: Phaser.GameObjects.Rectangle[] = [];
  private mask: Phaser.Display.Masks.GeometryMask;
  private graphics: Phaser.GameObjects.Graphics;
  private board: Board;
  private darkOverlay: Phaser.GameObjects.Rectangle;
  private options: LevelSceneOptions;
  private percentageText: Phaser.GameObjects.Text;
  private intersectingRayPoints: Phaser.Math.Vector2[] = [];
  private player: Player;
  private percentage: number;

  constructor(config: LevelSceneOptions) {
    super(config);
    this.options = config;
  }

  preload() {
    loadSpriteSheet(this);
  }

  create() {
    //this.lights.setAmbientColor(COLORS.BASIC_ORANGE);
    saveGame(this.scene.key);

    this.add.text(30, 30, `Level ${this.options.levelNumber}`, {
      fontSize: "32px",
      color: "#fff",
    });

    this.createBoard();
    this.createLightSource();
    this.createObstacles();
    this.createPlayer();

    this.createMask();
    this.createRays();
    this.mouseHandler();
    if (AMBIENT_LIGHT_ENABLED) {
      this.lights.setAmbientColor(AMBIENT_LIGHT_COLOR);
    }

    this.createPercentageText();
  }

  createPlayer() {
    const player = new Player(this, this.options.playerConfig);
    this.player = player;
    this.board.add(this.player);
  }

  createPercentageText() {
    this.percentageText = this.add.text(
      400,
      30,
      this.darkLightPercentageText(),
      {
        fontSize: "32px",
        color: "#fff",
      },
    );
  }

  updatePercentageText() {
    this.percentageText?.setText(this.darkLightPercentageText());
  }

  darkLightPercentageText() {
    const value = this.percentage;
    return `Dark/Light: ${value}/${100 - value}`;
  }

  mouseHandler() {
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.setPosition(dragX, dragY);

      this.createRays();
    });

    this.input.on("dragend", () => {
      this.updatePercentageText();
    });
  }

  createBoard() {
    this.board = new Board(this, {
      ...LEVEL_BOARD_OPTIONS,
      rows: this.options.boardOptions.rows,
      columns: this.options.boardOptions.columns,
      backgroundColor: COLORS.DARK_PRIMARY,
      cellColor: COLORS.LIGHT_PRIMARY,
    });
  }

  createLightSource() {
    this.options.lightSources.forEach((options) => {
      const lightSource = new LightSource(this, options);
      this.lightSources.push(lightSource);
    });
  }

  createObstacles() {
    this.options.obstacles.forEach((obstacle) => {
      const obj = this.add
        .rectangle(
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height,
          obstacle.color,
        )
        .setOrigin(0, 0)
        .setInteractive({ draggable: true });

      obj.setPipeline("Light2D");
      this.obstacles.push(obj);
      this.physics.world.enable(obj);
    });
  }

  createMask() {
    this.darkOverlay = this.add
      .rectangle(
        this.board.getBounds().x,
        this.board.getBounds().y,
        this.board.getBounds().width,
        this.board.getBounds().height,
        COLORS.DARK_PRIMARY,
        DARK_OVERLAY_ALPHA,
      )
      .setOrigin(0, 0)
      .setDepth(10);

    this.darkOverlay.setPipeline("Light2D");

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
      this.board.getBounds().x - BOARD_BOUNDS_BUFFER,
      this.board.getBounds().y - BOARD_BOUNDS_BUFFER,
      this.board.getBounds().width + BOARD_BOUNDS_BUFFER * 2,
      this.board.getBounds().height + BOARD_BOUNDS_BUFFER * 2,
    );
  }

  getPlayerBounds() {
    const { displayWidth, displayHeight } = this.player;

    return new Phaser.Geom.Rectangle(
      this.player.x + this.board.x,
      this.player.y + this.board.y,
      displayWidth,
      displayHeight,
    );
  }

  createRays() {
    const rects = [
      ...this.obstacles.map((obstacle) => this.getRectangle(obstacle)),
      this.getBoardBounds(),
      this.getPlayerBounds(),
    ];

    const edges = rects.flatMap((rect) => this.getRectEdges(rect));
    const vertices = rects.flatMap((rect) => this.getRectVertices(rect));

    const rays = vertices.map(() => new Phaser.Geom.Line());

    this.graphics.clear();
    this.graphics.fillStyle(COLORS.DEBUG_FILL_COLOR);

    this.lightSources.forEach((lightSource) => {
      let intersectingRayPoints = this.calculateIntersectingRayPoints(
        lightSource,
        vertices,
        edges,
        rays,
      );
      intersectingRayPoints = this.sortClockwise(
        intersectingRayPoints,
        lightSource,
      );

      this.intersectingRayPoints = intersectingRayPoints;
      this.drawRays(intersectingRayPoints, rays, edges);
    });
    this.calculateDarkLightPercentage();
    this.updatePercentageText();
    this.checkLevelComplete();
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.player.update(time, delta);
    this.createRays();
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

  calculateIntersectingRayPoints(
    source: LightSource,
    vertices: Phaser.Geom.Point[],
    edges: Phaser.Geom.Line[],
    rays: Phaser.Geom.Line[],
  ) {
    const sx = source.x;
    const sy = source.y;
    return rays.map((ray, i) => {
      ray.setTo(sx, sy, vertices[i].x, vertices[i].y);
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
      ray.x2 = out.x;
      ray.y2 = out.y;

      return out;
    }

    return null;
  }

  /**
   * Returns true if the given world coordinates (x,y) are in shadow
   * (i.e. not reached by any light source).
   */
  isInTheShadow(x: number, y: number): boolean {
    // Build all obstacle + board rectangles
    const rects = [
      ...this.obstacles.map((o) => this.getRectangle(o)),
      this.getBoardBounds(),
    ];
    const edges = rects.flatMap((r) => this.getRectEdges(r));
    const vertices = rects.flatMap((r) => this.getRectVertices(r));

    // For each light, cast rays & build its lit-area polygon
    for (const source of this.lightSources) {
      const rays = vertices.map(() => new Phaser.Geom.Line());
      const litPoints = this.calculateIntersectingRayPoints(
        source,
        vertices,
        edges,
        rays,
      );
      const sorted = this.sortClockwise(litPoints, source);
      const poly = new Phaser.Geom.Polygon(sorted);

      // If our point is inside this light’s polygon, it’s lit
      if (Phaser.Geom.Polygon.Contains(poly, x, y)) {
        return false;
      }
    }

    // No light reached it → in shadow
    return true;
  }

  get rayExtensionValue() {
    return Math.sqrt(
      this.board.getBounds().width * this.board.getBounds().width +
        this.board.getBounds().height * this.board.getBounds().height,
    );
  }

  calculateDarkLightPercentage() {
    const polygon = new Phaser.Geom.Polygon(this.intersectingRayPoints);
    const area = polygon.calculateArea();
    const totalArea =
      this.board.getBounds().width * this.board.getBounds().height;
    this.percentage = 100 - Math.round((area / totalArea) * 100);
  }

  checkLevelComplete() {
    const percentage = this.percentage;
    if (percentage >= 48 && percentage <= 52) {
      if (this.options.isLastLevel) {
        this.scene.start(END_GAME_SCENE_KEY);
      } else {
        this.scene.start(this.options.nextLevelScene);
      }
    }
  }
}
