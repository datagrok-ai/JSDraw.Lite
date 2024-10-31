//
// JSDraw
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//

import type {JSDraw2ModuleType, ScilModuleType} from './types';

import type {Point} from './Point';
import type {CornerType, Rect} from './Rect';
import type {Atom} from './Atom';
import type {Mol} from './Mol';
import type {Bond} from './Bond';
import type {Lasso} from './Lasso';
import type {Text} from './Text';
import type {IBio, IDrawOptions, IGraphics, ShapeType} from './types/jsdraw2';

declare const scilligence: ScilModuleType;
declare const scil: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType;

/**
 * Bracket class
 * @class scilligence.JSDraw2.Bracket
 */
export class Bracket<TBio, TBioType extends IBio<TBio>> implements IGraphics {
  readonly T: string;
  public atoms: Atom<TBio, TBioType>[];
  public type: string | null;
  readonly _rect: Rect;
  private shape?: ShapeType;
  public sgrouptexts?: string;
  public subscript?: string | null;
  conn: any;
  expandedatoms?: Atom<TBio, TBioType>[];

  // IGraphics
  public id!: number;
  public color: string | null;
  // TODO: IGraphics
  reject: any; // TODO
  selected?: boolean;
  graphicsid?: number;

  _parent!: Mol<TBio, TBioType>;

  constructor(type: string | null, rect: Rect | null, shape?: ShapeType) {
    this.T = "BRACKET";
    this.atoms = [];
    this.type = type;
    this._rect = rect!;
    this.color = null;
    this.shape = shape;
  }

  clone(): IGraphics {
    const b = new JSDraw2.Bracket(this.type, this._rect.clone(), this.shape);
    b.color = this.color;
    b.sgrouptexts = this.sgrouptexts;
    return b as IGraphics;
  }

  getXbonds(m: Mol<TBio, TBioType>): Bond<TBio, TBioType>[] {
    const list: Bond<TBio, TBioType>[] = [];
    const bonds = m.bonds;
    for (let i = 0; i < bonds.length; ++i) {
      const b = bonds[i];
      const f1 = scil.Utils.indexOf(this.atoms, b.a1) >= 0;
      const f2 = scil.Utils.indexOf(this.atoms, b.a2) >= 0;
      if (f1 != f2)
        list.push(b);
    }

    return list;
  }

  allAtomsIn(m: Mol<TBio, TBioType>): boolean {
    if (this.atoms.length == 0)
      return false;
    for (let i = 0; i < this.atoms.length; ++i) {
      if (m.atoms.indexOf(this.atoms[i]) < 0)
        return false;
    }
    return true;
  }

  getTypeNum(): string | null {
    if (this.type == null)
      return null;
    const type = this.type + "";
    if (type.match(/^[c][0-9]+$/))
      return type.substr(1);
    //        else if (type.match(/^[0-9]+$/))
    //            return type;
    return null;
  }

  getType(): string {
    if (this.type == null)
      return "";
    let type = this.type + "";
    if (type.match(/^[c][0-9]+$/))
      type = "c";
    //        else if (type.match(/^[0-9]+$/))
    //            type = "mul";
    return type;
  }

  getSubscript(m: Mol<TBio, TBioType>): number | null {
    const t = m.getSgroupText(this, "BRACKET_TYPE");
    return t == null ? null : parseInt(t.text);
  }

  createSubscript(m: Mol<TBio, TBioType>, s: string) {
    if (scil.Utils.isNullOrEmpty(s))
      return null;

    let t: Text<TBio, TBioType> | null = m.getSgroupText(this, "BRACKET_TYPE");
    if (t != null)
      return t;

    const gap = m.medBondLength(1.56) / 2;
    t = m.setSgroup(this, "BRACKET_TYPE", s, this._rect.right() + gap / 4, this._rect.bottom() - gap);
    return t;
  }

  html(scale: number): string {
    //if (this.atoms == null || this.atoms.length == 0)
    //    return;
    let ss = "";

    if (this.atoms != null && this.atoms.length > 0) {
      ss = this.atoms[0].id + "";
      for (let i = 1; i < this.atoms.length; ++i)
        ss += "," + this.atoms[i].id;
    }

    let s = "<i i='" + this.id + "' x='" + this.T + "' t='" + scilligence.Utils.escXmlValue(this.type) + "'";
    if (this.color != null)
      s += " clr='" + this.color + "'";
    if (this.shape != null)
      s += " shape='" + this.shape + "'";
    s += " r='" + this._rect.toString(scale) + "'";
    s += " atoms='" + ss + "'></i>";
    return s;
  }

  flipY(y: number): void {
  }

  flipX(x: number): void {
  }

  scale(s: number, origin: Point) {
    this._rect.scale(s, origin);
  }

  offset(dx: number, dy: number) {
    this._rect.offset(dx, dy);
  }

  rect() {
    return this._rect;
  }

  toggle(p: Point, tor: number): boolean | undefined {
    const r = this._rect;
    if (r == null)
      return;
    const x1 = p.x - r.left;
    const x2 = r.right() - p.x;
    return p.y >= r.top - tor && p.y <= r.bottom() + tor && (x1 >= -tor / 2 && x1 < tor || x2 >= -tor / 2 && x2 < tor);
  }

  drawCur(surface: any, r: number, color: string, m?: Mol<TBio, TBioType>): void {
    const r2 = this._rect;
    if (r2 == null)
      return;
    const y = r2.center().y;
    surface.createCircle({cx: r2.left, cy: y, r: r}).setFill(color);
    surface.createCircle({cx: r2.right(), cy: y, r: r}).setFill(color);

    if (m != null) {
      for (let i = 0; i < this.atoms.length; ++i)
        this.atoms[i].drawCur(surface, r * 0.75, color);
    }
  }

  draw(surface: any, m: Mol<TBio, TBioType>, drawOpts: IDrawOptions): void {
    const r = this._rect;

    const color = this.color == null ? "gray" : this.color;
    JSDraw2.Drawer.drawBracket(surface, r, color, drawOpts.linewidth);
  }

  drawSelect(lasso: Lasso<TBio, TBioType>): void {
    lasso.draw(this, this._rect.fourPoints());
  }

  cornerTest(p: Point, tor: number) {
    return this._rect.cornerTest(p, tor);
  }

  resize(corner: CornerType, d: Point, texts: any): void {
    this._rect.moveCorner(corner, d);
    if (texts == null)
      return;
    switch (corner) {
    case "topleft":
      for (let i = 0; i < texts.topleft.length; ++i)
        texts.topleft[i]._rect.offset(d.x, d.y);
      for (let i = 0; i < texts.topright.length; ++i)
        texts.topright[i]._rect.offset(0, d.y);
      for (let i = 0; i < texts.bottomleft.length; ++i)
        texts.bottomleft[i]._rect.offset(d.x, 0);
      break;
    case "topright":
      for (let i = 0; i < texts.topright.length; ++i)
        texts.topright[i]._rect.offset(d.x, d.y);
      for (let i = 0; i < texts.topleft.length; ++i)
        texts.topleft[i]._rect.offset(0, d.y);
      for (let i = 0; i < texts.bottomright.length; ++i)
        texts.bottomright[i]._rect.offset(d.x, 0);
      break;
    case "bottomleft":
      for (let i = 0; i < texts.bottomleft.length; ++i)
        texts.bottomleft[i]._rect.offset(d.x, d.y);
      for (let i = 0; i < texts.bottomright.length; ++i)
        texts.bottomright[i]._rect.offset(0, d.y);
      for (let i = 0; i < texts.topleft.length; ++i)
        texts.topleft[i]._rect.offset(d.x, 0);
      break;
    case "bottomright":
      for (let i = 0; i < texts.bottomright.length; ++i)
        texts.bottomright[i]._rect.offset(d.x, d.y);
      for (let i = 0; i < texts.bottomleft.length; ++i)
        texts.bottomleft[i]._rect.offset(0, d.y);
      for (let i = 0; i < texts.topright.length; ++i)
        texts.topright[i]._rect.offset(d.x, 0);
      break;
    }
  }

  removeObject(obj: any) {
    const a = JSDraw2.Atom.cast<TBio, TBioType>(obj);
    if (a == null)
      return;
    for (let i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i] == a) {
        this.atoms.splice(i, 1);
        break;
      }
    }
  }

  getTexts(m: Mol<TBio, TBioType>) {
    const ret: { topleft: Text<TBio, TBioType>[], topright: Text<TBio, TBioType>[], bottomleft: Text<TBio, TBioType>[], bottomright: Text<TBio, TBioType>[] } =
      {topleft: [], topright: [], bottomleft: [], bottomright: []};
    const c1 = this._rect.center();
    for (let i = 0; i < m.graphics.length; ++i) {
      const t = JSDraw2.Text.cast<TBio, TBioType>(m.graphics[i]);
      if (t == null || t.anchors.length != 1 || t.anchors[0] != this)
        continue;
      const c = t._rect.center();
      if (c.x < c1.x) {
        if (c.y < c1.y)
          ret.topleft.push(t);
        else
          ret.bottomleft.push(t);
      } else {
        if (c.y < c1.y)
          ret.topright.push(t);
        else
          ret.bottomright.push(t);
      }
    }

    return ret;
  }

  static cast<TBio, TBioType extends IBio<TBio>>(a: any): Bracket<TBio, TBioType> {
    return a != null && a.T == 'BRACKET' ? a : null;
  }
}

JSDraw2.Bracket = Bracket;
