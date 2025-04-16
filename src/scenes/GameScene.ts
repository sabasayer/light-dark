import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load assets here
    }

    create() {
        // Create game objects here
        this.add.text(400, 300, 'Hello Phaser!', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }

    update() {
        // Game logic update loop
    }
} 