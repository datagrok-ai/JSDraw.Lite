//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw.Lite
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//
// (Released under LGPL 3.0: https://opensource.org/licenses/LGPL-3.0)
//
//////////////////////////////////////////////////////////////////////////////////

// @ts-nocheck

import type {JSDraw2ModuleType} from './types';

import type {Point} from './Point';

declare const JSDraw2: JSDraw2ModuleType<any>;

export enum CornerTypes {
  TOPLEFT = "topleft",
  TOPRIGHT = "topright",
  BOTTOMLEFT = "bottomleft",
  BOTTOMRIGHT = "bottomright",
}

export type CornerType = typeof CornerTypes[keyof typeof CornerTypes];

/**
 * Rect class - define a Rectangle on the screen
 * @class scilligence.JSDraw2.Rect
 */
export class Rect {
  /**
   @property {number} left
   */
  /**
   @property {number} top
   */
  /**
   @property {number} width
   */
  /**
   @property {number} height
   */
  public left: number;
  public top: number;
  public width: number;
  public height: number;

  /**
   * @constructor Rect
   * @param {number} left
   * @param {number} top
   * @param {number} width
   * @param {number} height
   */
  constructor(left?: number, top?: number, width?: number, height?: number) {
    this.left = isNaN(left) ? 0 : left;
    this.top = isNaN(top) ? 0 : top;
    this.width = isNaN(width) ? 0 : width;
    this.height = isNaN(height) ? 0 : height;
  }

  /**
   * Set Rect based on two points
   * @function set
   * @param {Point} p1 - the first point
   * @param {Point} p2 - the second point
   * @returns the Rect itelf
   */
  set(p1: Point, p2: Point): Rect {
    this.left = Math.min(p1.x, p2.x);
    this.top = Math.min(p1.y, p2.y);
    this.width = Math.abs(p1.x - p2.x);
    this.height = Math.abs(p1.y - p2.y);
    return this;
  }

  /**
   * Get the top-left corner of the Rect
   * @function topleft
   * @returns a Point object
   */
  topleft(): Point {
    return new JSDraw2.Point(this.left, this.top);
  }

  /**
   * Get the top-right corner of the Rect
   * @function topright
   * @returns a Point object
   */
  topright(): Point {
    return new JSDraw2.Point(this.right(), this.top);
  }

  /**
   * Get the bottom-left corner of the Rect
   * @function bottomleft
   * @returns a Point object
   */
  bottomleft(): Point {
    return new JSDraw2.Point(this.left, this.bottom());
  }

  /**
   * Get the bottom-right corner of the Rect
   * @function bottomright
   * @returns a Point object
   */
  bottomright(): Point {
    return new JSDraw2.Point(this.right(), this.bottom());
  }

  fourPoints(): [Point, Point, Point, Point] {
    return [this.topleft(), this.topright(), this.bottomleft(), this.bottomright()];
  }

  /**
   * Clone this Rect
   * @function clone
   * @returns a new Rect object
   */
  clone(): Rect {
    return new JSDraw2.Rect(this.left, this.top, this.width, this.height);
  }

  /**
   * Check if the Rect is empty
   * @function isEmpty
   * @returns true or false
   */
  isEmpty(): boolean {
    return !(this.width > 0 && this.height > 0);
  }

  /**
   * Test if the Rect area contains a Point
   * @function contains
   * @param {Point} p - the point to be tested
   * @returns true or false
   */
  contains(p: Point): boolean {
    return p.x >= this.left && p.x <= this.right() && p.y >= this.top && p.y <= this.bottom();
  }

  /**
   * Get the right coordinate
   * @function right
   * @returns a number
   */
  right(): number {
    return this.left + this.width;
  }

  /**
   * Get the bottom coordinate
   * @function bottom
   * @returns a number
   */
  bottom(): number {
    return this.top + this.height;
  }

  /**
   * Get the center of the Rect
   * @function center
   * @returns the center as a Point object
   */
  center(): Point {
    return new JSDraw2.Point(this.left + this.width / 2, this.top + this.height / 2);
  }

  centerLeft(): Point {
    return new JSDraw2.Point(this.left, this.top + this.height / 2);
  }

  centerRight(): Point {
    return new JSDraw2.Point(this.right(), this.top + this.height / 2);
  }

  centerTop(): Point {
    return new JSDraw2.Point(this.left + this.width / 2, this.top);
  }

  centerBottom(): Point {
    return new JSDraw2.Point(this.left + this.width / 2, this.bottom());
  }

  /**
   * Offset the rect
   * @function offset
   * @param {number} dx - the x offset
   * @param {number} dy - the y offset
   * @returns the rect itself
   */
  offset(dx, dy): Rect {
    this.left += dx;
    this.top += dy;
    return this;
  }

  /**
   * Scale the rect
   * @function scale
   * @param {number} s - the scaling factor
   * @param {Point} origin - the base Point
   * @returns the rect itself
   */
  scale(s: number, origin: Point): Rect {
    if (origin != null) {
      this.left = (this.left - origin.x) * s + origin.x;
      this.top = (this.top - origin.y) * s + origin.y;
    } else {
      this.left *= s;
      this.top *= s;
    }
    this.width *= s;
    this.height *= s;
    return this;
  }

  /**
   * Union another Point
   * @function unionPoint
   * @param {Point} p - the Point to be unioned
   * @returns the rect itself
   */
  unionPoint(p: Point): Rect {
    if (p.x < this.left) {
      this.width += this.left - p.x;
      this.left = p.x;
    } else if (p.x > this.right()) {
      this.width += p.x - this.right();
    }

    if (p.y < this.top) {
      this.height += this.top - p.y;
      this.top = p.y;
    } else if (p.y > this.bottom()) {
      this.height += p.y - this.bottom();
    }
    return this;
  }

  /**
   * Union another Rect
   * @function union
   * @param {Rect} r - the Rect to be unioned
   * @returns the rect itself
   */
  union(r: Rect): Rect {
    if (r == null)
      return;
    const right = this.right();
    const bottom = this.bottom();

    if (r.left < this.left)
      this.left = r.left;
    if (r.top < this.top)
      this.top = r.top;

    this.width = Math.max(right, r.right()) - this.left;
    this.height = Math.max(bottom, r.bottom()) - this.top;
    return this;
  }

  /**
   * Inflate the Rect
   * @function inflate
   * @param {number} dx - the delta in x direction
   * @param {number} dy - the delta in y direction
   * @returns the rect itself
   */
  inflate(dx: number, dy: number): Rect {
    if (dy == null)
      dx = dy;
    if (this.width + 2 * dx < 0)
      dx = -this.width / 2;
    if (this.height + 2 * dy < 0)
      dy = -this.height / 2;

    this.offset(-dx, -dy);
    this.width += 2 * dx;
    this.height += 2 * dy;

    return this;
  }

  distance2Point(p: Point): number {
    const r = this.right();
    const b = this.bottom();
    let d = new JSDraw2.Point(this.left, this.top).distTo(p);
    d = this._minDist(d, p, this.left + this.width / 2, this.top);
    d = this._minDist(d, p, r, this.top);
    d = this._minDist(d, p, r, this.top + this.height / 2);
    d = this._minDist(d, p, r, b);
    d = this._minDist(d, p, this.left + this.width / 2, b);
    d = this._minDist(d, p, this.left, b);
    d = this._minDist(d, p, this.left, this.height / 2);
    return d;
  }

  _minDist(d: number, p: Point, x: number, y: number): number {
    return Math.min(d, new JSDraw2.Point(x, y).distTo(p));
  }

  cross(p1: Point, p2: Point) {
    const c1 = this.contains(p1);
    const c2 = this.contains(p2);
    if (c1 && c2)
      return 0;
    else if (c1 && !c2)
      return -2;
    else if (!c1 && c2)
      return 2;

    const a = p2.angleTo(p1);
    const aa = [];
    aa[0] = new JSDraw2.Point(this.left, this.top).angleTo(p1) - a;
    aa[1] = new JSDraw2.Point(this.right(), this.top).angleTo(p1) - a;
    aa[2] = new JSDraw2.Point(this.right(), this.bottom()).angleTo(p1) - a;
    aa[3] = new JSDraw2.Point(this.left, this.bottom()).angleTo(p1) - a;
    for (let i = 0; i < aa.length; ++i) {
      if (aa[i] < 0)
        aa[i] += 360;
    }
    aa.sort(function(a, b) { return a - b; });

    if (aa[0] < 90 && aa[3] > 270)
      return 1;
    if (aa[0] > 90 && aa[0] < 180 && aa[3] > 180 && aa[3] < 270)
      return -1;
    return 0;
  }

  /**
   * Convert the Rect into a string
   * @function toString
   * @param {number} scale - the scale factor
   * @returns a string
   */
  toString(scale: number): string {
    if (!(scale > 0))
      scale = 1.0;
    return (this.left * scale).toFixed(3) + " " +
      (-this.bottom() * scale).toFixed(3) + " " +
      (this.width * scale).toFixed(3) + " " +
      (this.height * scale).toFixed(3);
  }

  cornerTest(p: Point, tor: number): CornerType {
    if (Math.abs(p.x - this.left) < tor && Math.abs(p.y - this.top) < tor)
      return CornerTypes.TOPLEFT;
    if (Math.abs(p.x - this.right()) < tor && Math.abs(p.y - this.top) < tor)
      return CornerTypes.TOPRIGHT;
    if (Math.abs(p.x - this.left) < tor && Math.abs(p.y - this.bottom()) < tor)
      return CornerTypes.BOTTOMLEFT;
    if (Math.abs(p.x - this.right()) < tor && Math.abs(p.y - this.bottom()) < tor)
      return CornerTypes.BOTTOMRIGHT;
    return null;
  }

  moveCorner(corner: CornerType, d: Point): void {
    switch (corner) {
    case "topleft":
      this.set(this.topleft().offset(d.x, d.y), this.bottomright());
      break;
    case "topright":
      this.set(this.topright().offset(d.x, d.y), this.bottomleft());
      break;
    case "bottomleft":
      this.set(this.bottomleft().offset(d.x, d.y), this.topright());
      break;
    case "bottomright":
      this.set(this.bottomright().offset(d.x, d.y), this.topleft());
      break;
    }
  }

  // -- static --

  static fromString(s: string): Rect {
    if (s == null)
      return null;
    const ss = s.split(' ');
    if (ss.length != 4)
      return null;
    const left = parseFloat(ss[0]);
    const top = parseFloat(ss[1]);
    const wd = parseFloat(ss[2]);
    const ht = parseFloat(ss[3]);
    if (isNaN(left) || isNaN(top) || isNaN(wd) || isNaN(ht))
      return null;
    return new JSDraw2.Rect(left, -top - ht, wd, ht);
  };
}

JSDraw2.Rect = Rect;
