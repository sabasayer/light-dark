import SpriteSheet from "../assets/sprite.png";
import SpriteSheetAtlas from "../assets/sprite-atlas.xml?url";

export const loadSpriteSheet = (scene: Phaser.Scene) => {
  scene.load.atlasXML("sprite", SpriteSheet, SpriteSheetAtlas);
};
