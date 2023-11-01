import Game from "./Game";
import GameObj from "./GameObj";
import textures from "./textures";

export default class Bat extends GameObj {
  life: number;

  constructor() {
    super();

    this.life = 1;

    this.graphic.textures = [
      textures.bat1,
      textures.bat2,
      textures.bat3,
    ];
    this.graphic.play();
    this.graphic.animationSpeed = Math.random() * .2 + .1;
    Game.instance.batLayer.addChild(this.graphic);

    this.body.width = 16;
    this.body.height = 16;

    this.speed.x = Math.random() * 45 + 25;
    this.speed.y = Math.random() * -20 - 10;

    this.body.x = Math.random() * -200 - this.body.width;
    this.body.y = Math.random() * 200 + 50;
  }

  update(delta: number): void {
    super.update(delta);

    if (this.age > 20000) {
      this.kill();
    }
  }

  kill(): void {
    super.kill();

    Game.instance.bats.splice(Game.instance.bats.indexOf(this), 1);
  }

  hit(): void {
    this.life = 0;
  }
}
