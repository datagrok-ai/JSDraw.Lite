﻿//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//
//////////////////////////////////////////////////////////////////////////////////

import type {ScilModuleType} from './types/scil';
import type {DojoType, DojoxType} from './types/dojo';
import type {OrgType} from './types/org';

import type {Point} from './Point';
import type {Atom} from './Atom';
import type {Mol} from './Mol';
import type {BondType, IBio, IDrawOptions, IEditorOptions, IGraphics, JSDraw2ModuleType, RxnCenterType} from './types/jsdraw2';
import type {Rect} from './Rect';
import type {Bracket} from './Bracket';
import type {Bond} from './Bond';
import type {Lasso} from './Lasso';

declare const dojo: DojoType;
declare const dojox: DojoxType;

declare const scil: ScilModuleType;
declare const scilligence: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType;
declare const org: OrgType<any, IBio<any>, IEditorOptions>;

export type PosRType = { pos: string, r: string };
export type BondAnnotationType = { ba1: string, ba2: string };

/**
 * Text class
 * @class scilligence.JSDraw2.Text
 */
export class Text<TBio, TBioType extends IBio<TBio>> /* TODO: implements IGraphics */ {
  /**
   @property {Rect} _rect Position
   */
  /**
   @property {string} text Text value
   */
  /**
   @property {string} color Display Color
   */

  /**
   @property {bool} selected Selecting Flag
   */

  public readonly T: string;

  public id!: number;

  public _rect!: Rect;
  public text!: string;
  public color: string | null;
  private fontsize: number;
  public selected: boolean;
  public fieldtype: string | null;
  private readonly: boolean;
  public anchors: (Atom<TBio, TBioType> | Bond<TBio, TBioType> | Bracket<TBio, TBioType>) [];
  private italic: any;
  private objects?: any[];
  private dummy?: boolean;

  /**
   * @constructor Text
   * @param {Rect} r - the position
   * @param {string} text - text value
   */
  constructor(r?: Rect, text?: string) {
    this.T = "TEXT";
    this._rect = r!;
    this.text = text!;
    this.color = null;
    this.fontsize = 1.0;
    this.selected = false;
    this.fieldtype = null;
    this.readonly = false;
    this.anchors = [];
    this.italic = null;
  }

  clone(): Text<TBio, TBioType> {
    const a = new JSDraw2.Text<TBio, TBioType>(this._rect.clone(), this.text);
    a.id = this.id;
    a.color = this.color;
    a.fieldtype = this.fieldtype;
    a.readonly = this.readonly;
    a.fontsize = this.fontsize;
    a.italic = this.italic;
    return a;
  }

  allAnchorsIn(m: Mol<TBio, TBioType>): boolean {
    if (this.anchors.length == 0)
      return false;
    for (var i = 0; i < this.anchors.length; ++i) {
      var a = this.anchors[i];
      if (JSDraw2.Atom.cast<TBio, TBioType>(a) != null && m.atoms.indexOf(a as Atom<TBio, TBioType>) < 0 ||
        JSDraw2.Bond.cast<TBio, TBioType>(a) != null && m.bonds.indexOf(a as Bond<TBio, TBioType>) < 0 ||
        JSDraw2.Bracket.cast<TBio, TBioType>(a) != null && m.graphics.indexOf(a as Bracket<TBio, TBioType>) < 0)
        return false;
    }
    return true;
  }

  attach(obj: any) {
    // anchors can contain one bracket, or any number of atoms and/or bonds
    if (JSDraw2.Bracket.cast<TBio, TBioType>(obj) != null) {
      this.anchors = [obj];
      return true;
    }

    if (JSDraw2.Atom.cast<TBio, TBioType>(obj) == null && JSDraw2.Bond.cast<TBio, TBioType>(obj) == null)
      return false;

    if (this.anchors.length == 1 && JSDraw2.Bracket.cast<TBio, TBioType>(this.anchors[0]) != null)
      this.objects = [];

    for (var i = 0; i < this.anchors.length; ++i) {
      if (this.anchors[i] == obj) {
        this.anchors.splice(i, 1);
        return true;
      }
    }
    this.anchors.push(obj);
    return true;
  }

  html(scale: number) {
    var ss = "";
    for (var i = 0; i < this.anchors.length; ++i)
      ss += (ss == "" ? "" : ",") + this.anchors[i].id;
    var s = "<i i='" + this.id + "' x='" + this.T + "' p='" + this._rect.toString(scale) + "'";
    if (this.color != null && this.color != "")
      s += " clr='" + this.color + "'";
    if (this.fontsize > 0)
      s += " fontsize='" + this.fontsize.toFixed(2) + "'";
    if (this.readonly)
      s += " v='1'";
    if (this.italic)
      s += " italic='1'";
    if (this.fieldtype != null && this.fieldtype != "")
      s += " fieldtype='" + scil.Utils.escXmlValue(this.fieldtype) + "'";
    if (ss != "")
      s += " anchors='" + ss + "'";
    s += ">" + scilligence.Utils.escXmlValue(this.text) + "</i>";
    return s;
  }

  readHtml(e: Element, map: (Atom<TBio, TBioType> | Bond<TBio, TBioType>)[]): boolean {
    var r = JSDraw2.Rect.fromString(e.getAttribute("p")!);
    var s = e.getAttribute("s")!;
    if (s == null) {
      // @ts-ignore
      s = e.text || e.textContent;
    }
    if (r == null || scil.Utils.isNullOrEmpty(s))
      return false;

    // I#6220: p="27.495 -5.105 570.397 0.901"
    if (r.width > r.height * 100)
      r.width = r.height * 5.0;
    if (r.height > r.height * 100)
      r.height = r.width / 5.0;

    this._rect = r;
    this.text = s;
    this.readonly = scil.Utils.isTrue(e.getAttribute("v"));
    this.italic = scil.Utils.isTrue(e.getAttribute("italic"));
    this.dummy = scil.Utils.isTrue(e.getAttribute("dum"));
    this.fieldtype = e.getAttribute("fieldtype");

    var fontsize = parseFloat(e.getAttribute("fontsize")!);
    if (fontsize > 0)
      this.fontsize = fontsize;

    var s2 = e.getAttribute("anchors");
    if (s2 != null && s2 != "") {
      var anchors = [];
      var ss = s2.split(',');
      for (var j = 0; j < ss.length; ++j) {
        var a = map[parseInt(ss[j])];
        if (a != null && (JSDraw2.Atom.cast<TBio, TBioType>(a) != null || JSDraw2.Bond.cast<TBio, TBioType>(a) != null || JSDraw2.Bracket.cast<TBio, TBioType>(a) != null))
          anchors.push(a);
      }
      this.anchors = anchors;
    }
    return true;
  }

  flipY(y: number) {
  }

  flipX(x: number) {
  }

  scale(s: number, origin: Point) {
    if (this._rect != null)
      this._rect.scale(s, origin);
  }

  offset(dx: number, dy: number): Rect | null {
    if (this._rect != null)
      this._rect.offset(dx, dy);
    return null;
  }

  rect(): Rect | null {
    return this._rect == null ? null : this._rect.clone();
  }

  toggle(p: Point, tor: number): boolean {
    return this._rect != null && this._rect.contains(p);
  }

  removeObject(obj: Bracket<TBio, TBioType>): void {
    for (let i = 0; i < this.anchors.length; ++i) {
      if (this.anchors[i] == obj) {
        this.anchors.splice(i, 1);
        break;
      }
    }
  }

  drawCur(surface: any, r: number, color: string, m?: Mol<TBio, TBioType>): void {
    const p = this._rect.center();
    surface.createCircle({cx: p.x, cy: p.y, r: r}).setFill(color);

    if (m != null) {
      for (let i = 0; i < this.anchors.length; ++i)
        this.anchors[i].drawCur(surface, r * 0.75, color);
    }
  }

  draw(surface: any, m: Mol<TBio, TBioType>, drawOpts: IDrawOptions) {
    var s = this.text;
    if (s == null)
      return;

    var r = this._rect;
    var fs = drawOpts.fontsize * (this.fontsize > 0 ? this.fontsize : 1.0);
    var color = this.color == null || this.color.length == 0 ? "black" : this.color;
    var t = JSDraw2.Drawer.drawText(surface, new JSDraw2.Point(r.left, r.top), s, color, fs, null, this.italic);
    r.width = t == null ? 0 : t.getTextWidth();
    r.height = fs + 4;

    //var ss = s.match(/[ ]{0,}[a-z|0-9|*|$|@|?|!][ ]{0,}[=]/gi);
    //if (ss != null) {
    //    var c = ss[0].substr(0, ss[0].indexOf('='));
    //    c = scilligence.Utils.trim(c);
    //    for (var i = 0; i < this.anchors.length; ++i) {
    //        var b = JSDraw2.Bond.cast<TBio, TBioType>(this.anchors[i]);
    //        if (b != null)
    //            JSDraw2.Drawer.drawLabel(surface, b.center(), c, color, fontsize * 0.85);
    //    }
    //}
  }

  drawSelect(lasso: Lasso<TBio, TBioType>): void {
    lasso.draw(this, this._rect.fourPoints());
  }

  public static cast<TBio, TBioType extends IBio<TBio>>(a: any): Text<TBio, TBioType> | null {
    return a != null && a.T == 'TEXT' ? a : null;
  }
}

JSDraw2.Text = Text;
