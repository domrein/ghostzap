import Point from "./Point";

export default {
  hackNameFilename(filename: string) {
    return filename.replace("/Users/paul/repos/halloween_game_2023/assets", "");
  },

  randLocOffscreen(): Point {
    let x = 0;
    let y = 0;
    if (Math.random() < .5) {
      x = Math.random() * 1920 / 4;
      y = Math.random() < .5 ? -100 : 1080 / 4 + 100;
    }
    else {
      x = Math.random() < .5 ? -100 : 1920 / 4 + 100;
      y = Math.random() * 1080 / 4;
    }

    const point = new Point();
    point.x = x;
    point.y = y;

    return point;
  },

  magDirToPoint(magnitude: number, direction:number): Point {
    const point = new Point();
    point.x = magnitude * Math.cos(direction);
    point.y = magnitude * Math.sin(direction);

    return point;
  },
}
