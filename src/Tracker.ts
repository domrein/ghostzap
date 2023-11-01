// NOTE: couldn't get tracking.js to work with typescript, so I just dropped it in the "out" directory

import Game from "./Game";
import Rect from "./Rect";
import Point from "./Point";

export default class Tracker {
  static instance: Tracker;

  topLeftCorner: Point;
  bottomLeftCorner: Point;
  topRightCorner: Point;
  bottomRightCorner: Point;

  colorTracker: tracking.ColorTracker;

  constructor() {
    Tracker.instance = this;

    this.topLeftCorner = new Point();
    this.bottomLeftCorner = new Point();
    this.topRightCorner = new Point();
    this.bottomRightCorner = new Point();

    this.addCameraVideo();
    this.registerCustomColors();
    this.colorTracker = this.createColorTracker();

    window.tracking.track("#camera-video", this.colorTracker);
  }

  addCameraVideo() {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          console.log(device);
        });
      });
    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: "d1e4c570837628c58aa03d91f8515963d6e3788707cd5a1d9716fc64dc6ebb6c" } } })
      .then((stream) => {
        const cameraVideo = document.getElementById('camera-video') as HTMLVideoElement;
        if (!cameraVideo) {
          throw new Error("Cannot find camera video!");
        }
        cameraVideo.srcObject = stream;
        return cameraVideo.play(); // As a promise
      })
      .catch((error) => {
        console.error('Error accessing the webcam:', error);
      });
  }

  registerCustomColors() {
    window.tracking.ColorTracker.registerColor("laser-red", (r, g, b) => {
      // if (r > 150 && g < 100 && b < 100) {
      // if (r > 140 && g < 80 && b < 80) {
      // if (r > 140 && g < 80 && b < 80) {
      // if (r > 140 && g < 80 && b < 80) {
      // if (r > 140 && g < 120 && b < 120) {
      // if (r > 200 && g < 170 && b < 170) {
      // if (r > 200 && g < 170 && b < 170 && r / g > 1.3 && r / b > 1.3) {

      // macbook camera in semi-dark room
      // if (r > 200 && g < 170 && b < 170 && r / g > 1.3 && r / b > 1.3) {
      // bendy camera in semi-dark room
      if (r > 100 && g < 80 && b < 80 && r / g > 1.3 && r / b > 1.3) {
      // if (r > 170) {
        // console.log(r, g, b);
        return true;
      }
      return false;
    });
    window.tracking.ColorTracker.registerColor("corner-tracker-green", (r, g, b) => {
      if (r < 80 && g > 140 && b < 80) {
        return true;
      }
      return false;
    });
  }

  createColorTracker(): tracking.ColorTracker {
    const colorTracker = new window.tracking.ColorTracker(["laser-red", "corner-tracker-green"]);
    colorTracker.setMinDimension(3);

    colorTracker.on("track", event => {
      const greenCorners = [];
      event.data.forEach(rect => {
        // discard for out of bounds colors
        if (
          (rect.x < this.topLeftCorner.x && rect.x < this.bottomLeftCorner.x) ||
          (rect.x > this.topRightCorner.x && rect.x > this.bottomRightCorner.x)
        ) {
          return;
        }
        if (
          (rect.y < this.topLeftCorner.y && rect.y < this.topRightCorner.y) ||
          (rect.y > this.bottomLeftCorner.y && rect.y > this.bottomRightCorner.y)
        ) {
          return;
        }

        // detect laser
        if (rect.color === "laser-red") {
          console.log("laser-red:", rect.x, rect.y, rect.width, rect.height);
          // console.log(rect);

          // map camera coordinates to display coordinates
          const hitRect = new Rect();
          // TODO: do something more intelligent that just min/max
          const left = Math.min(this.topLeftCorner.x, this.bottomLeftCorner.x);
          const right = Math.max(this.topRightCorner.x, this.bottomRightCorner.x);
          const top = Math.min(this.topLeftCorner.y, this.topRightCorner.y);
          const bottom = Math.max(this.bottomLeftCorner.y, this.bottomRightCorner.y);
          const width = right - left;
          const height = bottom - top;

          const xRatio = (rect.x - left) / width;
          const yRatio = (rect.y - top) / height;

          hitRect.x = 1920 / 4 * xRatio;
          hitRect.y = 1080 / 4 * yRatio;
          hitRect.width = rect.width / width * 1920 / 4;
          hitRect.height = rect.height / height * 1080 / 4;

          Game.instance.hit(hitRect);
        }

        // detect green tracking corners
        // else if (rect.color === "corner-tracker-green") {
        //   console.log("corner-tracker-green:", rect.x, rect.y, rect.width, rect.height);
        //   greenCorners.push(rect);
        // }
      });

      // if (greenCorners.length === 4) {
      //   // TODO: establish which corner is which
      //   console.log("!!!found all green corners!!!");
      // }
    });

    return colorTracker;
  }
}
