import * as TWEEN from "@tweenjs/tween.js";

import Enemy from "./Enemy";
import textures from "./textures";
import utils from "./utils";

export default class BlueGhost extends Enemy {
  tween: TWEEN.Tween<Object> | null;

  constructor() {
    super();

    this.graphic.textures = [
      textures.blueGhost1,
      textures.blueGhost2,
    ];
    this.graphic.animationSpeed = 0.05;
    this.graphic.play();

    this.body.width = 32;
    this.body.height = 32;

    this.tween = null;

    const offscreenLoc = utils.randLocOffscreen();
    this.body.x = offscreenLoc.x;
    this.body.y = offscreenLoc.y;
  }

  update(delta: number): void {
    super.update(delta);

    if (Math.random() < 0.01 && !this.tween) {
      // pick spot on screen
      const x = Math.random() * 1920 / 4;
      const y = Math.random() * 1080 / 4;

      this.tween = new TWEEN.Tween(this.body)
        .to({ x, y }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(() => {
          this.tween = null;
        })
        .start();
    }
  }
}
