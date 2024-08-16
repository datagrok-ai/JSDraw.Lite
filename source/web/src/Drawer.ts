//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw.Lite
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//
// (Released under LGPL 3.0: https://opensource.org/licenses/LGPL-3.0)
//
//////////////////////////////////////////////////////////////////////////////////

// // @ts-nocheck

import {Rect} from './Rect';
import {Point} from './Point';

import type {DojoxType} from './types/dojo';
import type {JSDraw2ModuleType, ScilModuleType} from './types';
import type {TextAlign} from './types/jsdraw2';

import {TextAligns} from './types/jsdraw2';

declare const dojox: DojoxType;

declare const scil: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType;


export type FormulaItemType = { num?: number | string, str: string, };

export class Drawer {
    kMinFontSize: number = 4;

    drawFormula(surface: any, p: Point, reversed: boolean, s: string, color: string, fontsize: number): Rect {
        //I#11940
        if (reversed) {
            const c = s.charAt(0);
            if (c >= '0' && c <= '9')
                reversed = false;
        }

        let rect = new JSDraw2.Rect();
        const ss = this.splitFormula(s);
        for (let i = 0; i < ss.length; ++i) {
            if (reversed) {
                if (ss[i].num != null) {
                    const r = this.drawWord(surface, rect, p, color, fontsize, ss[i].num as string, reversed, true);
                    if (rect.isEmpty())
                        rect = r;
                    else
                        rect.union(r);
                }
            }

            let r = this.drawWord(surface, rect, p, color, fontsize, ss[i].str, reversed, false);
            if (rect.isEmpty())
                rect = r;
            else
                rect.union(r);

            if (!reversed) {
                if (ss[i].num != null) {
                    r = this.drawWord(surface, rect, p, color, fontsize, ss[i].num as string, reversed, true);
                    if (rect.isEmpty())
                        rect = r;
                    else
                        rect.union(r);
                }
            }
        }

        return rect;
    }

    drawWord(surface: any, rect: Rect, p: Point, color: string, fontsize: number, w: string, reversed: boolean, isnumber: boolean): Rect {
        if (isnumber)
            fontsize /= 1.4;
        const n = this.drawLabel(surface, p, w, color, fontsize, false, reversed ? "end-anchor" : "start-anchor");
        const r = n._rect.clone();
        const nw = r.width / 2;

        let dx = 0;
        const dy = isnumber ? fontsize / 4 : 0;
        if (rect.isEmpty()) {
            // dx = -nw;
        } else if (reversed) {
            dx = -(p.x - rect.left) - nw;
            if (w == "I" || w == "i" || w == "l" || w == "r" || w == "f" || w == ".") {
                dx -= fontsize / 6.0;
                // r.width -= 4;
            }

            if (scil.Utils.isChrome)
                dx -= fontsize / 10.0;
        } else {
            dx = (rect.right() - p.x) + nw;
            if (w == "I" || w == "i" || w == "l" || w == "r" || w == "f" || w == ".") {
                dx += fontsize / 6.0;
                // r.width -= 4;
            }

            if (scil.Utils.isChrome)
                dx += fontsize / 10.0;
        }

        n.setTransform([dojox.gfx.matrix.translate(dx, dy)]);
        r.left += dx;
        r.top += dy;
        return r;
    }

    splitFormula(s: string): FormulaItemType[] {
        if (/^[A-Z]+$/.test(s) || /^[\(][^\(\)]+[\)]$/.test(s) || /^[\[][^\[\]]+[\]]$/.test(s))
            return [{str: s}];

        const ret: FormulaItemType[] = [];

        let bracket = 0;
        let number = false;
        let w = "";
        for (let i = 0; i < s.length; ++i) {
            const c = s.charAt(i);
            if (bracket > 0 || c == '(') {
                if (c == '(') {
                    if (bracket == 0) {
                        if (w != "") {
                            if (number && ret.length > 0)
                                ret[ret.length - 1].num = w;
                            else
                                ret.push({str: w});
                        }
                        number = false;
                        w = "";
                    }

                    ++bracket;
                } else if (c == ')') {
                    --bracket;
                }

                w += c;
                if (bracket == 0) {
                    ret.push({str: w});
                    w = "";
                }
            } else {
                if (c >= 'A' && c <= 'Z') {
                    if (w != "") {
                        if (number && ret.length > 0)
                            ret[ret.length - 1].num = w;
                        else
                            ret.push({str: w});
                    }
                    number = false;
                    w = "";
                } else if (c >= '0' && c <= '9' && !number) {
                    if (w != "")
                        ret.push({str: w});
                    number = true;
                    w = "";
                }
                w += c;
            }
        }

        if (w != "") {
            if (number && ret.length > 0)
                ret[ret.length - 1].num = w;
            else
                ret.push({str: w});
        }
        return ret;
    }

    drawCurveArrow(surface: any, p1: Point, p2: Point, p1a: Point, p2a: Point, color: string, linewidth: number): void {
        if (p1a == null || p2a == null) {
            const anchors = JSDraw2.Curve.calcAnchors(p1, p2);
            p1a = anchors.p1a;
            p2a = anchors.p2a;
        }

        surface.createPath("").moveTo(p1.x, p1.y)
          .curveTo(p1a.x, p1a.y, p2a.x, p2a.y, p2.x, p2.y)
          .setStroke({color: color, width: linewidth, cap: "round"});
        JSDraw2.Drawer.drawArrowhead(surface, p2a, p2, color, linewidth);
    }

    drawCurve(surface: any, p1: Point, p2: Point, deg: number, r: number, color: string, linewidth: number): void {
        const anchors = JSDraw2.Curve.calcAnchors(p1, p2, deg, r);
        const p1a = anchors.p1a;
        const p2a = anchors.p2a;

        surface.createPath("").moveTo(p1.x, p1.y)
          .curveTo(p1a.x, p1a.y, p2a.x, p2a.y, p2.x, p2.y)
          .setStroke({color: color, width: linewidth, cap: "round"});
    }

    drawArrow(surface: any, p1: Point, p2: Point, color: string, linewidth: number, dottedline?: number, arrowstyle?: string): void {
        if (arrowstyle == "dual") {
            const d = new JSDraw2.Point(p2.x - p1.x, p2.y - p1.y);
            let v = d.clone().rotate(90).setLength(linewidth);
            let tp1 = p1.clone().offset(d.x + v.x, d.y + v.y);
            let tp2 = p2.clone().offset(-d.x + v.x, -d.y + v.y);
            JSDraw2.Drawer.drawLine(surface, tp1, tp2, color, linewidth, dottedline);
            JSDraw2.Drawer.drawArrowhead2(surface, tp1, tp2, color, linewidth, "top");

            v = d.clone().rotate(-90).setLength(linewidth);
            tp1 = p1.clone().offset(d.x + v.x, d.y + v.y);
            tp2 = p2.clone().offset(-d.x + v.x, -d.y + v.y);
            JSDraw2.Drawer.drawLine(surface, tp1, tp2, color, linewidth, dottedline);
            JSDraw2.Drawer.drawArrowhead2(surface, tp2, tp1, color, linewidth, "top");
        } else if (arrowstyle == "reversible") {
            const d = new JSDraw2.Point(p2.x - p1.x, p2.y - p1.y);
            let v = d.clone().rotate(90).setLength(linewidth);
            let tp1 = p1.clone().offset(d.x * 0.6 + v.x, d.y * 0.6 + v.y);
            let tp2 = p2.clone().offset(-d.x + v.x, -d.y + v.y);
            JSDraw2.Drawer.drawLine(surface, tp1, tp2, color, linewidth, dottedline);
            JSDraw2.Drawer.drawArrowhead2(surface, tp1, tp2, color, linewidth, "top");

            v = d.clone().rotate(-90).setLength(linewidth);
            tp1 = p1.clone().offset(d.x + v.x, d.y + v.y);
            tp2 = p2.clone().offset(-d.x + v.x, -d.y + v.y);
            JSDraw2.Drawer.drawLine(surface, tp1, tp2, color, linewidth, dottedline);
            JSDraw2.Drawer.drawArrowhead2(surface, tp2, tp1, color, linewidth, "top");
        } else {
            if (arrowstyle == "solid") {
                const v = new JSDraw2.Point(p2.x - p1.x, p2.y - p1.y).setLength(linewidth * 4);
                JSDraw2.Drawer.drawLine(surface, p1, p2.clone().offset(-v.x, -v.y), color, linewidth, dottedline);
            } else {
                JSDraw2.Drawer.drawLine(surface, p1, p2, color, linewidth, dottedline);
            }
            JSDraw2.Drawer.drawArrowhead(surface, p1, p2, color, linewidth, arrowstyle);
        }
    }

    drawArrowhead(surface: any, p1: Point, p2: Point, color: string, linewidth: number, arrowstyle?: string): void {
        if (arrowstyle == "solid") {
            this.drawArrowhead2(surface, p1, p2, color, linewidth, arrowstyle);
        } else if (arrowstyle == "double") {
            this.drawArrowhead2(surface, p1, p2, color, linewidth);
            this.drawArrowhead2(surface, p2, p1, color, linewidth);
        } else if (arrowstyle == "none") {
        } else {
            this.drawArrowhead2(surface, p1, p2, color, linewidth);
        }
    }

    drawArrowhead2(surface: any, p1: Point, p2: Point, color: string, linewidth: number, as?: string) {
        const v = p1.clone().offset(-p2.x, -p2.y).setLength(linewidth * 7);
        const deg = v.angle();
        const v1 = v.clone().rotate(25);
        const v2 = v.clone().rotate(-25);
        const a1 = p2.clone().offset(v1.x, v1.y);
        const a2 = p2.clone().offset(v2.x, v2.y);

        if (as == "solid") {
            JSDraw2.Drawer.drawTriangle(surface, a1, p2, a2, color);
        } else if (as == "top") {
            JSDraw2.Drawer.drawLine(surface, a1, p2, color, linewidth);
        } else if (as == "bottom") {
            JSDraw2.Drawer.drawLine(surface, a2, p2, color, linewidth);
        } else {
            JSDraw2.Drawer.drawLine(surface, a1, p2, color, linewidth);
            JSDraw2.Drawer.drawLine(surface, a2, p2, color, linewidth);
        }
    }

    drawTriangle(surface: any, p1: Point, p2: Point, p3: Point, color: string): any {
        const t = surface.createPath("").moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).lineTo(p3.x, p3.y).lineTo(p1.x, p1.y);
        t.setFill(color);
        return t;
    }

    drawBracket(surface: any, r: Rect, color: string, linewidth: number, shape?: any): void {
        const m = linewidth * 3;
        const w = linewidth;

        switch (shape) {
        case "round":
            this.drawCurve(surface, r.topleft(), r.bottomleft(), -30, 0.3, color, linewidth);
            this.drawCurve(surface, r.topright(), r.bottomright(), 30, 0.3, color, linewidth);
            break;
        case "curly":
            break;
        default:
            JSDraw2.Drawer.drawLine(surface, r.topleft(), r.topleft().offset(m, 0), color, w);
            JSDraw2.Drawer.drawLine(surface, r.topleft(), r.bottomleft(), color, w);
            JSDraw2.Drawer.drawLine(surface, r.bottomleft(), r.bottomleft().offset(m, 0), color, w);

            JSDraw2.Drawer.drawLine(surface, r.topright(), r.topright().offset(-m, 0), color, w);
            JSDraw2.Drawer.drawLine(surface, r.topright(), r.bottomright(), color, w);
            JSDraw2.Drawer.drawLine(surface, r.bottomright(), r.bottomright().offset(-m, 0), color, w);
            break;
        }
    }

    drawDoubleArrow(surface: any, r: Rect, color: string, linewidth: number): void {
        const m = linewidth * 3;
        const w = linewidth;

        this.drawLine(surface, r.topleft(), r.topright(), color, w);
        this.drawArrow(surface, r.topleft(), r.bottomleft(), color, w);
        this.drawArrow(surface, r.topright(), r.bottomright(), color, w);
    }

    drawLabel(
      surface: any, p: Point, s: string | null, fontcolor: string | null, fontsize: number,
      opaque: string | boolean | null, align?: string | null, offsetx?: number | null, stroke?: boolean
    ): any {
        const w = fontsize + 2;
        if (opaque) {
            const r = new JSDraw2.Rect(p.x - w / 2, p.y - w / 2, w, w);
            surface.createRect({x: r.left, y: r.top, width: r.width, height: r.height})
              .setFill(opaque == true ? "#fff" : opaque);
        }

        let x = p.x + (offsetx == null ? 0 : offsetx);
        const y = p.y + w / 2 - 2;
        if (align == "start-anchor") {
            align = "start";
            x -= fontsize * 0.4;
        }
        if (align == "end-anchor") {
            align = "end";
            x += fontsize * 0.4;
            // s = JSDraw2.SuperAtoms.reverseLabel(s);
        }
        const args = {x: x, y: y, text: s, align: align == null ? "middle" : align};
        let t: any = null;
        if (dojox.gfx.renderer == "canvas") {
            t = surface.createText(args);
            t.shape.fontStyle = "bold " + (fontsize < this.kMinFontSize ? this.kMinFontSize : fontsize) /*Mac,Linux bug*/ + "px Arial";
            t.shape.fillStyle = fontcolor;
            t.shape.align = "center";

            t.mwidth = this.getTextWidth(surface, t);
            t.getTextWidth = function() { return t.mwidth; };
        } else {
            t = surface.createText(args)
              .setFont({family: "Arial", size: (fontsize < this.kMinFontSize ? this.kMinFontSize : fontsize) /*Mac,Linux bug*/ + "px", weight: "normal"})
              .setFill(fontcolor);
            if (stroke != false)
                t.setStroke(fontcolor);
        }

        // space char causes hang-up issue
        if (/^[ ]+$/.test(s!))
            t._rect = new JSDraw2.Rect(x, y, s!.length * fontsize / 2, fontsize + 4);
        else
            t._rect = new JSDraw2.Rect(x, y, t.getTextWidth(), fontsize + 4);

        t._rect.top -= t._rect.height * 0.8;
        if (align == "end")
            t._rect.left -= t._rect.width;
        return t;
    }

    drawText2(surface: any, p: Point, s: string, fontcolor: string, fontsize: number, rotatedeg: number): any {
        const w = fontsize + 2;
        let t: any = null;
        if (dojox.gfx.renderer == "canvas") {
            t = surface.createText({x: p.x, y: p.y + w / 2 - 2, text: s});
            t.shape.fontStyle = "bold " + (fontsize < this.kMinFontSize ? this.kMinFontSize : fontsize) /*Mac,Linux bug*/ + "px Arial";
            t.shape.fillStyle = fontcolor;
            t.shape.align = "center";

            t.mwidth = this.getTextWidth(surface, t);
            t.getTextWidth = function() { return t.mwidth; };
        } else {
            t = surface.createText({x: p.x, y: p.y + w / 2 - 2, text: s, align: "middle"})
              .setFont({family: "Arial", size: (fontsize < this.kMinFontSize ? this.kMinFontSize : fontsize) /*Mac,Linux bug*/ + "px", weight: "normal"})
              .setFill(fontcolor);
        }
        if (rotatedeg != null)
            t.setTransform([dojox.gfx.matrix.rotateAt(rotatedeg, p.x, p.y)]);
        return t;
    }

    drawText(surface: any, p: Point, s: string, fontcolor: string, fontsize: number, align?: TextAlign | null, italic?: boolean): any {
        if (align == null)
            align = TextAligns.left;

        let t: any = null;
        if (dojox.gfx.renderer == "canvas") {
            t = surface.createText({x: p.x, y: p.y + fontsize + 2, text: s});
            t.shape.fontStyle = (fontsize < this.kMinFontSize ? this.kMinFontSize : fontsize) /*Mac,Linux bug*/ + "px Arial";
            t.shape.fillStyle = fontcolor;
            t.shape.align = align;

            t.mwidth = this.getTextWidth(surface, t);
            t.getTextWidth = function() { return t.mwidth; };
        } else {
            const font: any = {family: "Arial", size: (fontsize < this.kMinFontSize ? this.kMinFontSize : fontsize) /*Mac,Linux bug*/ + "px", weight: "normal"};
            if (italic)
                font.style = "italic";
            t = surface.createText({x: p.x, y: p.y + fontsize + 2, text: s, align: align})
              .setFont(font)
              .setFill(fontcolor);
        }

        if (align == "right") {
            const w = t.getTextWidth();
            t.setTransform([dojox.gfx.matrix.translate(-w, 0)]);
        }
        return t;
    }

    getTextWidth(surface: any, s: any): number {
        const ctx = surface.surface.rawNode.getContext('2d');
        ctx.save();
        ctx.fillStyle = s.fillStyle;
        ctx.strokeStyle = s.fillStyle;
        ctx.font = s.fontStyle;
        ctx.textAlign = "center";
        //ctx.textBaseline = "bottom";
        const width = ctx.measureText(s.text).width / 6;
        ctx.restore();
        return width;
    }

    drawBasis(surface: any, p1: Point, p2: Point, color: string, linewidth: number): void {
        this.drawLine(surface, p1, p2, color, linewidth);

        const d = new JSDraw2.Point(p2.x - p1.x, p2.y - p1.y).scale(1.0 / 6.0);
        const p = p1.clone().offset(-d.x * 0.5, -d.y * 0.5);
        for (let i = 0; i < 5; ++i) {
            p.offset(d.x, d.y);
            const t = p.clone().offset(d.x * 1.25, d.y * 1.25);
            t.rotateAround(p, -45);

            this.drawLine(surface, p, t, color, linewidth);
        }
    }

    drawCurves(surface: any, p1: Point, p2: Point, color: string, linewidth: number): void {
        const path = surface.createPath();
        path.moveTo(p1.x, p1.y);

        const len = p1.distTo(p2);
        const n = Math.floor(len / linewidth);
        const d = new JSDraw2.Point(p2.x - p1.x, p2.y - p1.y).scale(1.0 / n);
        const v = new JSDraw2.Point(p2.x - p1.x, p2.y - p1.y).rotate(90).setLength(linewidth * 2);
        for (let k = 1; k <= n; k += 2) {
            const p = p1.clone().offset(d.x * k, d.y * k);
            const t1 = p.clone().offset(d.x, d.y);
            if (((k - 1) / 2) % 2 == 1)
                p.offset(v.x, v.y);
            else
                p.offset(-v.x, -v.y);
            path.qCurveTo(p.x, p.y, t1.x, t1.y);
        }
        path.setStroke({color: color, width: linewidth});
    }

    drawLine(surface: any, p1: Point, p2: Point, color: string, linewidth: number, dotline?: number | null, cap?: string): any {
        if (linewidth == null)
            linewidth = 1;

        if (dotline == null || dotline <= 1) {
            return surface.createLine({x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y})
              .setStroke({color: color, width: linewidth, cap: cap == null ? "round" : cap});
        } else {
            const len = p1.distTo(p2);
            let n = Math.floor(len / dotline);
            if (n % 2 == 0)
                --n;

            const d = p2.clone().offset(-p1.x, -p1.y).scale(1.0 / n);
            const d2 = d.clone().scale(0.3);
            const st = new JSDraw2.Point(((p2.x - p1.x) - d.x * n) / 2, ((p2.y - p1.y) - d.y * n) / 2);

            for (let k = 0; k < n; k += 2) {
                const t1 = p1.clone().offset(st.x + d.x * k + d2.x, st.y + d.y * k + d2.y);
                const t2 = t1.clone().offset(d.x - d2.x, d.y - d2.y);
                surface.createLine({x1: t1.x, y1: t1.y, x2: t2.x, y2: t2.y})
                  .setStroke({color: color, width: linewidth, cap: cap == null ? "round" : cap});
            }
        }
    }

    drawRect(surface: any, r: Rect, color: string, linewidth: number, radius?: number, style?: any): any {
        if (r == null || r.isEmpty())
            return;
        const opts: any = {x: r.left, y: r.top, width: r.width, height: r.height};
        if (radius != null)
            opts.r = radius;
        if (style != null)
            opts.style = style;
        return surface.createRect(opts).setStroke({color: color, width: linewidth});
    }

    drawDShape(surface: any, r: Rect, color: string, linewidth: number, reverse?: boolean): any {
        const rad = r.height / 2;
        const x = r.right() - rad;
        const y = r.center().y;
        const path = surface.createPath()
          .moveTo({x: x, y: r.top})
          .arcTo(rad, rad, 0, false, true, this._calcPoint(x, y, rad, 180 / 2))
          .arcTo(rad, rad, 0, false, true, this._calcPoint(x, y, rad, 180))
          .lineTo({x: r.left, y: r.bottom()})
          .lineTo({x: r.left, y: r.top})
          .lineTo({x: x, y: r.top})
          .closePath()
          .setStroke({color: color, width: linewidth});

        if (reverse)
            path.setTransform([dojox.gfx.matrix.rotateAt(Math.PI, r.center().x, y)]);
        return path;
    }

    _calcPoint(x: number, y: number, rad: number, deg: number): { x: number, y: number } {
        deg = (Math.PI / 180) * (360 - deg);
        return {
            x: Math.round((rad * -Math.sin(deg)) + x), y: Math.round(y - (rad * Math.cos(deg)))
        };
    }

    drawEllipse(surface: any, r: Rect, color: string, linewidth: number): any {
        const c = r.center();
        return surface.createEllipse({cx: c.x, cy: c.y, rx: r.width / 2, ry: r.height / 2}).setStroke({color: color, width: linewidth});
    }

    drawPie(surface: any, x: number, y: number, r: number, deg1: number, deg2: number): any {
        const calcPoint = function(deg: number) {
            deg = (Math.PI / 180) * (360 - deg);
            return {
                x: Math.round((r * -Math.sin(deg)) + x), y: Math.round(y - (r * Math.cos(deg)))
            };
        };
        return surface.createPath()
          .moveTo({x: x, y: y})
          .lineTo(calcPoint(deg1))
          .arcTo(r, r, 0, false, true, calcPoint(deg2 / 2))
          .arcTo(r, r, 0, false, true, calcPoint(deg2))
          .lineTo({x: x, y: y})
          .closePath()
          .setFill("#535353");
    }

    drawDiamond(surface: any, r: Rect, color: string, linewidth: number): any {
        const c = r.center();
        const points = [
            {x: c.x, y: r.top},
            {x: r.right(), y: c.y},
            {x: c.x, y: r.bottom()},
            {x: r.left, y: c.y},
            {x: c.x, y: r.top}
        ];
        return surface.createPolyline(points).setStroke({color: color, width: linewidth});
    }

    drawHexgon(surface: any, r: Rect, color: string, linewidth: number): any {
        const c = r.center();
        const d = new JSDraw2.Point(0, r.width / 2);
        d.rotate(-30);
        const points = [
            {x: r.right(), y: c.y},
            {x: c.x + d.x, y: c.y - d.y},
            {x: c.x - d.x, y: c.y - d.y},
            {x: r.left, y: c.y},
            {x: c.x - d.x, y: c.y + d.y},
            {x: c.x + d.x, y: c.y + d.y},
            {x: r.right(), y: c.y}
        ];
        return surface.createPolyline(points).setStroke({color: color, width: linewidth});
    }

    drawPentagon(surface: any, r: Rect, color: string, linewidth: number): any {
        const c = r.center();
        const p1 = c.clone().offset(0, -r.width / 2);
        const p2 = p1.clone().rotateAround(c, 72);
        const p3 = p2.clone().rotateAround(c, 72);
        const p4 = p3.clone().rotateAround(c, 72);
        const p5 = p4.clone().rotateAround(c, 72);

        const points = [
            {x: p1.x, y: p1.y},
            {x: p2.x, y: p2.y},
            {x: p3.x, y: p3.y},
            {x: p4.x, y: p4.y},
            {x: p5.x, y: p5.y},
            {x: p1.x, y: p1.y},
        ];
        return surface.createPolyline(points).setStroke({color: color, width: linewidth});
    }
}

JSDraw2.Drawer = new Drawer();
