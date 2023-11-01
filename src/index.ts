import "../assets/PixelifySans.ttf";
import "./index.css";

import * as PIXI from "pixi.js";
import FontFaceObserver from "fontfaceobserver";

import Game from "./Game";
import Tracker from "./Tracker"

const font = new FontFaceObserver("PixelifySans", {});

Promise.all([
  font.load(),
]).then(() => {
  const game = new Game();
  // game.debug = true;
  new Tracker();

  const displayCanvas = document.getElementById("display-canvas") as HTMLCanvasElement;
  displayCanvas.addEventListener("pointerdown", (event) => {
    displayCanvas.requestFullscreen();
  });

  const cameraView = document.getElementById("camera-video") as HTMLCanvasElement;

  let cornerIndex = 0;
  cameraView.addEventListener("pointerdown", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    console.log(x, y);

    let corner = null;
    let cornerName = null;
    switch (cornerIndex % 4) {
      case 0:
        corner = Tracker.instance.topLeftCorner;
        cornerName = "topLeftCorner";
        break;
      case 1:
        corner = Tracker.instance.topRightCorner;
        cornerName = "topRightCorner";
        break;
      case 2:
        corner = Tracker.instance.bottomLeftCorner;
        cornerName = "bottomLeftCorner";
        break;
      case 3:
        corner = Tracker.instance.bottomRightCorner;
        cornerName = "bottomRightCorner";
        break;
    }
    if (!corner) {
      return;
    }

    corner.x = x;
    corner.y = y;
    console.log(`${cornerName} set to ${x}, ${y}`);

    // save to local storage
    const coords = {
      topLeftCorner: Tracker.instance.topLeftCorner,
      topRightCorner: Tracker.instance.topRightCorner,
      bottomLeftCorner: Tracker.instance.bottomLeftCorner,
      bottomRightCorner: Tracker.instance.bottomRightCorner,
    };
    window.localStorage.setItem("screenCoords", JSON.stringify(coords));

    cornerIndex++;
  });

  const coords = JSON.parse(window.localStorage.getItem("screenCoords") || "{}");
  if (coords.topLeftCorner) {
    Tracker.instance.topLeftCorner.x = coords.topLeftCorner.x;
    Tracker.instance.topLeftCorner.y = coords.topLeftCorner.y;
  }
  if (coords.topRightCorner) {
    Tracker.instance.topRightCorner.x = coords.topRightCorner.x;
    Tracker.instance.topRightCorner.y = coords.topRightCorner.y;
  }
  if (coords.bottomLeftCorner) {
    Tracker.instance.bottomLeftCorner.x = coords.bottomLeftCorner.x;
    Tracker.instance.bottomLeftCorner.y = coords.bottomLeftCorner.y;
  }
  if (coords.bottomRightCorner) {
    Tracker.instance.bottomRightCorner.x = coords.bottomRightCorner.x;
    Tracker.instance.bottomRightCorner.y = coords.bottomRightCorner.y;
  }
});
