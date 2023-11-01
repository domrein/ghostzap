import * as TWEEN from "@tweenjs/tween.js";
import * as PIXI from "pixi.js";

import Rect from "./Rect";
import textures from "./textures";
import Game from "./Game";
import GameObj from "./GameObj";

export default class Candy extends GameObj {
  collected: boolean;

  constructor() {
    super();

    this.collected = false;

    const lollipopFrame = [
      textures.lollipop1,
      textures.lollipop2,
      textures.lollipop3,
      textures.lollipop4,
      textures.lollipop5,
      textures.lollipop6,
      textures.lollipop7,
      textures.lollipop8,
      textures.lollipop9,
      textures.lollipop10,
      textures.lollipop11,
      textures.lollipop12,
      textures.lollipop13,
      textures.lollipop14,
    ];
    this.graphic.textures = lollipopFrame;
    Game.instance.candyLayer.addChild(this.graphic);
    this.graphic.animationSpeed = 0.2;
    this.graphic.play();

    this.body.width = 16;
    this.body.height = 16;
  }

  update(delta: number): void {
    super.update(delta);

    this.speed.x *= 0.95;
    this.speed.y *= 0.95;

    if (this.age > 20000) {
      this.kill();
    }
  }

  hit() {
    if (this.collected || this.age < 500) {
      return;
    }

    this.collected = true;
    // tween to pumpkin bucket
    const pumpkinBucket = Game.instance.pumpkinBucket;
    const tween = new TWEEN.Tween(this.body)
      .to({
        x: pumpkinBucket.body.x + pumpkinBucket.body.width / 2,
        y: pumpkinBucket.body.y + pumpkinBucket.body.height / 2,
      }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onComplete(() => {
        if (this.killed) {
          return;
        }

        Game.instance.pumpkinBucket.candyCount++;

        this.kill();
      })
      .start();
  }

  kill() {
    super.kill();

    Game.instance.candies.splice(Game.instance.candies.indexOf(this), 1);
  }
}
