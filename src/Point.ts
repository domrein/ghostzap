export default class Point {
  x: number;
  y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }

  calcDistance(point: Point) {
    const dist = Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
    return dist;
  }
}
