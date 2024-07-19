﻿//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw.Lite
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//
// (Released under LGPL 3.0: https://opensource.org/licenses/LGPL-3.0)
//
//////////////////////////////////////////////////////////////////////////////////

import type {ScilModuleType} from './types/scil';
import type {DojoType, DojoxType} from './types/dojo';
import type {OrgType} from './types/org';

import type {Point} from './Point';
import type {Atom} from './Atom';
import type {Mol} from './Mol';
import type {BondType, ILasso, JSDraw2ModuleType, RxnCenterType, IObjWithId} from './types/jsdraw2';

declare const dojo: DojoType;
declare const dojox: DojoxType;

declare const scil: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType<any>;
declare const org: OrgType<any>;

export type PosRType = { pos: string, r: string };
export type BondAnnotationType = { ba1: string, ba2: string };

/**
 * Bond class
 * @class scilligence.JSDraw2.Bond
 */
export class Bond<TBio> implements IObjWithId {
  /**
   @property {Atom} a1 The First Atom
   */
  /**
   @property {Atom} a2 The Second Atom
   */
  /**
   @property {BONDTYPES} type Bond Type
   */
  /**
   @property {string} color Display Color
   */
  /**
   @property {bool} selected Selecting Flag
   */
  private T: string;
  public id!: number | null;
  public a1: Atom<TBio>;
  public a2: Atom<TBio>;
  public apo1: number | null;
  public apo2: number | null;
  public color: string | null;
  public ring: boolean | null;
  public order: number | null;
  public rcenter: RxnCenterType | null;
  public selected: boolean;
  public tag: string | null;
  public f: number | null;
  public r1: number | string | null;
  public r2: number | string | null;
  public ratio1: number | string | null;
  public ratio2: number | string | null;
  public type: BondType;

  public _parent!: Mol<TBio>;
  private z?: number;
  public bondid?: number;
  public group: any;

  /**
   * @constructor Bond
   * @param {Atom} a1 - the first atom
   * @param {Atom} a2 - the second atom
   * @param {BONDTYPES} type - bond type
   */
  constructor(a1: Atom<TBio>, a2: Atom<TBio>, type?: BondType) {
    this.T = "BOND";
    this.a1 = a1;
    this.a2 = a2;
    this.apo1 = null;
    this.apo2 = null;
    this.color = null;
    this.ring = null;
    this.order = null;
    this.rcenter = null;
    this.selected = false;
    this.tag = null;
    this.f = null;
    this.r1 = null;
    this.r2 = null;
    this.ratio1 = null;
    this.ratio2 = null;
    this.type = type == null ? JSDraw2.BONDTYPES.SINGLE : type;
  }

  clone(): Bond<TBio> {
    const b: Bond<TBio> = new JSDraw2.Bond(this.a1, this.a2, this.type);
    b.id = this.id;
    b.color = this.color;
    b.order = this.order;
    b.apo1 = this.apo1;
    b.apo2 = this.apo2;
    b.ring = this.ring;
    b.rcenter = this.rcenter;
    b._parent = this._parent;
    b.r1 = this.r1;
    b.r2 = this.r2;
    b.ratio1 = this.ratio1;
    b.ratio2 = this.ratio2;
    b.z = this.z;
    b.tag = this.tag;
    b.selected = this.selected;
    return b;
  }

  replaceAtom(old: Atom<TBio>, na: Atom<TBio>): boolean {
    if (this.a1 == old)
      this.a1 = na;
    else if (this.a2 == old)
      this.a2 = na;
    else
      return false;
    return true;
  }

  isBio() {
    return this.type == JSDraw2.BONDTYPES.PEPTIDE || this.type == JSDraw2.BONDTYPES.NUCLEOTIDE;
  }

  bondLength() {
    return this.a1.p.distTo(this.a2.p);
  }

  center() {
    return new JSDraw2.Point((this.a1.p.x + this.a2.p.x) / 2, (this.a1.p.y + this.a2.p.y) / 2);
  }

  angle() {
    return this.vector().angle();
  }

  vector() {
    return new JSDraw2.Point(this.a2.p.x - this.a1.p.x, this.a2.p.y - this.a1.p.y);
  }

  /**
   * Get the other Atom of the Bond
   * @function otherAtom
   * @param {Atom} a - one atom on the bond
   * @returns the other Atom
   */
  otherAtom(a: Atom<TBio>): Atom<TBio> | null {
    if (this.a1 == a)
      return this.a2;
    else if (this.a2 == a)
      return this.a1;
    return null;
  }

  /**
   * Switch the atoms' order
   * @function reverse
   * @returns null
   */
  reverse() {
    const a = this.a1;
    this.a1 = this.a2;
    this.a2 = a;

    const apo = this.apo1;
    this.apo1 = this.apo2;
    this.apo2 = apo;
  }

  valence(): number | null {
    switch (this.type) {
    case JSDraw2.BONDTYPES.SINGLE:
    case JSDraw2.BONDTYPES.WEDGE:
    case JSDraw2.BONDTYPES.HASH:
    case JSDraw2.BONDTYPES.WIGGLY:
    case JSDraw2.BONDTYPES.PEPTIDE:
    case JSDraw2.BONDTYPES.NUCLEOTIDE:
    case JSDraw2.BONDTYPES.DISULFIDE:
    case JSDraw2.BONDTYPES.AMIDE:
    case JSDraw2.BONDTYPES.BOLD:
    case JSDraw2.BONDTYPES.BOLDHASH:
      return 1;
    case JSDraw2.BONDTYPES.DELOCALIZED:
      return 1.5;
    case JSDraw2.BONDTYPES.DOUBLE:
    case JSDraw2.BONDTYPES.EITHER:
      return 2;
    case JSDraw2.BONDTYPES.TRIPLE:
      return 3;
    case JSDraw2.BONDTYPES.UNKNOWN:
    case JSDraw2.BONDTYPES.DUMMY:
      return 0;
    default:
      return null;
    }
  }

  _centerDoubleBond(m: Mol<TBio>, b: BondB<TBio>): boolean {
    const atoms1 = m.getNeighborAtoms(b.a1, b.a2);
    const atoms2 = m.getNeighborAtoms(b.a2, b.a1);
    return atoms1.length == 0 && atoms2.length == 2 || atoms2.length == 0 && atoms1.length == 2;
  }

  _shirftDirection(m: Mol<TBio>, b: BondB<TBio>) {
    let a1 = null;
    let a2 = null;
    const atoms1 = m.getNeighborAtoms(b.a1, b.a2, true);
    if (atoms1.length == 1)
      a1 = atoms1[0];

    if (a1 == null) {
      const atoms2 = m.getNeighborAtoms(b.a2, b.a1, true);
      if (atoms2.length == 1)
        a2 = atoms2[0];

      if (a2 == null) {
        if (atoms1.length >= 2 && atoms2.length >= 2) {
          if (m._hasDoubleBonds(atoms1[0]))
            a1 = atoms1[0];
          else if (m._hasDoubleBonds(atoms1[1]))
            a1 = atoms1[1];

          if (m._hasDoubleBonds(atoms2[0]))
            a2 = atoms2[0];
          else if (m._hasDoubleBonds(atoms2[1]))
            a2 = atoms2[1];
        }
      }
    }

    if (a1 != null) {
      const ang = b.p1.angleAsOrigin(b.p2, a1.p);
      return ang <= 180;
    }

    if (a2 != null) {
      const ang = b.p2.angleAsOrigin(a2.p, b.p1);
      return ang <= 180;
    }
  }

  html() {
    let s = "<b i='" + this.id + "' a1='" + this.a1.id + "' a2='" + this.a2.id + "' t='" + this.type + "'";
    if (this.ring != null)
      s += " ring='" + (this.ring ? 1 : 0) + "'";
    if (this.rcenter != null)
      s += " rcenter='" + this.rcenter + "'";
    if (this.color != null)
      s += " clr='" + this.color + "'";
    if (!scil.Utils.isNullOrEmpty(this.r1 as string))
      s += " r1='" + this.r1 + "'";
    if (!scil.Utils.isNullOrEmpty(this.r2 as string))
      s += " r2='" + this.r2 + "'";
    if (this.apo1! > 0 && this.a1.superatom != null)
      s += " apo1='" + this.apo1 + "'";
    if (this.apo2! > 0 && this.a2.superatom != null)
      s += " apo2='" + this.apo2 + "'";
    if (this.tag != null)
      s += " tag='" + scil.Utils.escXmlValue(this.tag) + "'";
    s += "/>";
    return s;
  }

  readHtml(e: HTMLElement) {
    const r = e.getAttribute("clr");
    if (r != null)
      this.color = r;

    const tag = e.getAttribute("tag");
    if (tag != null && tag != "")
      this.tag = tag;
  }

  toggle(p: Point, tor: number) {
    return p.onLine(this.a1.p, this.a2.p, tor / 5);
  }

  drawCur(surface: any, r: number, color: string) {
    const p = this.center();
    surface.createCircle({cx: p.x, cy: p.y, r: r}).setFill(color);
  }

  _drawBond(surface: any, b: any, color: string, linewidth: number, shrink?: number | null, shift?: number | null, dotline?: number | null, gap?: any, cap?: any): void {
    if (shrink == null || shrink == 0) {
      JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, color, linewidth, dotline, cap);
    } else {
      const d = shift == 0 ? new JSDraw2.Point(0, 0) : b.vector().scale(1.0 / Math.abs(shift!));
      const v = b.vector().rotate(shrink > 0 ? 90 : -90).setLength(gap == null ? linewidth * 2 : gap);
      JSDraw2.Drawer.drawLine(surface, b.p1.clone().offset(d.x + v.x, d.y + v.y), b.p2.clone().offset(-d.x + v.x, -d.y + v.y), color, linewidth, dotline, cap);
    }
  }

  getRColor(c: string, r: number): string {
    if (!scil.Utils.isNullOrEmpty(this.color))
      return c;
    switch (r) {
    case 1:
      return "#641E16";
    case 2:
      return "#0000ff";
    case 3:
      return "#aaaaaa";
    }
    return "black";
  }

  splitPosR(s: any): PosRType {
    if (!scil.Utils.isNullOrEmpty(s)) {
      const s2 = s == "?" ? "?:?" : s + "";
      const p = s2.indexOf(':');
      if (p >= 0) {
        const pos = s2.substr(0, p);
        const r = s2.substr(p + 1);
        return {pos: (pos == "" ? "?" : pos), r: (r == "" ? "?" : r)};
      }
    }

    return {pos: "?", r: "?"};
  }

  _fmtBondAnn(): BondAnnotationType {
    let s1 = "";
    let s2 = "";

    const r1 = this.splitPosR(this.r1);
    const r2 = this.splitPosR(this.r2);
    if (r1.pos != "?" || r2.pos != "?") {
      s1 += (s1 == "" ? "" : "; ") + "Pos: " + r1.pos;
      s2 += (s2 == "" ? "" : "; ") + "Pos: " + r2.pos;
    }
    if (r1.r != "?" || r2.r != "?") {
      s1 += (s1 == "" ? "" : "; ") + "R#: " + r1.r;
      s2 += (s2 == "" ? "" : "; ") + "R#: " + r2.r;
    }

    const defaultratio = org.helm.webeditor.defaultbondratio == null ? "" : org.helm.webeditor.defaultbondratio;
    const ratio1 = scil.Utils.isNullOrEmpty(this.ratio1 as string) ? defaultratio : this.ratio1;
    const ratio2 = scil.Utils.isNullOrEmpty(this.ratio2 as string) ? defaultratio : this.ratio2;
    if (ratio1 != defaultratio || ratio2 != defaultratio /* https://github.com/PistoiaHELM/HELMWebEditor/issues/148 */) {
      s1 += (s1 == "" ? "" : "; ") + "Ratio: " + ratio1;
      s2 += (s2 == "" ? "" : "; ") + "Ratio: " + ratio2;
    }

    return {ba1: s1, ba2: s2};
  }

  drawBondAnnotation(surface: any, fontsize: number, b: BondB<TBio>) {
    const s = this._fmtBondAnn();
    const ba1 = s.ba1;
    const ba2 = s.ba2;
    if (ba1 == "" && ba2 == "")
      return;

    const dx = (b.p1.x - b.p2.x) / 90;
    const dy = (b.p1.y - b.p2.y) / 90;
    const c1 = new JSDraw2.Point((b.p1.x + b.p2.x) / 2, (b.p1.y + b.p2.y) / 2);
    const c2 = c1.clone();

    if (Math.abs(b.a1.p.x - b.a2.p.x) < fontsize) {
      //vertical
      c1.offset(fontsize * dx + fontsize * 0.2, fontsize * dy - fontsize * 0.5);
      c2.offset(-fontsize * dx + fontsize * 0.2, -fontsize * dy - fontsize * 0.5);
      if (!scil.Utils.isNullOrEmpty(ba1))
        JSDraw2.Drawer.drawText(surface, c1, ba1, "green", fontsize);
      if (!scil.Utils.isNullOrEmpty(ba2))
        JSDraw2.Drawer.drawText(surface, c2, ba2, "green", fontsize);
    } else if (Math.abs(b.a1.p.y - b.a2.p.y) < fontsize) {
      //horizontal
      c1.offset(fontsize * dx, fontsize * dy - fontsize * 0.9);
      c2.offset(-fontsize * dx, -fontsize * dy + fontsize * 0.6);
      if (!scil.Utils.isNullOrEmpty(ba1))
        JSDraw2.Drawer.drawLabel(surface, c1, ba1, "green", fontsize, null, null, null, false);
      if (!scil.Utils.isNullOrEmpty(ba2))
        JSDraw2.Drawer.drawLabel(surface, c2, ba2, "green", fontsize, null, null, null, false);
    } else {
      c1.offset(fontsize * dx, fontsize * dy);
      c2.offset(-fontsize * dx, -fontsize * dy);
      if (!scil.Utils.isNullOrEmpty(ba1))
        JSDraw2.Drawer.drawLabel(surface, c1, ba1, "green", fontsize, null, null, null, false);
      if (!scil.Utils.isNullOrEmpty(ba2))
        JSDraw2.Drawer.drawLabel(surface, c2, ba2, "green", fontsize, null, null, null, false);
    }
  }

  draw(surface: any, linewidth: number, m: Mol<TBio>, fontsize: number, simpledraw: boolean, drawStep: number) {
    if (this.type == JSDraw2.BONDTYPES.DUMMY) {
      if ((this.a1.elem == "@" || this.a2.elem == "@") && !this.a1.p.equalsTo(this.a2.p))
        JSDraw2.Drawer.drawLine(surface, this.a1.p, this.a2.p, "#eee", linewidth / 2);
      return;
    }

    if (this.a1.p.equalsTo(this.a2.p))
      return;

    const b = new JSDraw2.BondB(this);
    if (!simpledraw) {
      if (b.a1._haslabel)
        b.p1.shrink(b.p2, fontsize * 0.6);
      if (b.a2._haslabel)
        b.p2.shrink(b.p1, fontsize * 0.6);
    }

    const color = scil.Utils.isNullOrEmpty(this.color) ? "black" : this.color!;
    switch (drawStep) {
    case 0: {
      const hlColor = '#FFB2B2';
      if (simpledraw || b.type == JSDraw2.BONDTYPES.PEPTIDE || b.type == JSDraw2.BONDTYPES.AMIDE) {
        JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, hlColor, 5);
        return;
      } else if (b.type == JSDraw2.BONDTYPES.DISULFIDE) {
        JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, hlColor, 5);
        return;
      } else if (b.type == JSDraw2.BONDTYPES.NUCLEOTIDE) {
        JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, hlColor, 5);
        return;
      }
    }
    case 1: {
      const selColor = '#F8F8DD';
      if (simpledraw || b.type == JSDraw2.BONDTYPES.PEPTIDE || b.type == JSDraw2.BONDTYPES.AMIDE) {
        JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, selColor, 7);
        return;
      } else if (b.type == JSDraw2.BONDTYPES.DISULFIDE) {
        JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, selColor, 7);
        return;
      } else if (b.type == JSDraw2.BONDTYPES.NUCLEOTIDE) {
        JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, selColor, 7);
        return;
      }
    }
    case 2: {
      if (simpledraw || b.type == JSDraw2.BONDTYPES.PEPTIDE || b.type == JSDraw2.BONDTYPES.AMIDE) {
        JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, color, linewidth);
        return;
      } else if (b.type == JSDraw2.BONDTYPES.DISULFIDE) {
        JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, color, linewidth);
        return;
      } else if (b.type == JSDraw2.BONDTYPES.NUCLEOTIDE) {
        JSDraw2.Drawer.drawLine(surface, b.p1, b.p2, color, linewidth);
        return;
      }
      break;
    }
    }

    if ((this.r1 as number) > 0 || (this.r2 as number) > 0) {
      const c = new JSDraw2.Point((b.p1.x + b.p2.x) / 2, (b.p1.y + b.p2.y) / 2);
      const color1 = this.getRColor(this.color!, this.r1 as number);
      const color2 = this.getRColor(this.color!, this.r2 as number);
      if (this.z) {
        const p1 = new JSDraw2.Point(b.p1.x, c.y);
        const p2 = new JSDraw2.Point(b.p2.x, c.y);
        JSDraw2.Drawer.drawLine(surface, b.p1, p1, color1, linewidth, null, "butt");
        JSDraw2.Drawer.drawLine(surface, p1, c, color1, linewidth, null, "butt");
        JSDraw2.Drawer.drawLine(surface, c, p2, color2, linewidth, null, "butt");
        JSDraw2.Drawer.drawLine(surface, p2, b.p2, color2, linewidth, null, "butt");
      } else {
        JSDraw2.Drawer.drawLine(surface, b.p1, c, color1, linewidth, null, "butt");
        JSDraw2.Drawer.drawLine(surface, c, b.p2, color2, linewidth, null, "butt");
        if (this.r1 == 1 && this.r2 == 2 || this.r1 == 2 && this.r2 == 1) {
          JSDraw2.Bond.showHelmAnnotation<TBio>(this.a1, this.a2, this.r1);
          JSDraw2.Bond.showHelmAnnotation<TBio>(this.a2, this.a1, this.r2);
        }
      }
      return;
    }

    if (!simpledraw)
      this.drawBondAnnotation(surface, fontsize, b);

    let dir = 8;
    if (b.type == JSDraw2.BONDTYPES.DOUBLE || b.type == JSDraw2.BONDTYPES.DELOCALIZED || b.type == JSDraw2.BONDTYPES.EITHER || b.type == JSDraw2.BONDTYPES.DOUBLEORAROMATIC)
      dir = this._shirftDirection(m, b) ? 8 : -8;

    if (b.type == JSDraw2.BONDTYPES.DOUBLE && this._centerDoubleBond(m, b)) {
      this._drawBond(surface, b, color, linewidth, -dir, 0, null, linewidth);
      this._drawBond(surface, b, color, linewidth, dir, 0, null, linewidth);
    } else if (b.type == JSDraw2.BONDTYPES.SINGLE || b.type == JSDraw2.BONDTYPES.BOLD || b.type == JSDraw2.BONDTYPES.DOUBLE || b.type == JSDraw2.BONDTYPES.TRIPLE || b.type == JSDraw2.BONDTYPES.DELOCALIZED) {
      this._drawBond(surface, b, color, b.type == JSDraw2.BONDTYPES.BOLD ? 3 * linewidth : linewidth, null, null, null, null, b.type == JSDraw2.BONDTYPES.BOLD ? "butt" : "round");

      if (b.type == JSDraw2.BONDTYPES.DOUBLE || b.type == JSDraw2.BONDTYPES.TRIPLE)
        this._drawBond(surface, b, color, linewidth, dir, dir);

      if (b.type == JSDraw2.BONDTYPES.TRIPLE)
        this._drawBond(surface, b, color, linewidth, -dir, -dir);

      if (b.type == JSDraw2.BONDTYPES.DELOCALIZED)
        this._drawBond(surface, b, color, linewidth, dir, dir, 4);
    }

    if (b.type == JSDraw2.BONDTYPES.WEDGE) {
      const v = b.vector().rotate(90).setLength(linewidth * 2);
      surface.createPolyline([
        b.p1.x, b.p1.y,
        b.p2.x + v.x, b.p2.y + v.y,
        b.p2.x - v.x, b.p2.y - v.y
      ])
        .setStroke({width: 2})
        .setFill(color);
    }

    if (b.type == JSDraw2.BONDTYPES.HASH || b.type == JSDraw2.BONDTYPES.BOLDHASH) {
      const len = b.bondLength();
      const n = Math.floor(len / (linewidth * 2));
      const d = b.vector().scale(1.0 / n);
      const v = b.vector().rotate(90);
      for (let k = 1; k <= n; ++k) {
        const p = b.p1.clone().offset(d.x * k, d.y * k);
        let vlen = linewidth * 2;
        if (b.type == JSDraw2.BONDTYPES.HASH)
          vlen *= k / n;
        else
          vlen *= 0.6;
        const vi = v.clone().setLength(vlen);
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(vi.x, vi.y), p.clone().offset(-vi.x, -vi.y), color, linewidth);
      }
    }

    if (b.type == JSDraw2.BONDTYPES.WIGGLY)
      JSDraw2.Drawer.drawCurves(surface, b.p1, b.p2, color, linewidth);

    if (b.type == JSDraw2.BONDTYPES.EITHER) {
      const d = b.vector().scale(1.0 / Math.abs(dir));
      const v = b.vector().rotate(dir > 0 ? 90 : -90).setLength(linewidth * 2);
      const p1 = b.p1.clone().offset(d.x + v.x, d.y + v.y);
      const p2 = b.p2.clone().offset(-d.x + v.x, -d.y + v.y);
      JSDraw2.Drawer.drawLine(surface, b.p1, p2, color, linewidth);
      JSDraw2.Drawer.drawLine(surface, b.p2, p1, color, linewidth);
    }

    if (b.type == JSDraw2.BONDTYPES.DOUBLEORAROMATIC) {
      this._drawBond(surface, b, color, linewidth);
      this._drawBond(surface, b, color, linewidth, dir, dir, 2);
    }

    if (b.type == JSDraw2.BONDTYPES.SINGLEORDOUBLE || b.type == JSDraw2.BONDTYPES.SINGLEORAROMATIC) {
      this._drawBond(surface, b, color, linewidth, 0, 0, 2);

      this._drawBond(surface, b, color, linewidth, dir / 2, dir / 2, null, linewidth * 1.5);
      this._drawBond(surface, b, color, linewidth, -dir / 2, -dir / 2, b.type == JSDraw2.BONDTYPES.SINGLEORAROMATIC ? 2 : null, linewidth * 1.5);
    }

    if (b.type == JSDraw2.BONDTYPES.UNKNOWN)
      this._drawBond(surface, b, color, linewidth, null, null, linewidth * 1.2);

    if (b.b.ring != null) {
      const p = this.center();
      surface.createCircle({cx: p.x, cy: p.y, r: linewidth * 3})
        .setStroke({color: color, width: linewidth / 2, style: b.b.ring ? "Solid" : "Dash"});
    }

    if (b.b.rcenter != null) {
      const p = this.center();
      let d = b.vector().rotate(90).setLength(linewidth * 3);
      let v = b.vector().setLength(linewidth * (b.b.rcenter == JSDraw2.RXNCENTER.BREAKANDCHANGE ? 1.5 : 1));
      if (b.b.rcenter == JSDraw2.RXNCENTER.CENTER) {
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x + v.x, d.y + v.y), p.clone().offset(-d.x + v.x, -d.y + v.y), color, linewidth / 2);
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x - v.x, d.y - v.y), p.clone().offset(-d.x - v.x, -d.y - v.y), color, linewidth / 2);
        d = b.vector().rotate(90).setLength(linewidth * 1.6);
        v = b.vector().setLength(linewidth * 2);
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x + v.x, d.y + v.y), p.clone().offset(d.x - v.x, d.y - v.y), color, linewidth / 2);
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(-d.x + v.x, -d.y + v.y), p.clone().offset(-d.x - v.x, -d.y - v.y), color, linewidth / 2);
      } else if (b.b.rcenter == JSDraw2.RXNCENTER.NOTCENTER) {
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x + v.x, d.y + v.y), p.clone().offset(-d.x - v.x, -d.y - v.y), color, linewidth / 2);
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x - v.x, d.y - v.y), p.clone().offset(-d.x + v.x, -d.y + v.y), color, linewidth / 2);
      } else if (b.b.rcenter == JSDraw2.RXNCENTER.BREAK) {
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x + v.x, d.y + v.y), p.clone().offset(-d.x + v.x, -d.y + v.y), color, linewidth / 2);
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x - v.x, d.y - v.y), p.clone().offset(-d.x - v.x, -d.y - v.y), color, linewidth / 2);
      } else if (b.b.rcenter == JSDraw2.RXNCENTER.CHANGE) {
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x, d.y), p.clone().offset(-d.x, -d.y), color, linewidth / 2);
      } else if (b.b.rcenter == JSDraw2.RXNCENTER.BREAKANDCHANGE) {
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x, d.y), p.clone().offset(-d.x, -d.y), color, linewidth / 2);
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x + v.x, d.y + v.y), p.clone().offset(-d.x + v.x, -d.y + v.y), color, linewidth / 2);
        JSDraw2.Drawer.drawLine(surface, p.clone().offset(d.x - v.x, d.y - v.y), p.clone().offset(-d.x - v.x, -d.y - v.y), color, linewidth / 2);
      }
    }
  }

  drawSelect(lasso: ILasso) {
    lasso.draw(this, this.center());
  }

  // -- static --

  static cast<TBio>(a: any): Bond<TBio> | null {
    return a != null && a.T == 'BOND' ? a : null;
  }

  static showHelmAnnotation<TBio>(a1: Atom<TBio>, a2: Atom<TBio>, r1: number): void {
    if (a1.bio == null || scil.Utils.isNullOrEmpty(a1.bio.annotation))
      return;

    if (r1 == 2 && a1.p.x > a2.p.x || r1 == 1 && a1.p.x < a2.p.x)
      a1.bio.annotationshowright = true;
    else
      a1.bio.annotationshowright = null;
  }
}

export class BondB<TBio> {
  public b: Bond<TBio>;
  public a1: Atom<TBio>;
  public a2: Atom<TBio>;
  public type: BondType;
  public p1: Point;
  public p2: Point;

  constructor(b: Bond<TBio>) {
    this.b = b;
    this.a1 = b.a1;
    this.a2 = b.a2;
    this.type = b.type;
    this.p1 = b.a1.p.clone();
    this.p2 = b.a2.p.clone();
  }

  vector(): Point {
    return new JSDraw2.Point(this.p2.x - this.p1.x, this.p2.y - this.p1.y);
  }

  bondLength(): number {
    return this.p1.distTo(this.p2);
  }
}


JSDraw2.Bond = Bond;
JSDraw2.BondB = BondB;
