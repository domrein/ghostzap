import * as TWEEN from "@tweenjs/tween.js";

import Enemy from "./Enemy";
import textures from "./textures";
import utils from "./utils";
import Game from "./Game";
import Point from "./Point";
import Rect from "./Rect";

export default class Ghost extends Enemy {
  tween: TWEEN.Tween<Object> | null;

  constructor() {
    super();

    this.graphic.textures = [
      textures.blackGhost1,
      textures.blackGhost2,
      textures.blackGhost3,
      textures.blackGhost4,
      textures.blackGhost5,
      textures.blackGhost6,
      textures.blackGhost7,
      textures.blackGhost8,
      textures.blackGhost9,
      textures.blackGhost10,
    ];
    this.graphic.animationSpeed = Math.random() > 0.5 ? 0.1 : 0.2;
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
      if (this.age > 20000) {
        this.exit();
      }
      else {
        // pick spot on screen
        const spot = new Point();
        const intersection = new Rect();
        do {
          const x = Math.random() * (1920 / 4 - this.body.width);
          const y = Math.random() * (1080 / 4 - this.body.height - 20);
          spot.x = x;
          spot.y = y;

          intersection.x = x;
          intersection.y = y;
          intersection.width = this.body.width;
          intersection.height = this.body.height;
        } while (Game.instance.pumpkinBucket.body.intersects(intersection));

        this.tween = new TWEEN.Tween(this.body)
          .to(spot, 2000)
          .easing(TWEEN.Easing.Cubic.InOut)
          .onComplete(() => {
            this.tween = null;
          })
          .start();
      }
    }
  }

  exit() {
    this.tween = new TWEEN.Tween(this.body)
      .to(utils.randLocOffscreen(), 2000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onComplete(() => {
        if (this.killed) {
          return;
        }

        this.kill();
      })
      .start();
  }

  kill() {
    super.kill();

    Game.instance.enemies.splice(Game.instance.enemies.indexOf(this), 1);
  }
}
