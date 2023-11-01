import * as PIXI from "pixi.js";

import Rect from "./Rect";
import textures from "./textures";
import Game from "./Game";
import Point from "./Point";

export default class GameObj {
  graphic: PIXI.AnimatedSprite;
  body: Rect;
  speed: Point
  age: number;
  killed: boolean;

  constructor() {
    this.graphic = new PIXI.AnimatedSprite([textures.cornerTracker1]);

    this.body = new Rect();
    this.body.x = 0;
    this.body.y = 0;

    this.speed = new Point();
    this.age = 0;

    this.killed = false;
  }

  update(delta: number) {
    this.age += delta;

    this.body.x += this.speed.x * delta / 1000;
    this.body.y += this.speed.y * delta / 1000;
  }

  render() {
    this.graphic.x = Math.round(this.body.x);
    this.graphic.y = Math.round(this.body.y);
  }

  kill() {
    this.killed = true;

    this.graphic.removeFromParent();
    this.graphic.stop();
    this.graphic.destroy();
  }
}
