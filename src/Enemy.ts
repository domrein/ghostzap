import * as PIXI from "pixi.js";

import Point from "./Point";
import Rect from "./Rect";
import Game from "./Game";
import textures from "./textures";
import GameObj from "./GameObj";

export default class Enemy extends GameObj {
  life: number;

  constructor() {
    super();

    Game.instance.enemyLayer.addChild(this.graphic);

    this.life = 1;
  }

  hit() {
    // check last hit time
    // decrement life
    this.life--;
  }
}
