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

import {JSDraw2ModuleType} from './types';
import {IGraphics} from './types/jsdraw2';
import {Rect} from './Rect';
import {Mol} from './Mol';
import {Atom} from './Atom';

declare const JSDraw2: JSDraw2ModuleType<any>;

/**
 * Point class - define a position on the screen
 * @class scilligence.JSDraw2.Point
 */
export class PointInt {
  /**
   @property {number} x
   */

  /**
   @property {number} y
   */

  public x: number;
  public y: number;

  /**
   * @constructor Point
   * @param {number} x
   * @param {number} y
   */
  constructor(x: number, y: number) {
    this.x = isNaN(x) ? 0 : x;
    this.y = isNaN(y) ? 0 : y;
  }

  /**
   * Check if the x, y values are valid number
   * @function isValid
   * @returns true or false
   */
  isValid(): boolean {
    return !isNaN(this.x) && !isNaN(this.y);
  }

  /**
   * Get the length from the Point to the origin (0, 0)
   * @function length
   * @returns a number
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get the distance from this Point to another Point (p)
   * @function distTo
   * @param {Point} p - the other point
   * @returns a number
   */
  distTo(p: Point): number {
    const dx = this.x - p.x;
    const dy = this.y - p.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Test if this point is on the line composing of p1-p2
   * @function onLine
   * @param {Point} p1 - the first point of the line
   * @param {Point} p2 - the second point of the line
   * @param {number} tor - the tolerance
   * @returns true or false
   */
  onLine(p1: Point, p2: Point, tor: number): boolean {
    const d2 = p1.distTo(p2);
    const d = p1.distTo(this) + p2.distTo(this) - d2;
    return Math.abs(d) <= tor * (50 / d2);
  }

  inTriangle(v1: Point, v2: Point, v3: Point): boolean {
    const b1 = JSDraw2.Point.sign(this, v1, v2) < 0.0;
    const b2 = JSDraw2.Point.sign(this, v2, v3) < 0.0;
    const b3 = JSDraw2.Point.sign(this, v3, v1) < 0.0;
    return b1 == b2 && b2 == b3;
  }

  flip(p1: Point, p2: Point): Point {
    const a0 = p2.angleTo(p1);
    const a = this.angleTo(p1) - a0;
    return this.rotateAround(p1, -2 * a);
  }

  /**
   * Move the Point
   * @function offset
   * @param {number} dx - offset x
   * @param {number} dy - offset y
   * @returns the Point itself
   */
  offset(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    return this;
  }

  offset2(d: Point) {
    this.x += d.x;
    this.y += d.y;
    return this;
  }

  /**
   * Scale the point around an origin
   * @function offset
   * @param {number} scale - the scale factor
   * @param {Point} origin - the origin
   * @returns the Point itself
   */
  scale(s: number, origin?: Point): Point {
    if (origin != null) {
      this.x = (this.x - origin.x) * s + origin.x;
      this.y = (this.y - origin.y) * s + origin.y;
    } else {
      this.x *= s;
      this.y *= s;
    }
    return this;
  }

  /**
   * Reverse the point
   * @function reverse
   * @returns the Point itself
   */
  reverse(): Point {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * Clone the point
   * @function clone
   * @returns a new Point object
   */
  clone(): Point {
    return new JSDraw2.Point(this.x, this.y);
  }

  /**
   * Test if this Point equals to the other one
   * @function equalsTo
   * @param {Point} p - the other Point
   * @returns true or false
   */
  equalsTo(p: Point): boolean {
    return p != null && this.x == p.x && this.y == p.y;
  }

  /**
   * Get the angle of the point from X axis
   * @function angle
   * @returns a number in degree
   */
  angle(): number {
    const a = Math.atan2(this.y, this.x) * 180 / Math.PI;
    return a < 0 ? (a + 360) : a;
  }

  /**
   * Get the angle with a Point as the origin
   * @function angleTo
   * @param {Point} origin - the origin
   * @returns a number in degree
   */
  angleTo(origin: Point): number {
    const a = Math.atan2(this.y - origin.y, this.x - origin.x) * 180 / Math.PI;
    return a < 0 ? (a + 360) : a;
  }

  /**
   * Get the angle of p1-(this)-p2
   * @function angleAsOrigin
   * @param {Point} p1 - the first point
   * @param {Point} p2 - the second point
   * @returns a number in degree
   */
  angleAsOrigin(p1: Point, p2: Point): number {
    const v1 = p1.clone().offset(-this.x, -this.y);
    const v2 = p2.clone().offset(-this.x, -this.y);
    const a = v2.angle() - v1.angle();
    return a < 0 ? (a + 360) : a;
  }

  middleAngle(p1: Point, p2: Point): number {
    const a1 = p1.angleTo(this);
    const a2 = p2.angleTo(this);
    let mid = (a1 + a2) / 2;
    if (Math.abs(a1 - a2) > 180) {
      mid += 180;
      if (mid >= 360)
        mid -= 360;
    }
    return mid;
  }

  /**
   * Rotate the point around the origin
   * @function rotate
   * @param {number} deg - the degree to be rotated
   * @returns the Point itself
   */
  rotate(deg: number): Point {
    const d = this.length();
    if (d == 0)
      return this;
    const a = this.angle();
    this.x = d * Math.cos((a + deg) * Math.PI / 180);
    this.y = d * Math.sin((a + deg) * Math.PI / 180);
    return this;
  }

  /**
   * Rotate the point around a point
   * @function rotateAround
   * @param {Point} origin - the origin
   * @param {number} deg - the degree to be rotated
   * @returns the Point itself
   */
  rotateAround(origin: Point, deg: number, len?: number): Point {
    this.offset(-origin.x, -origin.y)
      .rotate(deg)
      .offset(origin.x, origin.y);
    if (len > 0)
      this.setLength(len, origin);
    return this;
  }

  setLength(len: number, origin?: Point): Point {
    if (origin == null)
      return this.scale(len / this.length());

    this.offset(-origin.x, -origin.y);
    this.scale(len / this.length());
    return this.offset(origin.x, origin.y);
  }

  toString(scale: number): string {
    if (!(scale > 0))
      scale = 1.0;
    return (this.x * scale).toFixed(3) + " " + (-this.y * scale).toFixed(3);
  }

  shrink(origin: Point, delta: number) {
    const d = this.distTo(origin);
    const s = (d - delta) / d;
    this.x = (this.x - origin.x) * s + origin.x;
    this.y = (this.y - origin.y) * s + origin.y;
    return this;
  }

  equalMove(start: Point): void {
    const d = Math.abs(this.x - start.x);
    if (this.y > start.y)
      this.y = start.y + d;
    else
      this.y = start.y - d;
  }
}

export class Point extends PointInt {
  static fromString(s: string): Point {
    const ss = s.split(' ');
    if (ss.length != 2)
      return null;
    const x = parseFloat(ss[0]);
    const y = -parseFloat(ss[1]);
    if (isNaN(x) || isNaN(y))
      return null;

    return new JSDraw2.Point(x, y);
  }

  static centerOf(p1: Point, p2: Point): Point {
    return new JSDraw2.Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  }

  static sign(p1: Point, p2: Point, p3: Point): number {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

  static _onSegment(p: Point, q: Point, r: Point): boolean {
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
      return true;

    return false;
  }

  static _orientation(p: Point, q: Point, r: Point): number {
    // See 10th slides from following link for derivation of the formula
    // http://www.dcs.gla.ac.uk/~pat/52233/slides/Geometry1x1.pdf
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val == 0)
      return 0; // colinear

    return (val > 0) ? 1 : 2; // clock or counterclock wise
  }

  static intersect(p1: Point, q1: Point, p2: Point, q2: Point): boolean {
    // Find the four orientations needed for general and
    // special cases
    const o1 = this._orientation(p1, q1, p2);
    const o2 = this._orientation(p1, q1, q2);
    const o3 = this._orientation(p2, q2, p1);
    const o4 = this._orientation(p2, q2, q1);

    // General case
    if (o1 != o2 && o3 != o4)
      return true;

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && this._onSegment(p1, p2, q1))
      return true;

    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && this._onSegment(p1, q2, q1))
      return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && this._onSegment(p2, p1, q2))
      return true;

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && this._onSegment(p2, q1, q2))
      return true;

    return false; // Doesn't fall in any of the above cases
  }
}

export class Plus implements IGraphics {
  constructor(
    public p: Point
  ) {}

  rect(): Rect {
    throw new Error('Not implemented');
  }

  // IGraphics

  [p: string]: any;

  readonly T: string;
  color: string;
  graphicsid: number;
  id: number;
  reject: any;
  selected: boolean;

  clone(map: any[]): IGraphics {
    throw new Error('Not implemented');
  }

  draw(surface: any, linewidth: number, m: any, fontsize: number): void {
    throw new Error('Not implemented');
  }
}

JSDraw2.Point = Point;
JSDraw2.Plus = Plus;
