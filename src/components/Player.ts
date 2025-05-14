import Phaser from "phaser";
import LevelScene from "../scenes/LevelScene";

export interface PlayerConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  speed?: number;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private keyboard?: Phaser.Input.Keyboard.KeyboardPlugin;
  private gamepad?: Phaser.Input.Gamepad.Gamepad;
  private speed: number;
  private lastTime: number = 0;

  constructor(scene: Phaser.Scene, config: PlayerConfig) {
    super(scene, config.x, config.y, "sprite", "player-01.png");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.speed = config.speed ?? 200;
    this.handleKeyboard();
    this.handleGamepad();
    this.setPipeline("Light2D");
    this.setFrame("player-01.png");
    this.setOrigin(0, 0);
    this.setScale(config.width / this.width, config.height / this.height);
  }

  handleKeyboard() {
    if (!this.scene.input.keyboard) return;

    this.keyboard = this.scene.input.keyboard;
  }

  handleGamepad() {
    if (!this.scene.input.gamepad) return;

    this.gamepad = this.scene.input.gamepad.getPad(0);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.handleKeyboardInput(time);
    this.handleGamepadInput(time);
  }

  handleKeyboardInput(time: number) {
    if (!this.keyboard) return;

    const cursors = this.keyboard.createCursorKeys();

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (cursors.left.isDown) body.setVelocityX(-this.speed);
    if (cursors.right.isDown) body.setVelocityX(this.speed);
    if (cursors.up.isDown) body.setVelocityY(-this.speed);
    if (cursors.down.isDown) body.setVelocityY(this.speed);

    body.velocity.normalize().scale(this.speed);
    this.updatePercentageText(time);
  }

  handleGamepadInput(delta: number) {
    if (!this.gamepad) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (this.gamepad.leftStick.x < -0.1) body.setVelocityX(-this.speed);
    if (this.gamepad.leftStick.x > 0.1) body.setVelocityX(this.speed);
    if (this.gamepad.leftStick.y < -0.1) body.setVelocityY(-this.speed);
    if (this.gamepad.leftStick.y > 0.1) body.setVelocityY(this.speed);

    body.velocity.normalize().scale(this.speed);
    this.updatePercentageText(delta);
  }

  updatePercentageText(time: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (
      body.velocity.length() > 0 &&
      time - this.lastTime > 100 &&
      time - this.lastTime < 200
    ) {
      (this.scene as LevelScene).updatePercentageText();
    }
    this.lastTime = time;
  }
}
