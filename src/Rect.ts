import Point from './Point';

export default class Rect extends Point {
  width: number;
  height: number;

  constructor() {
    super();

    this.width = 0;
    this.height = 0;
  }

  get left(): number {
    return this.x;
  }

  get right(): number {
    return this.x + this.width;
  }

  get top(): number {
    return this.y;
  }

  get bottom(): number {
    return this.y + this.height;
  }

  intersects(rect: Rect) {
    if (this.left > rect.right) return false;
    if (this.right < rect.left) return false;
    if (this.top > rect.bottom) return false;
    if (this.bottom < rect.top) return false;

    return true;
  }

  containsPoint(point: Point) {
    if (point.x < this.left) return false;
    if (point.x > this.right) return false;
    if (point.y < this.top) return false;
    if (point.y > this.bottom) return false;

    return true;
  }
}
