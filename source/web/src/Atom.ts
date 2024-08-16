﻿//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw.Lite
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//
// (Released under LGPL 3.0: https://opensource.org/licenses/LGPL-3.0)
//
//////////////////////////////////////////////////////////////////////////////////

import type {DojoType, DojoxType} from './types/dojo';
import type {ScilModuleType} from './types/scil';
import type {OrgType} from './types/org';

import type {Point} from './Point';
import type {Rect} from './Rect';
import type {Bond} from './Bond';
import type {Mol} from './Mol';
import type {Lasso} from './Lasso';
import type {Group} from './Group';

import type {
  AtomQueryType, IBio, IRGroup, JSDraw2ModuleType, DrawStep,
  IDrawOptions
} from './types/jsdraw2';

import {DrawSteps, IObjWithId} from './types/jsdraw2';

declare const dojo: DojoType;
declare const dojox: DojoxType;

declare const scil: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType;

declare const org: OrgType<any, IDrawOptions>;

/**
 * Atom class
 * @class scilligence.JSDraw2.Atom
 */
export class Atom<TBio> implements IObjWithId {
  /**
   @property {Point} p Atom Coordinate
   */
  /**
   @property {number} charge Atom charges
   */
  /**
   @property {number} isotope Atom Isotope
   */
  /**
   @property {number} radical Atom Radical
   */
  /**
   @property {string} elem Element Symbol
   */
  /**
   @property {string} color Display Color
   */
  /**
   @property {bool} selected Selecting Flag
   */
  public readonly T: string;
  public p: Point;
  public charge: number;
  public isotope: number | null;
  public radical: number | null;
  public group: Group<TBio> | null;
  public alias: string | null;
  public superatom: any; // TODO: ?
  public attachpoints: number[];
  public rgroup: IRGroup<TBio> | null;
  public bio: IBio<TBio> | null;
  private locked: boolean;
  public hidden: boolean | null;
  private ratio?: number;
  private _rect: Rect | null;
  public elem: string;
  public color: string | null;

  public hcount: number | null;
  public selected: boolean;
  public highlighted: boolean;
  public f: any | null;
  public bonds: Bond<TBio>[] | null;
  public id: number | null;
  public atommapid: number | null;
  public query: AtomQueryType | null;
  public hasError: boolean | null;
  public hs: number | null;
  public val: any | null;
  public tag: string | null;

  public _haslabel?: boolean;
  public _parent!: Mol<TBio>;
  public atomid?: number;
  public _outside?: boolean;
  public mol?: Mol<TBio>;
  public iR?: number | string | null;
  public __drawselect?: boolean;
  public ringclosures: any;
  public aromatic?: boolean;
  public _aaid?: number | null;

  public __mol?: Mol<TBio>;


  /**
   * @constructor Atom
   * @param {Point} p - coordinate
   * @param {string} elem - element symbol
   * @bio {bool} bio - indicate if this is a Bio object
   */
  constructor(p: Point | null, elem?: string, bio?: any) {
    this.T = 'ATOM';
    this.p = p!;
    this.charge = 0;
    this.isotope = null;
    this.radical = null;
    this.group = null;
    this.alias = null;
    this.superatom = null;
    this.attachpoints = [];
    this.rgroup = null;
    this.bio = bio;
    this.locked = false;
    this.hidden = null;
    this._rect = null;
    if (bio == null) {
      if (elem == null || elem.length == 0) {
        this.elem = 'C';
      } else if (elem == 'D') {
        this.elem = 'H';
        this.isotope = 2;
      } else if (elem == 'T') {
        this.elem = 'H';
        this.isotope = 3;
      } else {
        this.elem = elem;
      }
    } else {
      this.elem = elem!;
    }
    this.color = null;
    this.hcount = null;
    this.selected = false;
    this.highlighted = false;
    this.f = null;
    this.bonds = null;
    this.id = null;
    this.atommapid = null;
    this.query = null;
    this.hasError = null;
    this.hs = null;
    this.val = null;
    this.tag = null;
  }

  clone(selectedOnly?: boolean | null): Atom<TBio> {
    const a = new JSDraw2.Atom<TBio>(this.p.clone(), this.elem, dojo.clone(this.bio));
    a.charge = this.charge;
    a.isotope = this.isotope;
    a.radical = this.radical;
    a.hcount = this.hcount;
    a.id = this.id;
    a.color = this.color;
    a.tag = this.tag;
    a.alias = this.alias;
    a.superatom = this.superatom == null ? null : this.superatom.clone();
    a.attachpoints = scil.clone(this.attachpoints);
    a.rgroup = this.rgroup == null ? null : this.rgroup.clone(selectedOnly);
    a.atommapid = this.atommapid;
    a.hasError = this.hasError;
    a.hs = this.hs;
    a.val = this.val;
    if (this.query != null)
      a.query = scil.clone(this.query);
    if (this.bio != null)
      a.bio = scil.clone(this.bio);
    a.locked = this.locked;
    a.hidden = this.hidden;
    a.ratio = this.ratio;
    a.selected = this.selected;
    return a;
  }

  biotype(): TBio | null {
    return this.bio == null ? null : this.bio.type;
  }

  isMarkedStereo() {
    var bs = this.bonds;
    if (bs == null || bs.length != 3 && bs.length != 4)
      return false;

    for (var i = 0; i < bs.length; ++i) {
      if (bs[i].a1 == this && (bs[i].type == JSDraw2.BONDTYPES.WEDGE || bs[i].type == JSDraw2.BONDTYPES.HASH))
        return true;
    }

    return false;
  }

  updateRGroup() {
    if (this.rgroup != null)
      this.rgroup.text = (this.alias == null || this.alias == '' ? this.elem : this.alias) + '=';
  }

  getLabel() {
    if (this.alias != null && this.alias != '')
      return this.alias;
    return this.elem;
  }

  html(scale: number, len: number): string {
    var s = '<a i=\'' + this.id + '\' e=\'' + scil.Utils.escXmlValue(this.elem) + '\' p=\'' + this.p.toString(scale) + '\'';
    if (this.bio == null) {
      if (this.charge != 0)
        s += ' c=\'' + this.charge + '\'';
      if (this.radical! >= 1 && this.radical! <= 3)
        s += ' rad=\'' + this.radical + '\'';
      if (this.isotope! > 0)
        s += ' iso=\'' + this.isotope + '\'';
      if (this.tag != null && this.tag != '')
        s += ' tag=\'' + scil.Utils.escXmlValue(this.tag) + '\'';
      if (this.alias != null && this.alias != '')
        s += ' alias=\'' + scil.Utils.escXmlValue(this.alias) + '\'';
      if (this.color != null)
        s += ' clr=\'' + this.color + '\'';
      if (this.atommapid! > 0)
        s += ' ami=\'' + this.atommapid + '\'';
      if (this.locked)
        s += ' locked=\'1\'';
      if (this.attachpoints.length > 0) {
        var apos = '';
        for (var i = 0; i < this.attachpoints.length; ++i)
          apos += (i > 0 ? ',' : '') + this.attachpoints[i];
        s += ' apo=\'' + apos + '\'';
      }
      if (this.hs! > 0)
        s += ' hs=\'' + this.hs + '\'';
      if (this.val > 0)
        s += ' val=\'' + this.val + '\'';
      if (this.group != null)
        s += ' g=\'' + this.group.id + '\'';
      if (this.query != null) {
        if (this.query.sub != null)
          s += ' sub=\'' + this.query.sub + '\'';
        if (this.query.uns != null)
          s += ' uns=\'' + (this.query.uns ? 1 : 0) + '\'';
        if (this.query.rbc != null)
          s += ' rbc=\'' + this.query.rbc + '\'';
        if (this.query.als != null && this.query.t != null) {
          s += ' als=\'' + this.query.als.join(',') + '\'';
          s += ' als_t=\'' + (this.query.t == false ? 0 : 1) + '\'';
        }
      }
    } else {
      s += ' bio=\'' + this.bio.type + '\'';
      if (!scil.Utils.isNullOrEmpty(this.bio.subtype))
        s += ' subtype=\'' + this.bio.subtype + '\'';
      if (!scil.Utils.isNullOrEmpty(this.bio.sequences))
        s += ' seq=\'' + scil.Utils.escXmlValue(this.bio.sequences!) + '\'';
      if ((this.bio.id as number) > 0)
        s += ' bioid=\'' + scil.Utils.escXmlValue(this.bio.id as string) + '\'';
      if (!scil.Utils.isNullOrEmpty(this.bio.annotation))
        s += ' ann=\'' + scil.Utils.escXmlValue(this.bio.annotation!) + '\'';
      if (this.elem == '?' && !scil.Utils.isNullOrEmpty(this.bio.ambiguity))
        s += ' amb=\'' + scil.Utils.escXmlValue(this.bio.ambiguity!) + '\'';
      if (this.biotype() == org.helm.webeditor.HELM.BLOB && !scil.Utils.isNullOrEmpty(this.bio.blobtype))
        s += ' blobtype=\'' + scil.Utils.escXmlValue(this.bio.blobtype!) + '\'';
    }

    if (this.rgroup == null && this.superatom == null) {
      s += '/>';
    } else {
      s += '>\n';
      if (this.rgroup != null) {
        s += '<rgroup>\n';
        s += this.rgroup.html(scale) + '\n';
        for (var j = 0; j < this.rgroup.mols.length; ++j) {
          var s2 = this.rgroup.mols[j]._getXml(null, null, null, null, len, true);
          if (s2 != null)
            s += s2;
        }
        s += '</rgroup>';
      }
      if (this.superatom != null) {
        s += '<superatom>\n';
        s += this.superatom._getXml(null, null, null, null, len, true);
        s += '</superatom>';
      }
      s += '</a>';
    }
    return s;
  }

  readHtml(e: HTMLElement): void {
    var c = e.getAttribute('c');
    if (c != null)
      this.charge = parseInt(c);

    var rStr: string | null = e.getAttribute('clr');
    if (rStr != null)
      this.color = rStr;

    var rad = e.getAttribute('rad');
    if (rad != null && rad != '')
      this.radical = parseInt(rad);

    var iso = e.getAttribute('iso');
    if (iso != null && iso != '')
      this.isotope = parseInt(iso);

    var hs = e.getAttribute('hs');
    if (hs != null && hs != '')
      this.hs = parseInt(hs);

    var val = e.getAttribute('val');
    if (val != null && val != '')
      this.val = parseInt(val);

    var tag = e.getAttribute('tag');
    if (tag != null && tag != '')
      this.tag = tag;

    var alias = e.getAttribute('alias');
    if (alias != null && alias != '')
      this.alias = alias;

    var ami: any = e.getAttribute('ami');
    if (ami != null && !isNaN(ami))
      this.atommapid = parseInt(ami);

    var apo: string | null = e.getAttribute('apo');
    if (apo != null && apo != '') {
      var ss = apo.split(',');
      for (var i = 0; i < ss.length; ++i) {
        var s2 = ss[i];
        var apon: number = isNaN(s2 as any) ? 0 : parseInt(s2);
        if (apon > 0)
          this.attachpoints.push(apon);
      }
    }

    var rbc = e.getAttribute('rbc');
    if (rbc != null) {
      if (this.query == null)
        this.query = {};
      this.query.rbc = parseInt(rbc);
    }

    var sub = e.getAttribute('sub');
    if (sub != null) {
      if (this.query == null)
        this.query = {};
      this.query.sub = sub == '*' ? '*' : parseInt(sub);
    }

    var uns = e.getAttribute('uns');
    if (uns == '1' || uns == '0') {
      if (this.query == null)
        this.query = {};
      this.query.uns = uns == '1';
    }

    var als = JSDraw2.PT.makeAtomList(e.getAttribute('als'), e.getAttribute('als_t'));
    if (als != null) {
      if (this.query == null)
        this.query = {};
      this.query.als = als.atoms;
      this.query.t = als.t;
    }

    if (this.bio != null) {
      this.bio.subtype = e.getAttribute('subtype');
      this.bio.sequences = e.getAttribute('seq');
      const bioid: number = parseInt(e.getAttribute('bioid')!);
      if (bioid > 0)
        this.bio.id = bioid;

      var ann = e.getAttribute('ann');
      if (!scil.Utils.isNullOrEmpty(ann))
        this.bio.annotation = ann;

      var amb = e.getAttribute('amb');
      if (this.elem == '?' && !scil.Utils.isNullOrEmpty(amb))
        this.bio.ambiguity = amb;

      const blobtype = e.getAttribute('blobtype');
      if (this.biotype() == org.helm.webeditor.HELM.BLOB && !scil.Utils.isNullOrEmpty(blobtype))
        this.bio.blobtype = blobtype;
    }

    if (this.elem != null) {
      var rgEl = scil.Utils.getFirstElement(e, 'rgroup');
      if (rgEl) {
        var t = scil.Utils.getFirstElement(rgEl, 'i');
        if (t != null) {
          var r: IRGroup = new JSDraw2.RGroup();
          if (r.readHtml(t, null)) {
            this.rgroup = r;

            r.position = JSDraw2.Point.fromString(e.getAttribute('p')!);
            var divs = scil.Utils.getElements(rgEl, 'div');
            for (var i = 0; i < divs.length; ++i) {
              var m = new JSDraw2.Mol();
              if (m.setXml(divs[i]) != null)
                r.mols.push(m);
            }
          }
        }
      }
    }

    if (this.alias != null || this.bio != null) {
      var superatom = scil.Utils.getFirstElement(e, 'superatom');
      var div = superatom == null ? null : scil.Utils.getFirstElement(superatom, 'div');
      if (div != null) {
        var m = new JSDraw2.Mol();
        if (m.setXml(div) != null) {
          if (m.atoms.length == 1 && m.atoms[0].elem == this.alias) {
            this.elem = this.alias;
            this.alias = null;
          } else {
            this.superatom = m;
          }
        }
      }
    }
  }

  toggle(p: Point, tor: number): boolean {
    if (this._rect != null)
      return this._rect.contains(p);
    return this.p.distTo(p) <= tor;
  }

  drawCur(surface: any, r: number, color: string, m?: Mol<TBio>) {
    const c = this._rect == null ? this.p : this._rect.center();
    surface.createCircle({cx: c.x, cy: c.y, r: r}).setFill(color);
    if (this.elem == '@' && m != null) {
      const list = m.getAllBonds(this);
      for (let i = 0; i < list.length; ++i) {
        const b = list[i];
        if (b.type == JSDraw2.BONDTYPES.DUMMY)
          b.otherAtom(this)!.drawCur(surface, r * 0.75, color);
      }
    }
  }

  needShowAtomLabel() {
    return this.elem != 'C' || this.charge != 0 || this.isotope != null || this.hcount == 4;
  }

  // showLabel: function() {
  //   return a.elem != 'C' || a.charge != 0 || a.isotope != null || a.hcount == 4;
  // },

  drawBio(
    surface: any, drawOpts: IDrawOptions, color: string,
    drawStep: DrawStep
  ): void {
    var a = this;
    const linewidth: number = drawOpts.linewidth;
    let fontsize: number = drawOpts.fontsize;
    var biotype = this.biotype();
    var p = a.p.clone();
    if (biotype == JSDraw2.BIO.ANTIBODY && DrawSteps.main === drawStep) {
      color = '#00f';
      var color2 = a.bio!.subtype == JSDraw2.ANTIBODY.ScFv ? '#bbb' : color;
      var color3 = a.bio!.subtype == JSDraw2.ANTIBODY.ScFv || a.bio!.subtype == JSDraw2.ANTIBODY.Fab ? '#bbb' : color;
      surface.createCircle({cx: p.x, cy: p.y, r: fontsize})
        .setFill('white')
        .setStroke({color: color, width: linewidth / 2});
      fontsize /= 2;
      p.offset(0, -linewidth);
      JSDraw2.Drawer.drawLine(surface, new JSDraw2.Point(p.x - linewidth, p.y), new JSDraw2.Point(p.x - linewidth - fontsize, p.y - fontsize), color2, linewidth);
      JSDraw2.Drawer.drawLine(surface, new JSDraw2.Point(p.x + linewidth, p.y), new JSDraw2.Point(p.x + linewidth + fontsize, p.y - fontsize), color, linewidth);
      JSDraw2.Drawer.drawLine(surface, new JSDraw2.Point(p.x - 2 * linewidth, p.y + fontsize / 1.5), new JSDraw2.Point(p.x - 2 * linewidth - fontsize, p.y - fontsize + fontsize / 1.5), color2, linewidth);
      JSDraw2.Drawer.drawLine(surface, new JSDraw2.Point(p.x + 2 * linewidth, p.y + fontsize / 1.5), new JSDraw2.Point(p.x + 2 * linewidth + fontsize, p.y - fontsize + fontsize / 1.5), color, linewidth);
      JSDraw2.Drawer.drawLine(surface, new JSDraw2.Point(p.x - linewidth, p.y), new JSDraw2.Point(p.x - linewidth, p.y + fontsize * 2), color3, linewidth);
      JSDraw2.Drawer.drawLine(surface, new JSDraw2.Point(p.x + linewidth, p.y), new JSDraw2.Point(p.x + linewidth, p.y + fontsize * 2), color3, linewidth);
    } else if (biotype == JSDraw2.BIO.PROTEIN && DrawSteps.main === drawStep) {
      var colors = [{offset: 0, color: '#4ea1fc'}, {offset: linewidth / 20, color: '#0072e5'}, {offset: linewidth / 10, color: '#003b80'}];
      surface.createCircle({cx: this.p.x, cy: this.p.y, r: fontsize})
        .setFill({type: 'radial', cx: this.p.x + fontsize / 4, cy: this.p.y + fontsize / 4, colors: colors});
    } else if ((biotype == JSDraw2.BIO.GENE || biotype == JSDraw2.BIO.DNA || biotype == JSDraw2.BIO.RNA) && DrawSteps.main === drawStep) {
      color = '#00f';
      var color2 = a.bio!.subtype == JSDraw2.ANTIBODY.ScFv ? '#bbb' : color;
      var color3 = a.bio!.subtype == JSDraw2.ANTIBODY.ScFv || a.bio!.subtype == JSDraw2.ANTIBODY.Fab ? '#bbb' : color;
      surface.createCircle({cx: p.x, cy: p.y, r: fontsize})
        .setFill('white')
        .setStroke({color: color, width: linewidth / 2});
      this.drawEllipse(surface, p.x + fontsize / 6, p.y + fontsize / 3, fontsize / 6, fontsize / 2, color, -20);
      this.drawEllipse(surface, p.x + fontsize / 6, p.y - fontsize / 3, fontsize / 6, fontsize / 2, color, +20);
      this.drawEllipse(surface, p.x - fontsize / 6, p.y + fontsize / 3, fontsize / 6, fontsize / 2, color, +20);
      this.drawEllipse(surface, p.x - fontsize / 6, p.y - fontsize / 3, fontsize / 6, fontsize / 2, color, -20);
    } else if (org.helm.webeditor.isHelmNode(a)) {
      org.helm.webeditor.Interface.drawMonomer(surface, a, p, drawOpts, color, drawStep);
    } else if (DrawSteps.main === drawStep) {
      if (color == null)
        color = a.bio!.type == JSDraw2.BIO.AA ? '#00F' : (a.bio!.type == JSDraw2.BIO.BASE_RNA ? '#278925' : '#FFAA00');
      this.drawDiamond(surface, p.x, p.y, fontsize * 0.55, color, linewidth);
      p.offset(0, -1);
      JSDraw2.Drawer.drawLabel(surface, p, a.elem, color, fontsize * (a.elem.length > 1 ? 2 / a.elem.length : 1.0), null, null, null, false);
    }

    //if (this.selected)
    //    this.drawSelect(surface, linewidth);
  }

  drawDiamond(surface: any, x: number, y: number, w: number, color: string, linewidth: number): void {
    surface.createRect({x: x - w, y: y - w, width: 2 * w, height: 2 * w})
      .setTransform([dojox.gfx.matrix.rotategAt(45, x, y)])
      .setFill('white')
      .setStroke({color: color, width: linewidth / 2});
  }

  drawEllipse(surface: any, x: number, y: number, rx: number, ry: number, color: string, deg: number) {
    surface.createEllipse({cx: x, cy: y, rx: rx, ry: ry})
      .setFill(color)
      .setTransform([dojox.gfx.matrix.rotategAt(deg, x, y)]);
  }

  hasLabel(m: Mol<TBio>, showcarbon?: string): boolean {
    var a = this;
    return a.bio == null && (a.elem != 'C' || a.charge != 0 || a.radical != null ||
      a.elem == 'C' && (showcarbon == 'all' || showcarbon == 'terminal' && m.getNeighborAtoms(a).length == 1) ||
      a.isotope != null || a.hcount == 4 || a.hs! > 0 || a.val > 0 || a.alias != null && a.alias != '' ||
      a.query != null && (a.query.sub != null || a.query.uns != null || a.query.rbc != null || a.query.als != null && a.query.t != null));
  }

  hasErr() {
    var a = this;
    var e = a.bio ? null : JSDraw2.PT[a.elem];
    return (!a.bio && (e == null || e.a >= 0 && a.hasError)) && a.elem != '3\'' && a.elem != '5\'';
  }

  draw(surface: any, m: Mol<TBio>, drawOpts: IDrawOptions, showError: boolean, drawStep: DrawStep): void {
    var a = this;

    this._rect = null;
    var e = a.bio ? null : JSDraw2.PT[a.elem];
    var hasError = showError && this.hasErr();
    var color = a.color;

    if (a.bio != null) {
      this.drawBio(surface, drawOpts, color!, drawStep);
      return;
    }
    if (drawStep != DrawSteps.main) return;

    var atomcolor = color;
    if (color == null) {
      if (surface.monocolor)
        color = 'black';
      else
        color = e == null || e.c == null ? '#000' : '#' + e.c;
      atomcolor = color;
      if (hasError)
        atomcolor = e == null || e.c == null ? '#000' : '#fff';
    }

    if (a.attachpoints.length > 0)
      this.drawApo(a, m, surface, drawOpts, color);

    if (a.alias != null && a.alias != '') {
      this._rect = JSDraw2.Atom.drawAlias(m.calcHDir(a, 4 * drawOpts.linewidth, true), surface, a.p, a.alias, hasError ? 'red' : atomcolor!, drawOpts.fontsize);
    } else {
      var elem = a.elem;
      var isotope = a.isotope;
      if (elem == 'H') {
        if (isotope == 2) {
          elem = 'D';
          isotope = null;
        } else if (isotope == 3) {
          elem = 'T';
          isotope = null;
        }
      } else if (a.query != null) {
        var x = '';
        var x2 = '';
        if (a.query.als != null)
          x = (a.query.t == false ? '!' : '') + '[' + a.query.als.join(',') + ']';
        if (a.query.rbc != null)
          x2 += (x2 == '' ? '' : ',') + 'r' + a.query.rbc;
        if (a.query.sub != null)
          x2 += (x2 == '' ? '' : ',') + 's' + a.query.sub;
        if (a.query.uns)
          x2 += (x2 == '' ? '' : ',') + 'u';

        if (x != '' || x2 != '')
          elem = (x == '' ? elem : x) + (x2 == '' ? '' : '(' + x2 + ')');
      }

      var x2n: number = 0;
      var y2: number = 0;
      if (hasError || this._haslabel) {
        var t = JSDraw2.Drawer.drawLabel(surface, a.p, elem, atomcolor, drawOpts.fontsize, hasError ? '#f00' : false);
        var c = null;
        var h = null;
        var n = null;
        var iso = null;

        var s = '';
        if (a.charge != 0)
          s += (Math.abs(a.charge) == 1 ? '' : Math.abs(a.charge) + '') + (a.charge > 0 ? '+' : '-');
        switch (a.radical) {
        case 1:
          s += ':';
          break;
        case 2:
          s += '^';
          break;
        case 3:
          s += '^^';
          break;
        }
        if (s != '')
          c = JSDraw2.Drawer.drawLabel(surface, a.p, s, color, drawOpts.fontsize / 1.2, false);

        if (isotope != null)
          iso = JSDraw2.Drawer.drawLabel(surface, a.p, isotope + '', color, drawOpts.fontsize / 1.1, false);
        if (a.query == null && a.hcount! > 0 && (this._haslabel || elem != 'C' || a.charge != 0 || a.hcount == 4)) {
          h = JSDraw2.Drawer.drawLabel(surface, a.p, 'H', color, drawOpts.fontsize, false);
          n = a.hcount == 1 ? null : JSDraw2.Drawer.drawLabel(surface, a.p, a.hcount + '', color, drawOpts.fontsize / 1.4, false);
        }

        var tw = t.getTextWidth();
        if (c != null || h != null || n != null || iso != null) {
          var extra = scil.Utils.isOpera ? Math.round(drawOpts.fontsize / 4) : 0;
          var hw = h == null ? 0 : h.getTextWidth() + extra;
          var nw = n == null ? 0 : n.getTextWidth() + extra;
          var cw = c == null ? 0 : c.getTextWidth() + extra;
          var iw = iso == null ? 0 : iso.getTextWidth() + extra;

          var noAdj: boolean = true; //scil.Utils.isIE || scil.Utils.isTouch;
          switch (m.calcHDir(a, 4 * drawOpts.linewidth)) {
          case JSDraw2.ALIGN.RIGHT:
            if (iso != null)
              iso.setTransform([dojox.gfx.matrix.translate(-(tw / 2 + iw / 2 + (noAdj ? 0 : 2)), -4)]);
            if (h != null)
              h.setTransform([dojox.gfx.matrix.translate(tw / 2 + hw / 2 + (noAdj ? 0 : 2), 0)]);
            if (n != null)
              n.setTransform([dojox.gfx.matrix.translate(tw / 2 + hw + nw / 2 + (noAdj ? 0 : 4), 4)]);
            if (c != null)
              c.setTransform([dojox.gfx.matrix.translate(tw / 2 + hw + nw + cw / 2 + (noAdj ? 0 : 2), -4)]);
            x2n = tw / 2 + hw + nw + cw + (noAdj ? 0 : 2);
            break;
          case JSDraw2.ALIGN.LEFT:
            if (iso != null)
              iso.setTransform([dojox.gfx.matrix.translate(-(tw / 2 + iw / 2 + (noAdj ? 0 : 2)), -4)]);
            if (n != null)
              n.setTransform([dojox.gfx.matrix.translate(-(tw / 2 + iw + nw / 2 + (noAdj ? 0 : 4)), 4)]);
            if (h != null)
              h.setTransform([dojox.gfx.matrix.translate(-(tw / 2 + iw + nw + hw / 2 + (noAdj ? 0 : 6)), 0)]);
            if (c != null)
              c.setTransform([dojox.gfx.matrix.translate(-(tw / 2 + iw + nw + hw + cw / 2 + (!noAdj ? 0 : 0)), -4)]);
            x2n = tw / 2;
            break;
          case JSDraw2.ALIGN.BOTTOM:
            if (iso != null)
              iso.setTransform([dojox.gfx.matrix.translate(-(tw / 2 + iw / 2 + (noAdj ? 0 : 2)), -4)]);
            if (h != null)
              h.setTransform([dojox.gfx.matrix.translate(0, drawOpts.fontsize)]);
            if (n != null)
              n.setTransform([dojox.gfx.matrix.translate(hw / 2 + nw / 2 + (noAdj ? 0 : 2), drawOpts.fontsize + 4)]);
            if (c != null)
              c.setTransform([dojox.gfx.matrix.translate((h == null ? tw / 2 : hw / 2 + nw) + cw / 2 + (noAdj ? 0 : 4), (h == null ? 0 : drawOpts.fontsize) - 4)]);
            x2n = (h == null ? tw / 2 : hw / 2 + nw) + cw + (noAdj ? 0 : 4);
            break;
          case JSDraw2.ALIGN.TOP:
            if (iso != null)
              iso.setTransform([dojox.gfx.matrix.translate(-(tw / 2 + iw / 2 + (noAdj ? 0 : 2)), -4)]);
            if (h != null)
              h.setTransform([dojox.gfx.matrix.translate(0, -drawOpts.fontsize)]);
            if (n != null)
              n.setTransform([dojox.gfx.matrix.translate(hw / 2 + nw / 2 + (noAdj ? 0 : 2), -drawOpts.fontsize + 4)]);
            if (c != null)
              c.setTransform([dojox.gfx.matrix.translate((h == null ? tw / 2 : hw / 2 + nw) + cw / 2 + (noAdj ? 0 : 4), (h == null ? 0 : -drawOpts.fontsize) - 4)]);
            x2n = (h == null ? tw / 2 : hw / 2 + nw) + cw + (noAdj ? 0 : 4);
            y2 = (h == null ? 0 : -drawOpts.fontsize) - 4;
            break;
          }
        } else {
          x2n = tw / 2;
        }
      }

      if (a.atommapid != null) {
        var p = a.p.clone();
        var t = JSDraw2.Drawer.drawText(surface, p.offset(x2n, y2 - drawOpts.fontsize - 2), '(' + a.atommapid + ')', '#f55', drawOpts.fontsize / 1.4);
        x2n += t.getTextWidth();
      }

      if (a.val > 0) {
        var p = a.p.clone();
        var t = JSDraw2.Drawer.drawText(surface, p.offset(x2n, y2 - drawOpts.fontsize - 2), '(' + (a.val == 15 ? 0 : a.val) + ')', '#000', drawOpts.fontsize / 1.2);
        x2n += t.getTextWidth();
      }

      if (a.tag != null && a.tag != '') {
        var p = a.p.clone();
        var t = JSDraw2.Drawer.drawText(surface, p.offset(x2n, y2 - drawOpts.fontsize - 2), '<' + a.tag + '>', '#000', drawOpts.fontsize / 1.2);
        x2n += t.getTextWidth();
      }
    }

    if (a.locked)
      surface.createCircle({cx: a.p.x, cy: a.p.y, r: drawOpts.fontsize * 0.6}).setStroke({color: '#0ff', width: drawOpts.linewidth});
  }

  drawApo(a: Atom<TBio>, m: Mol<TBio>, surface: any, drawOpts: IDrawOptions, color: string): void {
    var attachpoints = a.attachpoints;
    for (var i = 0; i < attachpoints.length; ++i) {
      var apo = attachpoints[i];

      var d = drawOpts.fontsize * 1.5;
      var p = m.guessBond(a, d, i);
      if (p == null) {
        p = a.p.clone();
        p.offset(d, 0);
      }

      var ap = a.p.clone();
      if (a._haslabel)
        ap.shrink(p, drawOpts.fontsize * 0.6);

      JSDraw2.Drawer.drawLine(surface, ap, p, color, drawOpts.linewidth / 2, apo == 99 ? 2 : 0);
      if (apo == 99 || apo == 98) { // Basis
        var v = new JSDraw2.Point(ap.x - p.x, ap.y - p.y).rotate(90).setLength(drawOpts.fontsize);
        var p1 = p.clone().offset(v.x, v.y);
        var p2 = p.clone().offset(-v.x, -v.y);

        if (apo == 99)
          JSDraw2.Drawer.drawBasis(surface, p1, p2, color, drawOpts.linewidth / 2);
        else
          JSDraw2.Drawer.drawCurves(surface, p1, p2, color, drawOpts.linewidth / 2);
      } else {
        this.drawDiamond(surface, p.x, p.y, drawOpts.fontsize * 0.3, color, drawOpts.linewidth / 3);
        JSDraw2.Drawer.drawText(surface, p.offset(-drawOpts.fontsize * 0.2, -drawOpts.fontsize * 0.6), apo + '', color, drawOpts.fontsize * 0.7);
      }
    }
  }

  drawSelect(lasso: Lasso<TBio>): void {
    var c = this._rect == null ? this.p : this._rect.center();
    lasso.draw(this, c);
  }

  // -- static --

  static cast<TBio>(a: any): Atom<TBio> | null {
    return a != null && a.T == 'ATOM' ? a : null;
  }

  static match<TBio>(x: Atom<TBio>, y: Atom<TBio>) {
    if (!scil.Utils.areListEq(x.attachpoints, y.attachpoints))
      return false;

    var e1 = x.elem;
    var e2 = y.elem;
    var f = JSDraw2.Atom.match2(e1, e2);
    if (f)
      return true;

    if (x.isotope != y.isotope || x.charge != y.charge)
      return false;

    if (x.bio != null || y.bio != null) {
      if (x.bio == null || y.bio == null)
        return false;
      return x.bio.type == y.bio.type && e1 == e2;
    }

    if (e1 != 'L' && e2 != 'L')
      return false;

    var list1 = [];
    var list2 = [];
    var t1 = true;
    var t2 = true;
    if (e1 == 'L') {
      if (x.query != null && x.query.als != null) {
        for (var i = 0; i < x.query.als.length; ++i)
          list1.push(x.query.als[i]);
        if (x.query.t == false)
          t1 = false;
      }
    } else {
      list1.push(e1);
    }

    if (e2 == 'L') {
      if (y.query != null && y.query.als != null) {
        for (var i = 0; i < y.query.als.length; ++i)
          list2.push(y.query.als[i]);
        if (y.query.t == false)
          t2 = false;
      }
    } else {
      list2.push(e2);
    }

    for (var i = 0; i < list1.length; ++i) {
      for (var j = 0; j < list2.length; ++j) {
        // @ts-ignore
        f = JSDraw2.Atom.match(list1[i], list2[j]);
        if (f && t1 == t2)
          return true;
      }
    }

    return t1 != t2;
  }

  static match2(e1: string, e2: string): boolean {
    return e1 == e2 || e1 == '*' || e1 == 'A' || e2 == '*' || e2 == 'A' ||
      e1 == 'X' && (e2 == 'F' || e2 == 'Cl' || e2 == 'Br' || e2 == 'I') ||
      e2 == 'X' && (e1 == 'F' || e1 == 'Cl' || e1 == 'Br' || e1 == 'I') ||
      e1 == 'Q' && (e2 != 'H' && e2 != 'C') ||
      e2 == 'Q' && (e1 != 'H' && e1 != 'C');
  }

  static drawAlias(dir: number, surface: any, p: Point, s: string, color: string, fontsize: number): Rect {
    return JSDraw2.Drawer.drawFormula(surface, p, dir == JSDraw2.ALIGN.LEFT, s, color, fontsize);

    //        var t = null;
    //        if (dir == JSDraw2.ALIGN.LEFT)
    //            t = JSDraw2.Drawer.drawLabel(surface, p, s, color, fontsize, false, "end-anchor");
    //        else
    //            t = JSDraw2.Drawer.drawLabel(surface, p, s, color, fontsize, false, "start-anchor");

    //        return t._rect;
  }

  static isValidChiral(c: string) {
    if (c == null)
      return false;
    return /^R|S|(abs)|(\&[0-9]+)|(and[0-9]+)|(or[0-9]+)$/.test(c);
  }

  static isStereo(s: string) {
    return s != null && /^((abs)|(or[0-9]+)|(and[0-9]+))$/.test(s);
  }
}

JSDraw2.Atom = Atom;
