import Phaser from "phaser";

interface LightSourceOptions {
  x: number;
  y: number;
  radius: number;
  color: number;
  intensity?: number; // Optional intensity
}

export class LightSource extends Phaser.GameObjects.Container {
  private light: Phaser.GameObjects.Light | null = null;
  private options: LightSourceOptions;

  constructor(scene: Phaser.Scene, options: LightSourceOptions) {
    super(scene, options.x, options.y);
    this.options = options; // Store options

    // Ensure the LightsManager is enabled in the scene
    if (!scene.lights.active) {
      scene.lights.enable();
    }

    // Add the container to the scene
    scene.add.existing(this);

    // Create the actual light source linked to this container's position
    this.light = scene.lights.addLight(
      this.x,
      this.y,
      this.options.radius,
      this.options.color,
      this.options.intensity ?? 1.0, // Default intensity to 1.0 if not provided
    );

    // Optionally, add a visual representation to the container itself
    // e.g., a small circle sprite
    const visual = scene.add.circle(0, 0, 5, options.color, 0.8);
    this.add(visual); // Add visual to the container
  }

  // Override setPosition to update the light's position when the container moves
  setPosition(x: number, y: number): this {
    super.setPosition(x, y);
    if (this.light) {
      this.light.setPosition(x, y);
    }
    return this;
  }

  // Example methods to control the light after creation
  setLightRadius(radius: number): void {
    if (this.light) {
      this.light.setRadius(radius);
      this.options.radius = radius; // Update stored options
    }
  }

  setLightColor(color: number): void {
    if (this.light) {
      this.light.setColor(color);
      this.options.color = color; // Update stored options
      // Update visual representation if needed
      const visual = this.getAt(0) as Phaser.GameObjects.Arc;
      if (visual) {
        visual.setFillStyle(color, 0.8);
      }
    }
  }

  setLightIntensity(intensity: number): void {
    if (this.light) {
      this.light.setIntensity(intensity);
      this.options.intensity = intensity; // Update stored options
    }
  }

  // Override destroy to also remove the light from the manager
  destroy(fromScene?: boolean): void {
    if (this.light) {
      this.scene.lights.removeLight(this.light);
      this.light = null;
    }
    super.destroy(fromScene);
  }
}
