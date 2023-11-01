import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";

import Point from "./Point";
import Rect from "./Rect";
import Game from "./Game";
import textures from "./textures";

export default class CornerTracker {
  graphic: PIXI.AnimatedSprite;
  body: Rect;

  constructor() {
    this.graphic = new PIXI.AnimatedSprite([
      textures.cornerTracker1,
    ]);
    Game.instance.uiLayer.addChild(this.graphic);

    this.body = new Rect();
  }

  update(delta: number) {
  }

  render() {
    this.graphic.x = Math.round(this.body.x);
    this.graphic.y = Math.round(this.body.y);
  }
}
