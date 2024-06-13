//
// JSDraw
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//


import {JSDraw2ModuleType, ScilModuleType} from './types';

declare const scilligence: ScilModuleType;
declare const scil: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType<any>;

/**
 * Bracket class
 * @class scilligence.JSDraw2.Bracket
 */
JSDraw2.Bracket = scilligence.extend(scilligence._base, {
  constructor: function(type, rect, shape) {
    this.T = "BRACKET";
    this.atoms = [];
    this.type = type;
    this._rect = rect;
    this.color = null;
    this.shape = shape;
  },

  clone: function() {
    var b = new JSDraw2.Bracket(this.type, this._rect.clone(), this.shape);
    b.color = this.color;
    b.sgrouptexts = this.sgrouptexts;
    return b;
  },

  getXbonds: function(m) {
    var list = [];
    var bonds = m.bonds;
    for (var i = 0; i < bonds.length; ++i) {
      var b = bonds[i];
      var f1 = scil.Utils.indexOf(this.atoms, b.a1) >= 0;
      var f2 = scil.Utils.indexOf(this.atoms, b.a2) >= 0;
      if (f1 != f2)
        list.push(b);
    }

    return list;
  },

  allAtomsIn: function(m) {
    if (this.atoms.length == 0)
      return false;
    for (var i = 0; i < this.atoms.length; ++i) {
      if (m.atoms.indexOf(this.atoms[i]) < 0)
        return false;
    }
    return true;
  },

  getTypeNum: function() {
    if (this.type == null)
      return null;
    var type = this.type + "";
    if (type.match(/^[c][0-9]+$/))
      return type.substr(1);
    //        else if (type.match(/^[0-9]+$/))
    //            return type;
    return null;
  },

  getType: function() {
    if (this.type == null)
      return "";
    var type = this.type + "";
    if (type.match(/^[c][0-9]+$/))
      type = "c";
    //        else if (type.match(/^[0-9]+$/))
    //            type = "mul";
    return type;
  },

  getSubscript: function(m) {
    const t = m.getSgroupText(this, "BRACKET_TYPE");
    return t == null ? null : t.text;
  },

  createSubscript: function(m, s) {
    if (scil.Utils.isNullOrEmpty(s))
      return null;

    var t = m.getSgroupText(this, "BRACKET_TYPE");
    if (t != null)
      return t;

    var gap = m.medBondLength(1.56) / 2;
    t = m.setSgroup(this, "BRACKET_TYPE", s, this._rect.right() + gap / 4, this._rect.bottom() - gap);
    return t;
  },

  html: function(scale) {
    //if (this.atoms == null || this.atoms.length == 0)
    //    return;
    var ss = "";

    if (this.atoms != null && this.atoms.length > 0) {
      ss = this.atoms[0].id + "";
      for (var i = 1; i < this.atoms.length; ++i)
        ss += "," + this.atoms[i].id;
    }

    var s = "<i i='" + this.id + "' x='" + this.T + "' t='" + scilligence.Utils.escXmlValue(this.type) + "'";
    if (this.color != null)
      s += " clr='" + this.color + "'";
    if (this.shape != null)
      s += " shape='" + this.shape + "'";
    s += " r='" + this._rect.toString(scale) + "'";
    s += " atoms='" + ss + "'></i>";
    return s;
  },

  flipY: function(y) {
  },

  flipX: function(x) {
  },

  scale: function(s, origin) {
    this._rect.scale(s, origin);
  },

  offset: function(dx, dy) {
    this._rect.offset(dx, dy);
  },

  rect: function() {
    return this._rect;
  },

  toggle: function(p, tor) {
    var r = this._rect;
    if (r == null)
      return;
    var x1 = p.x - r.left;
    var x2 = r.right() - p.x;
    return p.y >= r.top - tor && p.y <= r.bottom() + tor && (x1 >= -tor / 2 && x1 < tor || x2 >= -tor / 2 && x2 < tor);
  },

  drawCur: function(surface, r, color, m) {
    var r2 = this._rect;
    if (r2 == null)
      return;
    var y = r2.center().y;
    surface.createCircle({cx: r2.left, cy: y, r: r}).setFill(color);
    surface.createCircle({cx: r2.right(), cy: y, r: r}).setFill(color);

    if (m != null) {
      for (var i = 0; i < this.atoms.length; ++i)
        this.atoms[i].drawCur(surface, r * 0.75, color);
    }
  },

  draw: function(surface, linewidth, m, fontsize) {
    var r = this._rect;

    var color = this.color == null ? "gray" : this.color;
    JSDraw2.Drawer.drawBracket(surface, r, color, linewidth);
  },

  drawSelect: function(lasso) {
    lasso.draw(this, this._rect.fourPoints());
  },

  cornerTest: function(p, tor) {
    return this._rect.cornerTest(p, tor);
  },

  resize: function(corner, d, texts) {
    this._rect.moveCorner(corner, d);
    if (texts == null)
      return;
    switch (corner) {
    case "topleft":
      for (var i = 0; i < texts.topleft.length; ++i)
        texts.topleft[i]._rect.offset(d.x, d.y);
      for (var i = 0; i < texts.topright.length; ++i)
        texts.topright[i]._rect.offset(0, d.y);
      for (var i = 0; i < texts.bottomleft.length; ++i)
        texts.bottomleft[i]._rect.offset(d.x, 0);
      break;
    case "topright":
      for (var i = 0; i < texts.topright.length; ++i)
        texts.topright[i]._rect.offset(d.x, d.y);
      for (var i = 0; i < texts.topleft.length; ++i)
        texts.topleft[i]._rect.offset(0, d.y);
      for (var i = 0; i < texts.bottomright.length; ++i)
        texts.bottomright[i]._rect.offset(d.x, 0);
      break;
    case "bottomleft":
      for (var i = 0; i < texts.bottomleft.length; ++i)
        texts.bottomleft[i]._rect.offset(d.x, d.y);
      for (var i = 0; i < texts.bottomright.length; ++i)
        texts.bottomright[i]._rect.offset(0, d.y);
      for (var i = 0; i < texts.topleft.length; ++i)
        texts.topleft[i]._rect.offset(d.x, 0);
      break;
    case "bottomright":
      for (var i = 0; i < texts.bottomright.length; ++i)
        texts.bottomright[i]._rect.offset(d.x, d.y);
      for (var i = 0; i < texts.bottomleft.length; ++i)
        texts.bottomleft[i]._rect.offset(0, d.y);
      for (var i = 0; i < texts.topright.length; ++i)
        texts.topright[i]._rect.offset(d.x, 0);
      break;
    }
  },

  removeObject: function(obj) {
    var a = JSDraw2.Atom.cast(obj);
    if (a == null)
      return;
    for (var i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i] == a) {
        this.atoms.splice(i, 1);
        break;
      }
    }
  },

  getTexts: function(m) {
    var ret = {topleft: [], topright: [], bottomleft: [], bottomright: []};
    var c1 = this._rect.center();
    for (var i = 0; i < m.graphics.length; ++i) {
      var t = JSDraw2.Text.cast(m.graphics[i]);
      if (t == null || t.anchors.length != 1 || t.anchors[0] != this)
        continue;
      var c = t._rect.center();
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
});
