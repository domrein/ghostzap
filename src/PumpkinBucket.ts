import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";

import Point from "./Point";
import Rect from "./Rect";
import Game from "./Game";
import textures from "./textures";
import GameObj from "./GameObj";

export default class PumpkinBucket extends GameObj {
  text: PIXI.Text;
  candyCount: number;

  constructor() {
    super();

    this.graphic.textures = [
      textures.pumpkinBlack1,
      textures.pumpkinBlack2,
      textures.pumpkinBlack3,
      textures.pumpkinBlack4,
      textures.pumpkinBlack5,
      textures.pumpkinBlack6,
      textures.pumpkinBlack7,
      textures.pumpkinBlack8,
      textures.pumpkinBlack9,
      textures.pumpkinBlack10,
    ];
    Game.instance.pumpkinBucketLayer.addChild(this.graphic);
    this.graphic.animationSpeed = 0.2;
    this.graphic.play();

    this.text = new PIXI.Text("0", {
      fontFamily: "PixelifySans",
      fontSize: 16,
      fill: 0xffffff,
    });
    this.text.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    Game.instance.pumpkinBucketLayer.addChild(this.text);

    this.body.x = -100;
    this.body.y = 190;

    this.body.width = 48;
    this.body.height = 48;

    this.candyCount = 0;
  }

  enter() {
    const tween = new TWEEN.Tween(this.body)
      .to({x: 1920 / 4 / 2 - this.body.width / 2}, 3000)
      .easing(TWEEN.Easing.Cubic.Out)
      .onComplete(() => {
      })
      .start();
  }

  render() {
    super.render();

    if (this.text.text !== this.candyCount.toString()) {
      this.text.text = this.candyCount.toString();
      // this.text.texture.update();
    }

    this.text.x = Math.round(this.body.x + this.body.width / 2 - this.text.width / 2);
    this.text.y = Math.round(this.body.y - this.text.height / 2);
  }

  exit() {
    const tween = new TWEEN.Tween(this.body)
      .to({ x: 1920 / 4 }, 1500)
      .easing(TWEEN.Easing.Cubic.Out)
      .onComplete(() => {
        Game.instance.updateHiScore();
        Game.instance.enterNewPumpkinBucket();
      })
      .start();
  }
}
