//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw.Lite
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//
// (Released under LGPL 3.0: https://opensource.org/licenses/LGPL-3.0)
//
//////////////////////////////////////////////////////////////////////////////////

import type {JSDraw2ModuleType, ScilModuleType} from './types';
import type {OrgType} from './types/org';
import type {Point} from './Point';
import type {Atom} from './Atom';
import type {IEditorOptions} from './types/jsdraw2';

declare const scil: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType;
declare const org: OrgType<any, IEditorOptions>;

export type LassoNode<TBio> = {
  a: Atom<TBio>;
  nodes: any[];
};

export class Lasso<TBio> {
  private surface: any;
  private list: LassoNode<TBio>[] | null;
  private linewidth: number;
  private lasthits: any[];
  private curhits: any[];
  private line: null;

  constructor(extra: any, linewidth: number, selecting: boolean) {
    this.surface = extra;
    this.linewidth = linewidth;
    this.list = selecting ? [] : null;

    this.lasthits = [];
    this.curhits = [];
    this.line = null;
  }

  hit(a: Atom<TBio>): void {
    if (scil.Utils.indexOf(this.lasthits, a) >= 0)
      return;

    a.selected = !a.selected;
    if (a.selected)
      a.drawSelect(this);
    else
      this.remove(a);
    this.curhits.push(a);
  }

  endHits(start: Point, end: Point): void {
    this.lasthits = this.curhits;
    this.curhits = [];

    if (this.line != null)
      this.surface.remove(this.line);
    this.line = JSDraw2.Drawer.drawLine(this.surface, start, end, "#aaf", this.linewidth / 2);
  }

  draw(a: any, pointsArg: Point | Point[]): void {
    let points = pointsArg as Point[];
    if ((pointsArg as Point).x != null)
      points = [pointsArg as Point];

    const nodes = [];
    for (let i = 0; i < points.length; ++i) {
      const p = points[i];
      const c = this.surface.createCircle({cx: p.x, cy: p.y, r: this.linewidth * 2}).setFill(JSDraw2.Editor.COLORSELECTED);
      nodes.push(c);
    }

    if (this.list != null)
      this.list.push({a: a, nodes: nodes});
  }

  remove(a: any): void {
    let nodes = null;
    for (let i = 0; i < (this.list ?? []).length; ++i) {
      if (this.list![i].a == a) {
        nodes = this.list![i].nodes;
        this.list!.splice(i, 1);
        break;
      }
    }

    if (nodes == null)
      return;

    for (let i = 0; i < nodes.length; ++i)
      this.surface.remove(nodes[i]);
  }
}

JSDraw2.Lasso = Lasso;
