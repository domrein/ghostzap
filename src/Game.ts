import backgroundDirtImage from "../assets/background_dirt.png";
import foregroundImage from "../assets/background_foreground.png";

import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";

import Enemy from "./Enemy";
import Ghost from "./Ghost";
import Rect from "./Rect";
import BlueGhost from "./BlueGhost";
import PumpkinBucket from "./PumpkinBucket";
import CornerTracker from "./CornerTracker";
import Candy from "./Candy";
import utils from "./utils";
import Bat from "./Bat";

export default class Game {
  static instance: Game;

  debug: boolean = false;

  app: PIXI.Application;
  elapsedTime: number;

  candies: Candy[];
  enemies: Enemy[];
  pumpkinBucket: PumpkinBucket;
  bats: Bat[];
  pumpkinSwitchTimer: number;

  hiScore: number;

  hiScoreText: PIXI.Text;
  // cornerTrackers: CornerTracker[];
  debugGraphicsTracker: WeakMap<PIXI.Graphics, number>;

  candyLayer: PIXI.Container;
  enemyLayer: PIXI.Container;
  pumpkinBucketLayer: PIXI.Container;
  batLayer: PIXI.Container;
  uiLayer: PIXI.Container;
  debugLayer: PIXI.Container;

  constructor() {
    Game.instance = this;

    this.candies = [];
    this.enemies = [];
    this.bats = [];

    this.hiScore = 0;

    this.app = new PIXI.Application({ width: 1920 / 4, height: 1080 / 4 });
    this.app.renderer.background.color = 0x080808;
    this.elapsedTime = 0.0;

    // setup canvas
    const displayCanvas: HTMLCanvasElement = document.getElementById("display-canvas") as HTMLCanvasElement;
    if (!displayCanvas) {
      throw new Error("Cannot find display canvas!");
    }
    displayCanvas.width = 1920;
    displayCanvas.height = 1080;
    const displayContext = displayCanvas.getContext("2d");
    if (!displayContext) {
      throw new Error("Cannot get display canvas context!");
    }
    displayContext.imageSmoothingEnabled = false;
    // document.body.appendChild(this.app.view as any);

    // setup ticker for updates
    this.app.ticker.add((delta) => {
      TWEEN.update();
      this.update(delta);
      this.render();
    });

    // setup canvas copy
    this.app.renderer.on('postrender', () => {
      displayContext.drawImage(this.app.view as any, 0, 0, 1920 / 4, 1080 / 4, 0, 0, 1920, 1080);
    });

    // add graphics
    // const backgroundDirt: PIXI.Sprite = PIXI.Sprite.from(backgroundDirtImage);
    // this.app.stage.addChild(backgroundDirt);

    this.candyLayer = new PIXI.Container();
    this.app.stage.addChild(this.candyLayer);

    this.enemyLayer = new PIXI.Container();
    this.app.stage.addChild(this.enemyLayer);

    this.pumpkinBucketLayer = new PIXI.Container();
    this.app.stage.addChild(this.pumpkinBucketLayer);
    this.pumpkinSwitchTimer = 0;

    const foreground: PIXI.Sprite = PIXI.Sprite.from(foregroundImage);
    this.app.stage.addChild(foreground);

    this.batLayer = new PIXI.Container();
    this.app.stage.addChild(this.batLayer);

    this.uiLayer = new PIXI.Container();
    this.app.stage.addChild(this.uiLayer);

    // click events for testing
    this.app.stage.eventMode = "static";
    this.app.stage.on("pointerdown", (event: any) => {
      const loc = event.data.getLocalPosition(this.app.stage)

      const area = new Rect();
      area.x = loc.x;
      area.y = loc.y;
      area.width = 50;
      area.height = 50;

      this.hit(area);
    });

    this.pumpkinBucket = new PumpkinBucket();
    this.pumpkinBucket.enter();

    this.debugGraphicsTracker = new WeakMap();

    // add corner trackers in each corner
    // this.cornerTrackers = [];
    // for (let i = 0; i < 4; i++) {
    //   const cornerTracker = new CornerTracker();
    //   switch (i) {
    //     case 0:
    //       cornerTracker.body.x = 0;
    //       cornerTracker.body.y = 0;
    //       break;
    //     case 1:
    //       cornerTracker.body.x = 1920 / 4 - 8;
    //       cornerTracker.body.y = 0;
    //       break;
    //     case 2:
    //       cornerTracker.body.x = 0;
    //       cornerTracker.body.y = 1080 / 4 - 8;
    //       break;
    //     case 3:
    //       cornerTracker.body.x = 1920 / 4 - 8;
    //       cornerTracker.body.y = 1080 / 4 - 8;
    //       break;
    //   }
    //   this.cornerTrackers.push(cornerTracker);
    // }

    this.hiScoreText = new PIXI.Text("", {
      fontFamily: "PixelifySans",
      fontSize: 20,
      fill: 0xffffff,
    });
    this.hiScoreText.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.uiLayer.addChild(this.hiScoreText);
    this.loadHiScore();
    this.updateHiScore();

    this.debugLayer = new PIXI.Container();
    this.app.stage.addChild(this.debugLayer);
  }

  update(delta: number) {
    delta = this.app.ticker.elapsedMS;
    this.elapsedTime += delta;

    this.pumpkinSwitchTimer += delta;
    if (this.pumpkinSwitchTimer > 45000) {
      this.pumpkinSwitchTimer = 0;
      this.pumpkinBucket.exit();
    }

    if (Math.random() < 0.0125) {
      const ghost = new Ghost();
      this.enemies.push(ghost);
    }

    // if (Math.random() < 0.005) {
    //   const blueGhost = new BlueGhost();
    //   this.enemies.push(blueGhost);
    // }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.life <= 0) {
        enemy.kill();

        // add candy explosion
        for (let i = 0; i < 5; i++) {
          const candy = new Candy();
          candy.body.x = enemy.body.x;
          candy.body.y = enemy.body.y;
          const speed = utils.magDirToPoint(120 + Math.random() * 50, Math.random() * Math.PI * 2);
          candy.speed.x = speed.x;
          candy.speed.y = speed.y;
          this.candies.push(candy);
        }
      }
    }

    for (let i = this.bats.length - 1; i >= 0; i--) {
      const bat = this.bats[i];
      if (bat.life <= 0) {
        bat.kill();

        // add candy explosion
        for (let i = 0; i < 1; i++) {
          const candy = new Candy();
          candy.body.x = bat.body.x;
          candy.body.y = bat.body.y;
          const speed = utils.magDirToPoint(120 + Math.random() * 50, Math.random() * Math.PI * 2);
          candy.speed.x = speed.x;
          candy.speed.y = speed.y;
          this.candies.push(candy);
        }
      }
    }

    this.enemies.forEach((enemy) => {
      enemy.update(delta);
    });

    this.candies.forEach((candy) => {
      candy.update(delta);
    });

    this.pumpkinBucket.update(delta);

    this.bats.forEach(bat => {
      bat.update(delta);
    });

    // spawn bats clouds for added effect
    if (Math.random() < 0.0025 && !this.bats.length) {
      const numBats = Math.round(Math.random() * 10 + 20);
      for (let i = 0; i < numBats; i++) {
        const bat = new Bat();
        this.bats.push(bat);
      }
    }

    // update corner trackers (even though they don't do anything)
    // this.cornerTrackers.forEach((cornerTracker) => {
    //   cornerTracker.update(delta);
    // });

    // remove debug graphics after 1 second
    const children = [...this.debugLayer.children];
    children.forEach(graphic => {
      const startTime = this.debugGraphicsTracker.get(graphic as PIXI.Graphics);
      if (startTime && Date.now() - startTime > 1000) {
        this.debugLayer.removeChild(graphic);
      }
    });
  }

  render() {
    this.enemies.forEach((enemy) => {
      if (enemy.killed) {
        return;
      }
      enemy.render();
    });
    this.candies.forEach((candy) => {
      if (candy.killed) {
        return;
      }
      candy.render();
    });
    if (!this.pumpkinBucket.killed) {
      this.pumpkinBucket.render();
    }

    this.bats.forEach(bat => {
      if (bat.killed) {
        return;
      }
      bat.render();
    });
    // this.cornerTrackers.forEach((cornerTracker) => {
    //   cornerTracker.render();
    // });
  }

  hit(area: Rect) {
    this.enemies.forEach(enemy => {
      if (enemy.body.intersects(area)) {
        enemy.hit();
      }
    });

    this.candies.forEach(candy => {
      if (candy.body.intersects(area)) {
        candy.hit();
      }
    });

    this.bats.forEach(bat => {
      if (bat.body.intersects(area)) {
        bat.hit();
      }
    });

    if (this.debug) {
      const graphics = new PIXI.Graphics();
      this.debugGraphicsTracker.set(graphics, Date.now());
      graphics.beginFill(0x666666);
      graphics.drawRect(area.x, area.y, area.width, area.height);
      this.debugLayer.addChild(graphics);
    }
  }

  enterNewPumpkinBucket() {
    this.pumpkinBucket.kill();

    this.pumpkinBucket = new PumpkinBucket();
    this.pumpkinBucket.enter();
  }

  loadHiScore() {
    const hiScore = parseInt(window.localStorage.getItem("hiScore") + "") || 0;
    this.hiScore = hiScore;
  }

  updateHiScore() {
    if (this.pumpkinBucket.candyCount > this.hiScore) {
      this.hiScore = this.pumpkinBucket.candyCount;

      window.localStorage.setItem("hiScore", this.hiScore.toString());
    }

    this.hiScoreText.text = `High Score: ${this.hiScore}`;
    this.hiScoreText.x = 1920 / 4 / 2 - this.hiScoreText.width / 2;
    this.hiScoreText.y = 3;
  }
}
