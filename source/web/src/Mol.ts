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

import type {IndexType, ScilModuleType, IDebug} from './types/scil';
import type {IObjWithId, BondType, IGraphics, JSDraw2ModuleType, IRGroup, IEditorOptions, IDrawOptions} from './types/jsdraw2';

import type {Atom} from './Atom';
import type {Bond} from './Bond';
import type {Bracket} from './Bracket';
import type {Group} from './Group';
import type {Text} from './Text';
import type {Rect} from './Rect';
import type {Plus, Point} from './Point';
import type {Lasso} from './Lasso';

import {BondTypes, TextAligns, DrawSteps} from './types/jsdraw2';
import {TypeVisitor} from '@typescript-eslint/scope-manager/dist/referencer/TypeVisitor';

declare const JSDraw2: JSDraw2ModuleType;
declare const scil: ScilModuleType;
declare const scilligence: ScilModuleType;

declare const DEBUG: IDebug;

export enum ChiralTypes {
  AND = 'and',
  OR = 'or',
}

export type ChiralType = typeof ChiralTypes[keyof typeof ChiralTypes];
export type IRxn = any;

export type SubGroup = any;
export type SubMolType<TBio> = { atoms: Atom<TBio>[], bonds: Bond<TBio>[], openbonds: { b: Bond<TBio>, oa: Atom<TBio> }[] };

export type SuperAtomType<TBio> = { a: Atom<TBio>, m: Mol<TBio> };

export type RGroupsType<TBio> = { n: number, list: Atom<TBio>[] };

export type AaMapType<TBio> = { atoms: AaMapAtomType<TBio>[], bonds: AaMapBondType<TBio>[] };

export type AaMapAtomType<TBio> = { q: Atom<TBio>, t: any };

export type AaMapBondType<TBio> = { q: Bond<TBio>, t: any };

/**
 * Mol class - define a Molecule object
 *<pre>
 * <b>Example:</b>
 *    var molfile = "\n";
 *    molfile += "MolEngine02021312372D\n";
 *    molfile += "\n";
 *    molfile += "  2  1  0  0  0  0  0  0  0  0999 V2000\n";
 *    molfile += "    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n";
 *    molfile += "    1.3510    0.7800    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n";
 *    molfile += "  1  2  1  0  0  0  0\n";
 *    molfile += "M  END\n";
 *
 *    var m = new JSDraw3.Mol();
 *    m.setMolfile(molfile);
 *
 *    var smiles = m.getSmiles();
 * </pre>
 * @class scilligence.JSDraw2.Mol
 */
export class Mol<TBio = any> {
  /**
   @property {array} atoms Array of Atom Objects
   */
  /**
   @property {array} bonds Array of Bond Objects
   */
  /**
   @property {array} graphics Array of Graphics (not Atom and Bond) Objects
   */

  public readonly T: string;
  private name: string | null;
  public atoms: Atom<TBio>[];
  public bonds: Bond<TBio>[];
  public graphics: IGraphics[];
  public stats: any;
  public showimplicithydrogens: boolean;
  private props: { [propName: string]: any } | null;
  public bondlength?: number;
  public chiral?: ChiralType | boolean | null;
  private mw?: number;
  private attachpoints?: any[] | null;
  public _addRxnLabel?: Function;

  /**
   * @constructor Mol
   */
  constructor(showimplicithydrogens?: boolean) {
    this.T = 'MOL';
    this.name = null;
    this.atoms = [];
    this.bonds = [];
    this.graphics = [];
    this.stats = null;
    this.showimplicithydrogens = showimplicithydrogens != false;
    this.props = null;
  }

  _addAtom(a: Atom<TBio>, parent?: Mol<TBio>) {
    this.atoms.push(a);
    a._parent = parent != null ? parent : this;
  }

  _addBond(a: Bond<TBio>, parent?: Mol<TBio>) {
    this.bonds.push(a);
    a._parent = parent != null ? parent : this;
  }

  _addGraphics(a: IGraphics, parent?: Mol<TBio>) {
    this.graphics.push(a);
    a._parent = parent != null ? parent : this;
  }

  /**
   * Reset object IDs including atoms, bonds, and other graphics
   * @function resetIds
   * @returns null
   */
  resetIds(keepoldid?: boolean) {
    const idg = new JSDraw2.IDGenerator(keepoldid ? this._getMaxID() : 0);

    for (let i = 0; i < this.atoms.length; ++i) {
      const a: Atom<TBio> = this.atoms[i];
      a.id = idg.next(a.id);
      a.atomid = i + 1;
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      const a: Bond<TBio> = this.bonds[i];
      a.id = idg.next(a.id);
      a.bondid = i + 1;
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      const a: IGraphics = this.graphics[i];
      a.id = idg.next(a.id);
      a.graphicsid = i + 1;
    }

    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.rgroup != null)
        a.rgroup.id = idg.next(a.rgroup.id);
    }
  }

  _getMaxID() {
    let max = 0;
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.id! > max)
        max = a.id!;
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      const a = this.bonds[i];
      if (a.id! > max)
        max = a.id!;
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      const a = this.graphics[i];
      if (a.id > max)
        max = a.id;
    }

    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.rgroup != null) {
        if (a.rgroup.id > max)
          max = a.rgroup.id;
      }
    }

    return max;
  }

  getObjectById(id: number) {
    for (let i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i].id == id)
        return this.atoms[i];
    }
    for (let i = 0; i < this.bonds.length; ++i) {
      if (this.bonds[i].id == id)
        return this.bonds[i];
    }
    for (let i = 0; i < this.graphics.length; ++i) {
      if (this.graphics[i].id == id)
        return this.graphics[i];
    }
  }

  /**
   * Clone the Mol object
   * @function clone
   * @param {boolean} selectedOnly - indicate if cloning only selected objects
   * @return a new Mol object
   */
  clone(selectedOnly?: boolean | null): Mol<TBio> {
    const m = new JSDraw2.Mol<TBio>();
    m.bondlength = this.bondlength;
    m.name = this.name;
    m.chiral = this.chiral;
    m.props = scil.clone(this.props);
    m.showimplicithydrogens = this.showimplicithydrogens;
    m.mw = this.mw;
    m.attachpoints = this.attachpoints;

    const map: (Atom<TBio> | Bond<TBio> | IGraphics | Group<TBio>)[] = [];
    this.resetIds(true);
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (selectedOnly && !a.selected)
        continue;

      const a1 = a.clone(selectedOnly);
      if (selectedOnly)
        a1.atommapid = null;
      m._addAtom(a1);
      map[a.id!] = a1;
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (selectedOnly && !(b.selected && b.a1.selected && b.a2.selected))
        continue;

      const b1 = b.clone();
      m._addBond(b1);
      map[b.id!] = b1;
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      const g = this.graphics[i];
      if (selectedOnly && !g.selected)
        continue;

      const g1 = g.clone(map);
      m._addGraphics(g1);
      map[g.id] = g1;
    }

    // fix references
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      const b1 = map[b.id!] as Bond<TBio>;
      if (b1 == null)
        continue;
      b1.a1 = map[b.a1.id!] as Atom<TBio>;
      b1.a2 = map[b.a2.id!] as Atom<TBio>;
      if (b1.a1 == null || b.a2 == null)
        i = i;
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      const g = this.graphics[i];
      const g1 = map[g.id] as IGraphics;
      if (g1 == null)
        continue;

      if (JSDraw2.Group.cast<TBio>(g) != null) {
        for (let j = 0; j < this.atoms.length; ++j) {
          const a = this.atoms[j];
          // @ts-ignore
          if (a.group == g) {
            // @ts-ignore
            (map[a.id!] as Atom<TBio>).group = g1;
          }
        }
        if (g.a != null)
          g1.a = map[g.a.id];

        if (g.group != null)
          g1.group = map[g.group.id];
      } else if (JSDraw2.Bracket.cast<TBio>(g) != null) {
        g1.atoms = this._getMappedArray<any>(g.atoms, map);
      } else if (JSDraw2.Text.cast<TBio>(g) != null) {
        g1.anchors = this._getMappedArray<any>(g.anchors, map);
      } else if (JSDraw2.Shape.cast(g) != null) {
        g1.froms = this._getMappedArray<any>(g.froms, map);
        if ((g1 as any).reject != null)
          (g1 as any).reject = map[g1.reject.id];
      }
    }

    m._setParent(m);
    return m;
  }

  _getMappedArray<TObj extends IObjWithId>(list: TObj[], map: TObj[]): TObj[] {
    const ret: TObj[] = [];
    for (let i = 0; i < list.length; ++i) {
      const d: TObj = list[i];
      if (d != null && map[d.id!] != null)
        ret.push(map[d.id!]);
    }
    return ret;
  }

  guessBond(a: Atom<TBio>, len: number, extra: number) {
    let p = a.p.clone();
    const bonds = this.getAllBonds(a);
    switch (bonds.length + (extra > 0 ? extra : 0)) {
    case 0:
      p.offset(1, 0);
      break;
    case 1:
      p = bonds[0].otherAtom(a)!.p.clone().rotateAround(a.p, 120);
      break;
    case 2: {
      const p1 = bonds[0].otherAtom(a)!.p;
      const p2 = bonds[1].otherAtom(a)!.p;
      const angle = a.p.angleAsOrigin(p1, p2);
      if (Math.abs(angle - 180) <= 1) {
        p = p1.clone();
        p.rotateAround(a.p, 90);
      } else {
        p.x = (p1.x + p2.x) / 2;
        p.y = (p1.y + p2.y) / 2;
        p.rotateAround(a.p, 180);
      }
      break;
    }
    case 3: {
      const p1 = bonds[0].otherAtom(a)!.p;
      const p2 = bonds[1].otherAtom(a)!.p;
      const p3 = bonds[2].otherAtom(a)!.p;
      let a1 = p.angleAsOrigin(p1, p2);
      let a2 = p.angleAsOrigin(p2, p3);
      let a3 = p.angleAsOrigin(p3, p1);
      if (a1 > 180)
        a1 = 360 - a1;
      if (a2 > 180)
        a2 = 360 - a2;
      if (a3 > 180)
        a3 = 360 - a3;
      if (a1 > a2 && a1 > a3)
        p = p3.clone();
      else if (a2 > a1 && a2 > a3)
        p = p1.clone();
      else
        p = p2.clone();
      p.rotateAround(a.p, 180);
      break;
    }
    default:
      return null;
    }
    p.setLength(len, a.p);
    return p;
  }

  getMaxRIndex(index: number | null): number | null {
    if (index == null)
      index = 0;

    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.elem != 'R')
        continue;
      const r: IndexType | null = scil.Utils.parseIndex(a.alias);
      if (r == null || r.index == null)
        continue;

      if (r.index! > index!)
        index = r.index;
      if (a.rgroup != null) {
        for (let j = 0; j < a.rgroup.mols.length; ++j) {
          const r2 = a.rgroup.mols[j].getMaxRIndex(index);
          if (r2! > index!)
            index = r2;
        }
      }
    }
    return index;
  }

  /**
   * Set color to all objects
   * @function setColor
   * @param {string} color - a color, such as red, blue, #ffe, #f0f0f0
   * @param {bool} selectedOnly - indicate if only set the color to selected objects
   * @returns null
   */
  setColor(color: string | null, selectedOnly?: boolean): number {
    let n = 0;
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.color != color && (!selectedOnly || a.selected)) {
        a.color = color;
        ++n;
      }

      if (a.rgroup != null) {
        if (a.rgroup.color != color && (!selectedOnly || a.rgroup.selected)) {
          a.rgroup.color = color;
          ++n;
        }
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          n += a.rgroup.mols[j].setColor(color, selectedOnly);
      }
    }
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.color != color && (!selectedOnly || b.selected)) {
        b.color = color;
        ++n;
      }
    }
    for (let i = 0; i < this.graphics.length; ++i) {
      const g = this.graphics[i];
      if (g.color != color && (!selectedOnly || g.selected)) {
        g.color = color;
        ++n;
      }
    }

    return n;
  }

  /**
   * Remove all object
   * @function clear
   * @returns null
   */
  clear() {
    this.name = null;
    this.chiral = null;
    this.atoms = [];
    this.bonds = [];
    this.graphics = [];
  }

  /**
   * Test if the Mol object is empty - without any atom, bond, or graphics
   * @function isEmpty
   * @returns true or false
   */
  isEmpty() {
    return this.atoms.length == 0 && this.bonds.length == 0 && this.graphics.length == 0;
  }

  /**
   * Set selecting flags to all objects
   * @function setSelected
   * @param {bool} f - true or false
   * @returns null
   */
  setSelected(f?: boolean) {
    if (f == null)
      f = false;

    let n = 0;
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.selected != f) {
        a.selected = f;
        ++n;
      }
      if (a.rgroup != null) {
        if (a.rgroup.selected != f) {
          a.rgroup.selected = f;
          ++n;
        }
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          n += a.rgroup.mols[j].setSelected(f);
      }
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.selected != f) {
        b.selected = f;
        ++n;
      }
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      const g = this.graphics[i];
      if (g.selected != f) {
        g.selected = f;
        ++n;
      }
    }

    return n;
  }

  lassoSelect(extra: any, start: Point, end: Point, last: Point, linewidth: number, tor: number) {
    for (let i = 0; i < this.atoms.length; ++i) {
      const a: Atom<TBio> = this.atoms[i];
      if (a.p.inTriangle(start, end, last))
        extra.lasso.hit(a);

      if (a.rgroup != null) {
        const g = a.rgroup;
        const r2 = g.rect();
        if (r2.center().inTriangle(start, end, last))
          extra.lasso.hit(g);
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          a.rgroup.mols[j].lassoSelect(extra, start, end, last, linewidth, tor);
      }
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.center().inTriangle(start, end, last))
        extra.lasso.hit(b);
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      const g = this.graphics[i];
      const r2 = g.rect();
      if (r2.center().inTriangle(start, end, last))
        extra.lasso.hit(g);
    }

    extra.lasso.endHits(start, end);
  }

  getSelectedAtomInMol(): Atom<TBio>[] {
    const list: Atom<TBio>[] = [];
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.selected) {
        list.push(a);
      } else if (a.rgroup != null) {
        for (let j = 0; j < a.rgroup.mols.length; ++j) {
          const r = a.rgroup.mols[j].getSelectedAtomInMol();
          if (r.length > 0)
            return r;
        }
      }
    }
    return list;
  }

  bracketSelect(r: Rect): Atom<TBio>[] {
    let ret: Atom<TBio>[] = [];
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (r.contains(a.p))
        ret.push(a);
    }

    // find open connected bonds
    const xbonds: { b: Bond<TBio>, a: Atom<TBio> }[] = [];
    const bonds = scil.clone(this.bonds);
    for (let i = this.bonds.length - 1; i >= 0; --i) {
      const b: Bond<TBio> = this.bonds[i];
      const f1 = scil.Utils.indexOf(ret, b.a1) >= 0;
      const f2 = scil.Utils.indexOf(ret, b.a2) >= 0;
      if (f1 != f2) {
        if (JSDraw2.Point.intersect(b.a1.p, b.a2.p, r.topleft(), r.bottomleft()) ||
          JSDraw2.Point.intersect(b.a1.p, b.a2.p, r.topright(), r.bottomright())) {
          xbonds.push({b: b, a: f2 ? b.a1 : b.a2});
          bonds.splice(i, 1);
        }
      }
    }

    // only handle one or two open connected bonds
    if (xbonds.length == 2 || xbonds.length == 1) {
      const oldbonds = this.bonds;
      this.bonds = bonds;
      const frags = this.splitFragments();
      this.bonds = oldbonds;

      if (frags.length > 1) {
        for (let i = 0; i < frags.length; ++i) {
          if (scil.Utils.arrayContainsArray(frags[i].atoms, ret)) {
            // avoid circle
            if (xbonds.length == 1 && scil.Utils.indexOf(frags[i].atoms, xbonds[0].a) < 0 ||
              xbonds.length == 2 && scil.Utils.indexOf(frags[i].atoms, xbonds[0].a) < 0 && scil.Utils.indexOf(frags[i].atoms, xbonds[1].a) < 0) {
              ret = frags[i].atoms;
              break;
            }
          }
        }
      }
    }

    for (let i = 0; i < ret.length; ++i)
      ret[i].selected = true;
    return ret;
  }

  selectInRect(r: Rect): number {
    let n = 0;
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (r.contains(a.p)) {
        a.selected = true;
        ++n;
      }

      if (a.rgroup != null) {
        const g = a.rgroup;
        const r2 = g.rect();
        if (r2 != null && r.contains(r2.center())) {
          g.selected = true;
          ++n;
        }

        for (let j = 0; j < a.rgroup.mols.length; ++j)
          n += a.rgroup.mols[j].selectInRect(r);
      }
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (r.contains(b.center())) {
        b.selected = true;
        ++n;
      }
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      const g = this.graphics[i] as IGraphics;
      const r2 = g.rect();
      if (r2 != null && r.contains(r2.center())) {
        g.selected = true;
        ++n;
      }
    }
    return n;
  }

  hasAtom(a: Atom<TBio>): boolean {
    for (let i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i] == a)
        return true;
    }
    return false;
  }

  hasGraphics(g: IGraphics): boolean {
    for (let i = 0; i < this.graphics.length; ++i) {
      if (this.graphics[i] == g)
        return true;
    }
    return false;
  }

  hasBond(b: Bond<TBio>): boolean {
    for (let i = 0; i < this.bonds.length; ++i) {
      if (this.bonds[i] == b)
        return true;
    }
    return false;
  }

  calcHCount(recalc?: boolean) {
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (recalc || a.hcount == null)
        this.setHCount(a);

      if (a.rgroup != null) {
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          a.rgroup.mols[j].calcHCount(recalc);
      }
    }
  }

  setHCount(a: Atom<TBio>): number | null | void {
    a.hcount = null;
    if (this.showimplicithydrogens == false || a.bio)
      return;

    let error = false;
    let v = null;

    if (a.elem != 'R' && a.alias != null && a.alias != '') {
      if (a.superatom == null) {
        if (a.elem != '#')
          error = true;
      } else if (a.superatom != null) {
        const bonds = this.getNeighborBonds(a, true);
        if (bonds.length > a.superatom.attachpoints) {
          if (a.superatom.atoms.length > 0)
            error = true;
        } else {
          for (let i = 0; i < bonds.length; ++i) {
            if (bonds[i].valence() != 1) {
              error = true;
              break;
            }
          }
        }
      }
    } else if (a.hs! > 0) {
      v = a.hs! - 1;
    } else {
      const e = JSDraw2.PT[a.elem];
      if (e != null && e.v != null && e.e != null) {
        const bonds = this.getNeighborBonds(a);
        let sum = 0;
        let naromatic = 0;
        for (let i = 0; i < bonds.length; ++i) {
          const val = bonds[i].valence();
          if (val == null)
            return;
          if (val == 1.5) {
            ++naromatic;
            if (naromatic > 2) // two benzene-rings
              sum += 1;
            else
              sum += 1.5;
          } else {
            sum += bonds[i].valence()!;
          }
        }

        // the two bonds connect to O and S on c1cocc1 should be single bond
        // TODO: Nitrogen on c1ncnc1: one N should be NH, and one should N
        if (bonds.length == 2 && (a.elem == 'O' || a.elem == 'S') &&
          bonds[0].type == JSDraw2.BONDTYPES.DELOCALIZED && bonds[1].type == JSDraw2.BONDTYPES.DELOCALIZED) {
          --sum;
        }

        // charges
        let extra = 0;
        const pair_e = e.e <= 4 ? 0 : e.e % 4;
        const single_e = e.e <= 4 ? e.e : 4 - (e.e % 4);
        if (a.charge > 0) {
          if (pair_e > 0) {
            if (pair_e >= a.charge)
              extra = a.charge;
            else
              return;
          } else if (single_e > 0) {
            if (single_e >= a.charge)
              extra -= a.charge;
            else
              return;
          }
        } else if (a.charge < 0) {
          if (single_e > 0) {
            if (single_e > -a.charge)
              extra = a.elem == 'B' || a.elem == 'P' || a.elem == 'Si' ? -a.charge : a.charge; // I#8702
            else
              return;
          }
        }

        // radical
        if (a.radical == 1 || a.radical == 3)
          sum += 2;
        else if (a.radical == 2)
          ++sum;

        // attach points
        if (a.attachpoints != null) {
          for (let i = 0; i < a.attachpoints.length; ++i) {
            if (a.attachpoints[i] != 99)
              ++sum;
          }
        }

        sum = Math.ceil(sum);
        error = true;
        for (let i = 0; i < e.v.length; ++i) {
          if (sum <= e.v[i] + extra) {
            v = e.v[i] + extra - sum;
            error = false;
            break;
          }
        }
      }
    }

    a.hasError = error;
    return a.hcount = v;
  }

  hasError() {
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.hasError)
        return true;
    }
    return false;
  }

  hasGenericAtom() {
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.elem == 'R' && a.bio == null || a.superatom != null && a.superatom.atoms.length == 0)
        return true;
    }
    return false;
  }

  /**
   * Find a bond
   * @function findBond
   * @param {Atom} a1 - the first atom
   * @param {Atom} a2 - the second atom
   * @returns the bond
   */
  findBond(a1: Atom<TBio>, a2: Atom<TBio>): Bond<TBio> | null {
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.a1 == a1 && b.a2 == a2 || b.a1 == a2 && b.a2 == a1)
        return b;
    }
    return null;
  }

  /**
   * Move all objects to the center
   * @function moveCenter
   * @param {number} width - the width of the view
   * @param {number} height - the height of the view
   * @returns null
   */
  moveCenter(width: number, height: number): void {
    if (this.isEmpty())
      return;

    const center = this.center();
    this.offset(width > 0 ? (width / 2 - center.x) : 0,
      height > 0 ? (height / 2 - center.y) : 0);
  }

  /**
   * Clean up the reaction, and make it looks nicer
   * @function cleanupRxn
   * @returns null
   */
  cleanupRxn(defaultbondlength: number) {
    const rxn = this.parseRxn(true);
    if (rxn == null || rxn.reactants.length == 1 && rxn.products.length == 0 && rxn.arrow == null)
      return false;

    let bondlength = this.medBondLength();
    if (!(bondlength > 0))
      bondlength = defaultbondlength > 0 ? defaultbondlength : JSDraw2.Editor.BONDLENGTH;
    return this._layoutRxn(rxn, bondlength);
  }

  _layoutRxn(rxn: IRxn, bondlength: number): boolean {
    const pluses: Plus[] = [];
    for (let i = 0; i < this.graphics.length; ++i) {
      if (this.graphics[i].T == 'PLUS')
        pluses.push(this.graphics[i] as unknown as Plus);
    }

    let x = null;
    let y = null;
    for (let i = 0; i < rxn.reactants.length; ++i) {
      const r = rxn.reactants[i].rect();
      if (r.width == 0)
        r.inflate(bondlength, 0);
      if (r.height == 0)
        r.inflate(0, bondlength);

      if (x == null) {
        x = r.right();
        y = r.center().y;
      } else {
        x += bondlength;
        if (pluses.length > 0) {
          const plus = pluses.pop()!;
          plus.p = new JSDraw2.Point(x, y);
        } else {
          const plus = new JSDraw2.Plus(new JSDraw2.Point(x, y));
          this._addGraphics(plus);
        }

        x += bondlength;
        rxn.reactants[i].offset(x - r.left, y - r.center().y);
        x += r.width;
      }
    }

    const arrow = rxn.arrow;
    if (arrow != null) {
      const ang = arrow.p2.angleTo(arrow.p1);
      arrow.p2.rotateAround(arrow.p1, -ang);
      const r = arrow.rect();
      if (x == null) {
        x = r.right();
        y = r.center().y;
      } else {
        x += bondlength;
        arrow.offset(x - r.left, y - r.center().y);
        x += r.width;
      }

      // adjust arrow width
      let width = 0;
      if (rxn.above != null) {
        for (let i = 0; i < rxn.above.length; ++i) {
          const w = rxn.above[i]._rect.width;
          if (w > width)
            width = w;
        }
      }
      if (rxn.below != null) {
        for (let i = 0; i < rxn.below.length; ++i) {
          const w = rxn.below[i]._rect.width;
          if (w > width)
            width = w;
        }
      }
      if (width > 0 && width + bondlength > r.width) {
        const d = width + bondlength - r.width;
        arrow.p2.offset(d, 0);
        x += d;
      }

      // layout reaction conditions above/below arrow
      const d = bondlength / 10;
      const center = arrow.rect().center();

      if (rxn.above != null) {
        let y1 = center.y - d * 2;
        for (let i = rxn.above.length - 1; i >= 0; --i) {
          const t = rxn.above[i];
          t.offset(center.x - t._rect.center().x, y1 - t._rect.bottom());
          y1 = t._rect.top - d;
        }
      }

      if (rxn.below != null) {
        let y2 = center.y + d * 2;
        for (let i = 0; i < rxn.below.length; ++i) {
          const t = rxn.below[i];
          t.offset(center.x - t._rect.center().x, y2 - t._rect.top);
          y2 = t._rect.bottom() + d;
        }
      }
    }

    for (let i = 0; i < rxn.products.length; ++i) {
      const r = rxn.products[i].rect();
      if (r.width == 0)
        r.inflate(bondlength, 0);
      if (r.height == 0)
        r.inflate(0, bondlength);

      if (x == null) {
        x = r.right();
        y = r.center().y;
      } else {
        if (i > 0) {
          x += bondlength;
          if (pluses.length > 0) {
            const plus = pluses.pop()!;
            plus.p = new JSDraw2.Point(x, y);
          } else {
            const plus = new JSDraw2.Plus(new JSDraw2.Point(x, y));
            this._addGraphics(plus);
          }
        }

        x += bondlength;
        rxn.products[i].offset(x - r.left, y - r.center().y);
        x += r.width;
      }
    }

    for (let i = 0; i < pluses.length; ++i)
      this.delObject(pluses[i]);

    return true;
  }

  /**
   * Return the center coorindate of all objects
   * @function center
   * @returns the center as a Point object
   */
  center() {
    return this.rect()!.center();
  }

  /**
   * Return the Rect of a Group
   * @function getGroupRect
   * @param {Group} g - the input group
   * @returns a Rect object
   */
  getGroupRect(g: Group<TBio>, bondlength: number): Rect | null {
    let r = null;
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.group != g || a.hidden)
        continue;

      const p = a.p;
      if (r == null)
        r = new JSDraw2.Rect(p.x, p.y, 0, 0);
      else
        r.unionPoint(p);
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      const g2 = this.graphics[i];
      if (g2.group != g)
        continue;

      // @ts-ignore
      const rect: Rect | null = JSDraw2.Group.cast<TBio>(g2) != null ? this.getGroupRect(g2, bondlength) : g2.rect();
      if (r == null)
        r = rect!.clone();
      else
        r.union(rect);
    }

    if (r != null && g.gap > 0)
      r.inflate(g.gap * bondlength / 15.0, g.gap * bondlength / 15.0);
    return r!;
  }

  /**
   * Get the Rect of selected atoms
   * @function getSelectedRect
   * @returns a Rect object
   */
  getSelectedRect() {
    let r = null;
    for (let i = 0; i < this.atoms.length; ++i) {
      if (!this.atoms[i].selected)
        continue;

      const p = this.atoms[i].p;
      if (r == null)
        r = new JSDraw2.Rect(p.x, p.y, 0, 0);
      else
        r.unionPoint(p);
    }
    return r;
  }

  /**
   * Return the Rect of all object
   * @function rect
   * @returns a Rect object
   */
  rect(withoutRgroups?: boolean): Rect | null {
    if (this.atoms.length == 0) {
      if (this.graphics.length == 0)
        return null;
      const r: Rect = this.graphics[0].rect();
      for (let i = 1; i < this.graphics.length; ++i)
        r.union(this.graphics[i].rect());
      return r;
    }

    let x1 = null;
    let y1 = null;
    let x2 = null;
    let y2 = null;

    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.hidden)
        continue;

      const p = a.p;
      if (x1 == null) {
        x1 = x2 = p.x;
        y1 = y2 = p.y;
        continue;
      }

      if (p.x < x1)
        x1 = p.x;
      else if (p.x > x2!)
        x2 = p.x;

      if (p.y < y1!)
        y1 = p.y;
      else if (p.y > y2!)
        y2 = p.y;
    }

    const r: Rect = new JSDraw2.Rect(x1!, y1!, x2! - x1!, y2! - y1!);
    for (let i = 0; i < this.graphics.length; ++i) {
      const g = this.graphics[i];
      if (JSDraw2.Group.cast<TBio>(g) != null)
        continue;
      r.union(g.rect());
    }

    if (!withoutRgroups) {
      for (let i = 0; i < this.atoms.length; ++i) {
        const a = this.atoms[i];
        if (a.rgroup == null)
          continue;
        r.union(a.rgroup.rect());
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          r.union(a.rgroup.mols[j].rect());
      }
    }

    return r;
  }

  /**
   * Move all objects
   * @function offset
   * @param {number} dx - x offset
   * @param {number} dy - y offset
   * @param {bool} selectedOnly - indicated if moving only selected objects
   * @returns null
   */
  offset(dx: number, dy: number, selectedOnly?: boolean): void {
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (selectedOnly != true || a.selected)
        a.p.offset(dx, dy);
      if (a.rgroup != null) {
        if (selectedOnly != true || a.rgroup.selected)
          a.rgroup.offset(dx, dy);
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          a.rgroup.mols[j].offset(dx, dy, selectedOnly);
      }
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      const g = this.graphics[i];
      if (selectedOnly != true || g.selected) {
        this.graphics[i].offset(dx, dy);
      } else {
        if (selectedOnly && !g.selected) {
          const t = JSDraw2.Text.cast<TBio>(g);
          if (t != null && t.anchors.length > 0) {
            let all = true;
            for (let j = 0; j < t.anchors.length; ++j) {
              if (!t.anchors[j].selected) {
                all = false;
                break;
              }
            }
            if (all) {
              t.selected = true;
              t.offset(dx, dy);
            }
          }
        }
      }
    }
  }

  /**
   * Rotate all objects around a point
   * @function rotate
   * @param {Point} origin - the position to be rotated around
   * @param {number} deg - degrees to be rotated
   * @returns null
   */
  rotate(origin: Point, deg: number): void {
    for (let i = 0; i < this.atoms.length; ++i)
      this.atoms[i].p.rotateAround(origin, deg);
  }

  /**
   * Delete an object
   * @function delObject
   * @param {object} obj - Atom, bond, or graphics to be removed
   * @returns null
   */
  delObject(obj: any): boolean | void {
    if (obj == null)
      return;

    const a = JSDraw2.Atom.cast<TBio>(obj);
    if (a != null)
      return this.delAtom(a);

    const b = JSDraw2.Bond.cast<TBio>(obj);
    if (b != null)
      return this.delBond(b);

    return this.delGraphics(obj);
  }

  delGraphics(obj: IGraphics): boolean {
    const group = JSDraw2.Group.cast<TBio>(obj);
    if (group != null) {
      for (let i = 0; i < this.atoms.length; ++i) {
        if (this.atoms[i].group == group)
          this.atoms[i].group = null;
      }

      for (let i = 0; i < this.graphics.length; ++i) {
        if (this.graphics[i].group == group)
          this.graphics[i].group = null;
      }
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      if (this.graphics[i] == obj) {
        this.graphics.splice(i, 1);
        this.objectRemoved(obj);
        return true;
      }
    }
    return false;
  }

  delAtom(a: Atom<TBio>, checkBonds?: boolean): boolean {
    const atoms: Atom<TBio>[] = [];
    atoms.push(a);

    if (checkBonds != false) {
      for (let i = this.bonds.length - 1; i >= 0; --i) {
        const b = this.bonds[i];
        if (b.a1 == a || b.a2 == a) {
          this.bonds.splice(i, 1);
          this.objectRemoved(b);
          atoms.push(b.otherAtom(a)!);
          if (a.atommapid != null)
            this.clearAtomMap(a.atommapid);
        }
      }
    }

    let n = 0;
    for (let i = 0; i < atoms.length; ++i) {
      const a1 = atoms[i];
      if (a == a1 || !a1.bio) {
        if (this.delLoneAtom(atoms[i]))
          ++n;
      }
    }
    return n > 0;
  }

  delBond(b: Bond<TBio>, delLoneAtom?: boolean): boolean {
    for (let i = 0; i < this.bonds.length; ++i) {
      if (this.bonds[i] == b) {
        this.bonds.splice(i, 1);
        if (delLoneAtom != false) {
          if (!b.a1.bio)
            this.delLoneAtom(b.a1);
          if (!b.a2.bio)
            this.delLoneAtom(b.a2);
        }
        this.objectRemoved(b);
        return true;
      }
    }

    return false;
  }

  delLoneAtom(a: Atom<TBio>): boolean {
    if (!this.isLoneAtom(a)) {
      this.setHCount(a);
      return false;
    }

    for (let i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i] == a) {
        this.atoms.splice(i, 1);
        if (a.atommapid != null)
          this.clearAtomMap(a.atommapid);
        this.objectRemoved(a);
        return true;
      }
    }

    return false;
  }

  objectRemoved(obj: any): void {
    for (let i = 0; i < this.graphics.length; ++i) {
      const g = this.graphics[i];
      if (g.removeObject != null)
        g.removeObject(obj);
    }
  }

  hasSelected(): boolean {
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (this.atoms[i].selected)
        return true;
      if (a.rgroup != null) {
        if (a.rgroup.selected) {
          return true;
        } else {
          for (let j = 0; j < a.rgroup.mols.length; ++j) {
            if (a.rgroup.mols[j].hasSelected())
              return true;
          }
        }
      }
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      if (this.bonds[i].selected)
        return true;
    }

    for (let i = 0; i < this.graphics.length; ++i) {
      if (this.graphics[i].selected)
        return true;
    }

    return false;
  }

  delSelected() {
    let n = 0;

    const atoms = scil.clone(this.atoms);
    for (let i = 0; i < atoms.length; ++i) {
      const a = atoms[i];
      if (a.selected) {
        this.delAtom(atoms[i]);
        ++n;
      }

      if (a.rgroup != null) {
        if (a.rgroup.selected) {
          a.rgroup = null;
          ++n;
        } else {
          for (let j = 0; j < a.rgroup.mols.length; ++j)
            n += a.rgroup.mols[j].delSelected();
        }
      }
    }

    const bonds = scil.clone(this.bonds);
    for (let i = 0; i < bonds.length; ++i) {
      if (bonds[i].selected) {
        this.delBond(bonds[i]);
        ++n;
      }
    }

    const graphics = scil.clone(this.graphics);
    for (let i = 0; i < graphics.length; ++i) {
      if (graphics[i].selected) {
        this.delObject(graphics[i]);
        ++n;
      }
    }

    return n;
  }

  setBondLength(d: number): void {
    const s = d / this.medBondLength();
    if (isNaN(s))
      return /* false */;
    this.scale(s);
  }

  getSketchType(): string {
    for (let i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i].bio != null)
        return 'biologics';
    }
    return this.isRxn() ? 'reaction' : 'molecule';
  }

  /**
   * Merge another Molecule
   * @function mergeMol
   * @param {Mol} m - the Molecule to be merged
   */
  mergeMol(m: Mol<TBio>, _parent?: Mol<TBio>, group?: Group<TBio>): void {
    for (let i = 0; i < m.atoms.length; ++i) {
      this.addAtom(m.atoms[i]);
      if (group != null)
        m.atoms[i].group = group;
    }

    for (let i = 0; i < m.bonds.length; ++i) {
      const b = m.bonds[i];
      if (this.findBond(b.a1, b.a2) == null)
        this.addBond(b, false);
    }

    for (let i = 0; i < m.graphics.length; ++i)
      this.addGraphics(m.graphics[i]);

    this._setParent(this);
  }

  replaceAtom(old: Atom<TBio>, newa: Atom<TBio>): void {
    for (let i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i] == old) {
        this.atoms[i] = newa;
        break;
      }
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.a1 == old)
        b.a1 = newa;
      if (b.a2 == old)
        b.a2 = newa;
    }

    this.setHCount(newa);
  }

  replaceBond(old: Bond<TBio>, newb: Bond<TBio>): void {
    for (let i = 0; i < this.bonds.length; ++i) {
      if (this.bonds[i] == old) {
        this.bonds[i] = newb;
        break;
      }
    }

    this.replaceAtom(old.a1, newb.a1);
    this.replaceAtom(old.a2, newb.a2);
  }

  /**
   * Add a graphics
   * @function addGraphics
   * @param {Graphics} g - the graphics to be added
   * @returns the Graphics added
   */
  addGraphics(g: IGraphics): IGraphics | null {
    if (this.hasGraphics(g))
      return null;

    this._addGraphics(g);
    return g;
  }

  /**
   * Add an Atom
   * @function addAtom
   * @param {Atom} a - the atom to be added
   * @returns the Atom added
   */
  addAtom(a: Atom<TBio>): Atom<TBio> | null {
    if (this.hasAtom(a))
      return null;

    this._addAtom(a);
    return a;
  }

  /**
   * Add a Bond
   * @function addBond
   * @param {Bond} b - the bond to be added
   * @param {bool} resetcharge - indicate if reset atoms' charges of bonded atoms
   * @returns the Bond added
   */
  addBond(b: Bond<TBio>, resetcharge?: boolean, add2rgroup?: boolean): Bond<TBio> | null {
    if (this.hasBond(b))
      return null;

    if (b.a1.mol != b.a2.mol) {
      if (add2rgroup) {
        this._addBond2RGroupMol(b);
      } else {
        scil.Utils.alert('Cannot create this bond');
        return null;
      }
    }

    this._addBond(b);
    if (resetcharge != false && b.type != JSDraw2.BONDTYPES.DUMMY)
      b.a1.charge = b.a2.charge = 0;

    if (b.a1.alias == 'Me')
      b.a1.alias = null;
    if (b.a2.alias == 'Me')
      b.a2.alias = null;

    this.setHCount(b.a1);
    this.setHCount(b.a2);
    return b;
  }

  _addBond2RGroupMol(b: Bond<TBio>): void {
    const m = b.a1._parent || b.a2._parent;
    if (m == null || b.a1._parent == b._parent && b.a2._parent == b.a1._parent)
      return;

    if (b.a1._parent == null) {
      m.addAtom(b.a1);
      b.a1._parent = m;
    }

    if (b.a2._parent == null) {
      m.addAtom(b.a2);
      b.a2._parent = m;
    }

    m.addBond(b);
    b._parent = m;
  }

  /**
   * Set atom alias
   * @function setAtomAlias
   * @param {Atom} a - the target atom
   * @param {string} alias - alias name
   * @returns true of false
   */
  setAtomAlias(a: Atom<TBio>, alias: string, len?: number): boolean {
    if (alias == null || alias == '')
      return this.setAtomType(a, alias);

    if (a.alias == alias)
      return false;

    let elem = '*';
    let m = JSDraw2.SuperAtoms.get(alias);
    if (m == null) {
      const alias2 = alias.replace(/^[\+|\-]/, '').replace(/[\+|\-]$/, '');
      if (JSDraw2.PT[alias2] != null || (/^R[0-9]+$/).test(alias))
        return this.setAtomType(a, alias);

      const s = JSDraw2.SuperAtoms.guessOne(alias);
      if (s != null) {
        alias = s;
        m = JSDraw2.SuperAtoms.get(alias);
      } else {
        // leading O or S
        const list = this.getNeighborBonds(a);
        const orphan = list == null || list.length == 0 || list.length == 1 && list[0].type == JSDraw2.BONDTYPES.DUMMY;
        m = JSDraw2.FormulaParser.parse(alias, orphan, list.length);
        if (m != null && m.atoms.length == 0)
          return this.setAtomType(a, m.atoms[0].elem);

        if (orphan) {
          const salt = JSDraw2.FormulaParser.parseSalt(alias);
          if (salt != null)
            elem = '#';
        }
      }
    }

    a.isotope = null;
    a.query = null;
    a.hcount = null;
    a.radical = null;
    a.charge = 0;
    a.alias = alias;
    if (m != null) {
      //@ts-ignore
      const attach = JSDraw2.SuperAtoms._getFirstAttachAtom(m);
      if (attach != null)
        JSDraw2.SuperAtoms._alignMol(a._parent, a, m, attach, len != null ? len : this.medBondLength(1.56));
      a.superatom = m;
      a.rgroup = null;
      a.elem = elem;
    } else {
      if (!scil.Utils.isNullOrEmpty(alias))
        a.elem = elem;

      if (a.elem == 'R')
        a.updateRGroup();
      else
        a.rgroup == null;
      a.superatom = null;
    }
    this.setHCount(a);
    return true;
  }

  setAttachPoint(a: Atom<TBio>, apo: number): boolean {
    if (apo > 0 && !(a.attachpoints.length == 1 && a.attachpoints[0] == apo)) {
      a.attachpoints = [apo];
      a._parent.setHCount(a);
      return true;
    }
    return false;
  }

  /**
   * Set atom type
   * @function setAtomType
   * @param {Atom} a - the target atom
   * @param {string} elem - element symbol of atom
   * @returns true of false
   */
  setAtomType(a: Atom<TBio>, elem: string, setCharge?: boolean) {
    if (elem == 'antibody' || elem == 'protein' || elem == 'gene' || elem == 'dna' || elem == 'rna') {
      if (a.biotype() == JSDraw2.BIO.ANTIBODY || a.biotype() == JSDraw2.BIO.PROTEIN || a.biotype() == JSDraw2.BIO.GENE || a.biotype() == JSDraw2.BIO.DNA || a.biotype() == JSDraw2.BIO.RNA)
        return false;
      switch (elem) {
      case 'antibody':
        a.bio = {type: JSDraw2.BIO.ANTIBODY as TBio};
        break;
      case 'protein':
        a.bio = {type: JSDraw2.BIO.PROTEIN as TBio};
        break;
      case 'gene':
        a.bio = {type: JSDraw2.BIO.GENE as TBio};
        break;
      case 'dna':
        a.bio = {type: JSDraw2.BIO.DNA as TBio};
        break;
      case 'rna':
        a.bio = {type: JSDraw2.BIO.RNA as TBio};
        break;
      }
      a.elem = 'X';
      a.isotope = null;
      a.query = null;
      a.hcount = null;
      a.radical = null;
      a.charge = 0;
      return true;
    }

    let charge = null;
    if (elem.length > 1 && /[\+|\-][0-9]?$/.test(elem)) {
      const s = elem.replace(/[\+|\-][0-9]?$/, '');
      const cs = elem.substr(s.length);
      elem = s;
      if (cs == '+')
        charge = 1;
      else if (cs == '-')
        charge = -1;
      else
        charge = parseInt(cs);
    }

    if (a.elem == elem && (elem == 'H' && a.isotope == null) || a.bio)
      return false;
    let alias = null;
    let e = elem == 'D' || elem == 'T' ? 'H' : elem;
    if ((/^R[0-9]+$/).test(elem)) {
      e = 'R';
      alias = elem;
    }
    if (JSDraw2.PT[e] == null)
      return false;

    const oldelem = a.elem;
    a.elem = e;
    if (e != 'R')
      a.rgroup = null;
    a.alias = alias;
    a.superatom = null;
    if (elem == 'D')
      a.isotope = 2;
    else if (elem == 'T')
      a.isotope = 3;
    else
      a.isotope = null;
    a.query = null;

    if (charge! > 0 || charge! < 0)
      a.charge = charge!;
    else if (setCharge)
      a.charge = 0;

    if (oldelem == '@') {
      a.alias = null;
      a.bio = null;
      const list = this.getAllBonds(a);
      for (let i = 0; i < list.length; ++i) {
        const b = list[i];
        if (b.type == JSDraw2.BONDTYPES.DUMMY)
          scil.Utils.removeArrayItem(this.bonds, b);
      }
    }

    a._parent.setHCount(a);
    if (e == 'R')
      a.updateRGroup();
    return true;
  }

  /**
   * Set atom charges
   * @function setAtomCharge
   * @param {Atom} a - the target atom
   * @param {number} charge - charges
   * @returns true of false
   */
  setAtomCharge(a: Atom<TBio>, charge: number | null): boolean {
    if (charge == null || isNaN(charge) || a.bio)
      return false;
    charge = Math.round(charge);
    if (a.charge == charge)
      return false;
    a.charge = charge;
    a._parent.setHCount(a);
    return true;
  }

  /**
   * Set bond type
   * @function setBondType
   * @param {Bond} b - the target bond
   * @param {BONDTYPES} type - predefined bond type
   * @returns true of false
   */
  setBondType(b: Bond<TBio>, type: BondType) {
    if (b.a1.biotype() == JSDraw2.BIO.AA && b.a2.biotype() == JSDraw2.BIO.AA) {
      if (b.type == JSDraw2.BONDTYPES.DISULFIDE && type == JSDraw2.BONDTYPES.PEPTIDE || b.type == JSDraw2.BONDTYPES.PEPTIDE && type == JSDraw2.BONDTYPES.DISULFIDE) {
        b.type = type;
        return true;
      }
    } else {
      if (type < JSDraw2.BONDTYPES.UNKNOWN && type > JSDraw2.BONDTYPES.DOUBLEORAROMATIC || b.a1.bio || b.a2.bio)
        return false;
      b.type = type;
      b._parent.setHCount(b.a1);
      b._parent.setHCount(b.a2);
      return true;
    }
  }

  isLoneAtom(a: Atom<TBio>): boolean {
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.a1 == a || b.a2 == a)
        return false;
    }

    return true;
  }

  medBondLength(defaultValue?: any): number {
    if (this.bonds.length == 0)
      return defaultValue;

    let step = Math.floor(this.bonds.length / 10);
    if (step == 0)
      step = 1;

    const list = [];
    for (let i = 0; i < this.bonds.length; i += step) {
      const b = this.bonds[i];
      list.push(b.a1.p.distTo(b.a2.p));
    }
    if (list.length == 0)
      return 1.5;
    if (list.length == 1)
      return list[0] <= 0 ? 1.5 : list[0];

    list.sort();
    const d = list[Math.round(list.length / 2)];
    return d <= 0 ? 1.5 : d;
  }

  _hasDoubleBonds(a: Atom<TBio>): boolean {
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.type == JSDraw2.BONDTYPES.DOUBLE && (b.a1 == a || b.a2 == a))
        return true;
    }
    return false;
  }

  getNeighborAtoms(a: Atom<TBio>, oa?: Atom<TBio>, excludeDummyBond?: boolean): Atom<TBio>[] {
    const list = [];
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (excludeDummyBond && b.type == JSDraw2.BONDTYPES.DUMMY)
        continue;

      if (b.a1 == a) {
        if (b.a2 != oa)
          list.push(b.a2);
      } else if (b.a2 == a) {
        if (b.a1 != oa)
          list.push(b.a1);
      }
    }
    return list;
  }

  getNeighborBonds(a: Atom<TBio>, excludeDummyBonds?: boolean): Bond<TBio>[] {
    const list: Bond<TBio>[] = [];
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if ((b.a1 == a || b.a2 == a) &&
        (!excludeDummyBonds || b.type != JSDraw2.BONDTYPES.DUMMY && b.type != JSDraw2.BONDTYPES.UNKNOWN))
        list.push(b);
    }
    return list;
  }

  /**
   * Remove all hydrogen atoms
   * @function removeHydrogens
   * @returns the count of removed atoms
   */
  removeHydrogens() {
    const hs = [];
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.elem == 'H' && a.isotope == null)
        hs.push(i);
    }

    for (let k = hs.length - 1; k >= 0; --k) {
      const a = this.atoms[hs[k]];
      for (let i = this.bonds.length - 1; i >= 0; --i) {
        const b = this.bonds[i];
        if (b.a1 == a || b.a2 == a)
          this.bonds.splice(i, 1);
      }

      this.atoms.splice(hs[k], 1);
    }

    return hs.length;
  }

  draw(surface: any, drawOpts: IDrawOptions, textonly: boolean, dimension: Point,
    highlighterrors: boolean, showcarbon?: string, simpledraw: boolean = false
  ): void {
    if (textonly) {
      for (let i = 0; i < this.graphics.length; ++i) {
        if (this.graphics[i].T == 'TEXT')
          this.graphics[i].draw(surface, this, drawOpts);
      }
    } else {
      for (let i = 0; i < this.atoms.length; ++i) {
        const a = this.atoms[i];
        a._outside = a.p.x < -JSDraw2.speedup.gap || a.p.x > dimension.x + JSDraw2.speedup.gap || a.p.y < -JSDraw2.speedup.gap || a.p.y > dimension.y + JSDraw2.speedup.gap;
        a._haslabel = a.hasLabel(this, showcarbon);
      }

      for (const drawStep of [DrawSteps.highlight, DrawSteps.select, DrawSteps.main]) {
        // draw bonds connect to hidden group atom
        const bonds = [];
        for (let i = 0; i < this.bonds.length; ++i) {
          const b = this.bonds[i];
          if (b.a1._outside && b.a2._outside && !b.a1.hidden && !b.a2.hidden)
            continue;

          if (!simpledraw || !b.selected) {
            if (this.moveHiddenAtomToGroupBorder(b.a1, b.a2) || this.moveHiddenAtomToGroupBorder(b.a2, b.a1))
              b.draw(surface, this, drawOpts, simpledraw, drawStep);
            else
              bonds.push(b);
          }
        }

        for (let i = 0; i < this.graphics.length; ++i)
          this.graphics[i].draw(surface, this, drawOpts, drawStep);

        for (let i = 0; i < bonds.length; ++i)
          bonds[i].draw(surface, this, drawOpts, simpledraw, drawStep);

        const tor = drawOpts.linewidth * 2;
        if (simpledraw) {
          // I#9069
          for (let i = 0; i < this.atoms.length; ++i) {
            const a = this.atoms[i];
            if (a._outside || !a.hasErr())
              continue;

            const w = 8;
            const r = new JSDraw2.Rect(a.p.x - w / 2, a.p.y - w / 2, w, w);
            JSDraw2.Drawer.drawRect(surface, r, 'red', drawOpts.linewidth).setFill('red');
          }
        } else {
          for (let i = 0; i < this.atoms.length; ++i) {
            const a = this.atoms[i];
            if (a._outside)
              continue;

            // check overlapping
            for (let k = i + 1; k < this.atoms.length; ++k) {
              const a1 = this.atoms[k];
              if (Math.abs(a.p.x - a1.p.x) < tor && Math.abs(a.p.y - a1.p.y) < tor) {
                const r = new JSDraw2.Rect(a.p.x - drawOpts.fontsize / 2, a.p.y - drawOpts.fontsize / 2, drawOpts.fontsize, drawOpts.fontsize);
                JSDraw2.Drawer.drawRect(surface, r, 'red', drawOpts.linewidth);
                break;
              }
            }

            a.draw(surface, this, drawOpts, highlighterrors, drawStep);
            if (a.rgroup != null && 2 === drawStep) {
              if (a.rgroup.text != null)
                a.rgroup.draw(surface, drawOpts.linewidth, this, drawOpts.fontsize);
              for (let j = 0; j < a.rgroup.mols.length; ++j)
                a.rgroup.mols[j].draw(surface, drawOpts, textonly, dimension, highlighterrors);
            }
          }
        }
      }

      this.drawSelect(new JSDraw2.Lasso(surface, drawOpts.linewidth * (simpledraw ? 5 : 1), false), simpledraw);

      let s = null;
      if (this.chiral == 'and')
        s = '[AND Enantiomer]';
      else if (this.chiral == 'or')
        s = '[OR Enantiomer]';
      else if (this.chiral == true)
        s = 'Chiral';

      if (s != null)
        JSDraw2.Drawer.drawText(surface, new JSDraw2.Point(dimension.x - drawOpts.fontsize * 4, drawOpts.fontsize * 1), s, 'gray', drawOpts.fontsize, TextAligns.right);
    }
  }

  moveHiddenAtomToGroupBorder(a: Atom<TBio>, a2: Atom<TBio>): boolean {
    if (!a.hidden)
      return false;

    const g = this._findGroup(a);
    if (g == null)
      return false;

    const r = g.rect();
    if (!a2.hidden) {
      // group to atom: use the closest border
      const p = a2.p;
      if (p.x < r.left)
        a.p.x = r.left;
      else if (p.x > r.right())
        a.p.x = r.right();
      else
        a.p.x = p.x;

      if (p.y < r.top)
        a.p.y = r.top;
      else if (p.y > r.bottom())
        a.p.y = r.bottom();
      else
        a.p.y = p.y;

      a._outside = false;
    } else {
      // group to group
      const g2 = this._findGroup(a2);
      if (g2 == null)
        return false;

      const r2 = g2.rect();
      if (r.left >= r2.left && r.left <= r2.right() || r.right() >= r2.left && r.right() <= r2.right() || r2.left >= r.left && r2.left <= r.right() || r2.right() >= r.left && r2.right() <= r.right()) {
        // vertically overlapped: vertical center
        const x = (Math.max(r.left, r2.left) + Math.min(r.right(), r2.right())) / 2;
        a.p.x = a2.p.x = x;
        a.p.y = r.bottom() < r2.top ? r.bottom() : r.top;
        a2.p.y = r2.top > r.bottom() ? r2.top : r2.bottom();
      } else if (r.top >= r2.top && r.top <= r2.bottom() || r.bottom() >= r2.top && r.bottom() <= r2.bottom() || r2.top >= r.top && r2.top <= r.bottom() || r2.bottom() >= r.top && r2.bottom() <= r.bottom()) {
        // horizontally overlapped: horizontal center
        const y = (Math.max(r.top, r2.top) + Math.min(r.bottom(), r2.bottom())) / 2;
        a.p.y = a2.p.y = y;
        a.p.x = r.right() < r2.left ? r.right() : r.left;
        a2.p.x = r2.left > r.right() ? r2.left : r2.right();
      } else {
        // then corner to corner
        if (r.right() < r2.left) {
          if (r.bottom() < r2.top) {
            a.p = r.bottomright();
            a2.p = r2.topleft();
          } else {
            a.p = r.topright();
            a2.p = r2.bottomleft();
          }
        } else {
          if (r.bottom() < r2.top) {
            a.p = r.bottomleft();
            a2.p = r2.topright();
          } else {
            a.p = r.topleft();
            a2.p = r2.bottomright();
          }
        }
      }

      a._outside = false;
      a2._outside = false;
    }

    return true;
  }

  _findGroup(a: Atom<TBio>): Group<TBio> | null {
    for (let i = 0; i < this.graphics.length; ++i) {
      const g = JSDraw2.Group.cast<TBio>(this.graphics[i]);
      if (g != null && g.a == a)
        return g;
    }

    return null;
  }

  drawSelect(lasso: Lasso<TBio>, simpledraw: boolean): void {
    for (let i = 0; i < this.graphics.length; ++i) {
      if (this.graphics[i].selected)
        this.graphics[i].drawSelect(lasso);
    }

    for (let i = 0; i < this.atoms.length; ++i)
      this.atoms[i].__drawselect = false;

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.selected) {
        b.drawSelect(lasso);
        if (simpledraw) {
          b.a1.__drawselect = true;
          b.a2.__drawselect = true;
        }
      }
    }

    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.selected && !a.__drawselect)
        a.drawSelect(lasso);

      if (a.rgroup != null) {
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          a.rgroup.mols[j].drawSelect(lasso, simpledraw);
      }
    }
  }

  setZOrder(g: IGraphics, z: number): boolean {
    const i = scil.Utils.indexOf(this.graphics, g);
    if (i < 0 || this.graphics.length == 1)
      return false;

    if (z == 0) {
      if (z != i) {
        this.graphics.splice(i, 1);
        this.graphics.splice(0, 0, g);
      }
    } else if (z == -1) {
      if (i != this.graphics.length - 1) {
        this.graphics.splice(i, 1);
        this.graphics.push(g);
      }
    }

    return true;
  }

  calcHDir(a: Atom<TBio>, tor: number, drawalias?: boolean): number {
    const atoms = this.getNeighborAtoms(a);
    if (atoms.length == 0 && a.charge == 0)
      return drawalias ? JSDraw2.ALIGN.RIGHT : JSDraw2.ALIGN.LEFT;

    let r = false;
    let b = false;
    let l = false;
    let t = false;
    for (let i = 0; i < atoms.length; ++i) {
      const oa = atoms[i];
      const dx = oa.p.x - a.p.x;
      const dy = oa.p.y - a.p.y;
      if (dx > tor)
        r = true;
      else if (dx < -tor)
        l = true;
      if (dy > tor)
        b = true;
      else if (dy < -tor)
        t = true;
    }

    if (!r)
      return JSDraw2.ALIGN.RIGHT;
    else if (!l)
      return JSDraw2.ALIGN.LEFT;
    else if (!b)
      return JSDraw2.ALIGN.BOTTOM;
    else if (!t)
      return JSDraw2.ALIGN.TOP;
    return JSDraw2.ALIGN.RIGHT;
  }

  /**
   * Set molfile
   * @function setMolfile
   * @param {string} molfile - the input molfile
   * @returns the Mol object
   */
  setMolfile(molfile: string, rxn?: boolean): Mol<TBio> | null {
    const m = this.setMolfile2(molfile, rxn);
    if (m != null)
      this.guessSuperAtoms();
    return m;
  }

  guessSuperAtoms() {
    return 0;
  }

  setMolfile2(molfile: string, rxn?: boolean): Mol<TBio> | null {
    if (molfile != null && molfile.length > 4) {
      if (molfile.substr(0, 4) == '$RXN')
        return this.setRxnfile(molfile);
      if (molfile.substr(0, 4) == '$MDL')
        return this.setRgfile(molfile);
    }

    this.clear();
    if (molfile == null || molfile.length == 0)
      return null;

    let lines = null;
    if (molfile.indexOf('\n') >= 0)
      lines = molfile.split('\n');
    else
      lines = molfile.split('|');

    for (let i = 0; i <= Math.min(3, lines.length - 1); ++i) {
      if (lines[i].toUpperCase().indexOf(' V2000') > 0) {
        this.setMolV2000(lines, i, rxn);
        if (i == 3)
          this.name = scil.Utils.trim(lines[0]);
        return this;
      } else if (lines[i].toUpperCase().indexOf(' V3000') > 0) {
        this.setMolV3000(lines, i + 1, rxn);
        if (i + 1 == 3)
          this.name = scil.Utils.trim(lines[0]);
        return this;
      }
    }
    return null;
  }

  setMolV2000(lines: string[], start: number, rxn?: boolean, rAtoms?: Atom<TBio>[]): Mol<TBio> | null {
    const natoms = parseFloat(lines[start].substr(0, 3));
    const nbonds = parseFloat(lines[start].substr(3, 3));
    const chiral = lines[start].substr(12, 3);
    if (!JSDraw2.defaultoptions.and_enantiomer)
      this.chiral = chiral == '  1';
    if (isNaN(natoms) || isNaN(nbonds))
      return null;
    ++start;

    for (let i = start; i < natoms + start; i++) {
      const s: string = lines[i];
      const x = parseFloat(s.substr(0, 10));
      const y = -parseFloat(s.substr(10, 10));
      let e = scil.Utils.trim(s.substr(31, 3));
      const c = s.length >= 39 ? parseInt(s.substr(36, 3)) : 0;
      const ami = rxn && s.length >= 63 ? parseInt(s.substr(60, 3)) : 0;
      const hs = s.length >= 45 ? parseInt(s.substr(42, 3)) : 0;
      const val = s.length >= 51 ? parseInt(s.substr(48, 3)) : 0;

      if (isNaN(x) || isNaN(y) || isNaN(c))
        return null;

      let alias = null;
      if ((/^R[0-9]+$/).test(e)) {
        alias = e;
        e = 'R';
      }
      const a = new JSDraw2.Atom<TBio>(new JSDraw2.Point(x, y), e == 'R#' ? 'R' : e);
      a.alias = alias;
      if (ami > 0)
        a.atommapid = ami;
      if (hs > 0 && hs <= 5)
        a.hs = hs;
      if (val > 0 && val <= 15)
        a.val = val;
      this._addAtom(a);
      switch (c) {
      case 1:
        a.charge = 3;
        break;
      case 2:
        a.charge = 2;
        break;
      case 3:
        a.charge = 1;
        break;
      case 5:
        a.charge = -1;
        break;
      case 6:
        a.charge = -2;
        break;
      case 7:
        a.charge = -3;
        break;
      }
    }

    start += natoms;
    for (let i = start; i < (nbonds + start); i++) {
      const line = lines[i];
      const sI: number = parseFloat(line.substr(0, 3)) - 1;
      const eI: number = parseFloat(line.substr(3, 3)) - 1;
      const order = parseInt(line.substr(6, 3));
      const stereo = parseInt(line.substr(9, 3));
      const ring = line.length >= 18 ? parseInt(line.substr(15, 3)) : null;
      const rcenter: string | null = line.length >= 21 ? line.substr(18, 3) : null;
      if (isNaN(sI) || isNaN(eI) || isNaN(order))
        return null;

      const a1 = this.atoms[sI];
      const a2 = this.atoms[eI];
      let b!: BondTypes;
      switch (order) {
      case 0:
        b = JSDraw2.BONDTYPES.UNKNOWN;
        break;
      case 1:
        switch (stereo) {
        case 1:
          b = JSDraw2.BONDTYPES.WEDGE;
          break;
        case 4:
          b = JSDraw2.BONDTYPES.WIGGLY;
          break;
        case 6:
          b = JSDraw2.BONDTYPES.HASH;
          break;
        default:
          b = JSDraw2.BONDTYPES.SINGLE;
          break;
        }
        break;
      case 2:
        b = stereo == 3 ? JSDraw2.BONDTYPES.EITHER : JSDraw2.BONDTYPES.DOUBLE;
        break;
      case 3:
        b = JSDraw2.BONDTYPES.TRIPLE;
        break;
      case 4:
        b = JSDraw2.BONDTYPES.DELOCALIZED;
        break;
      case 5:
        b = JSDraw2.BONDTYPES.SINGLEORDOUBLE;
        break;
      case 6:
        b = JSDraw2.BONDTYPES.SINGLEORAROMATIC;
        break;
      case 7:
        b = JSDraw2.BONDTYPES.DOUBLEORAROMATIC;
        break;
      case 8:
        b = JSDraw2.BONDTYPES.UNKNOWN;
        break;
      case 9:
        b = JSDraw2.BONDTYPES.DUMMY;
        break;
      }
      const bond = new JSDraw2.Bond(a1, a2, b);
      if (ring == 1)
        bond.ring = true;
      else if (ring == 2)
        bond.ring = false;
      if (rxn)
        this.readRxnCenter(bond, rcenter);
      this._addBond(bond);
    }

    const sgroups: SubGroup[] = [];
    start += nbonds;
    for (let i = start; i < lines.length; ++i) {
      const s = scil.Utils.rtrim(lines[i]);
      const token = s.length >= 6 ? s.substr(0, 6) : null;
      const token3 = s.length >= 6 ? s.substr(0, 3) : null;
      if (token == 'M  ISO') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const ai = parseInt(s.substr(10 + k * 8, 3));
          const v = parseInt(s.substr(14 + k * 8, 3));
          if (isNaN(ai) || isNaN(v))
            return null;
          this.atoms[ai - 1].isotope = v;
        }
      } else if (token == 'M  RAD') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const ai = parseInt(s.substr(10 + k * 8, 3));
          const v = parseInt(s.substr(14 + k * 8, 3));
          if (isNaN(ai) || isNaN(v))
            return null;
          if (v >= 1 && v <= 3)
            this.atoms[ai - 1].radical = v;
        }
      } else if (token == 'M  CHG') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const ai = parseInt(s.substr(10 + k * 8, 3));
          const v = parseInt(s.substr(14 + k * 8, 3));
          if (isNaN(ai) || isNaN(v))
            return null;
          this.atoms[ai - 1].charge = v;
        }
      } else if (token == 'M  ALS') {
        //M  ALS   7  4 F C   N   S   O
        const ai = parseInt(s.substr(7, 3));
        const n = parseInt(s.substr(10, 3));
        const f = s.substr(14, 1) == 'F';
        const list = [];
        for (let k = 0; k < n; ++k) {
          const el = scil.Utils.trim(s.substr(16 + k * 4, 4));
          if (JSDraw2.PT.isValidAtomList(el))
            list.push(el);
        }
        const a = this.atoms[ai - 1];
        if (a.query == null)
          a.query = {};
        a.query.t = f;
        a.query.als = list;
      } else if (token == 'M  SUB') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const ai = parseInt(s.substr(9 + 8 * k + 1, 3));
          const v = parseInt(s.substr(9 + 8 * k + 5, 3));
          const a = this.atoms[ai - 1];
          if (a.query == null)
            a.query = {};
          if (v == -1)
            a.query.sub = 0;
          else if (v == -2)
            a.query.sub = '*';
          else
            a.query.v = v;
        }
      } else if (token == 'M  UNS') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const ai = parseInt(s.substr(9 + 8 * k + 1, 3));
          const v = parseInt(s.substr(9 + 8 * k + 5, 3));
          const a = this.atoms[ai - 1];
          if (a.query == null)
            a.query = {};
          a.query.uns = v == 1;
        }
      } else if (token == 'M  RBC') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const ai = parseInt(s.substr(9 + 8 * k + 1, 3));
          const v = parseInt(s.substr(9 + 8 * k + 5, 3));
          const a = this.atoms[ai - 1];
          if (v == -1 || v > 0) {
            if (a.query == null)
              a.query = {};
            a.query.rbc = v == -1 ? 0 : v;
          }
        }
      } else if (token == 'M  RGP') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const ai = parseInt(s.substr(10 + k * 8, 3));
          const rr = parseInt(s.substr(14 + k * 8, 3));
          if (isNaN(ai) || isNaN(rr))
            return null;
          if (this.atoms[ai - 1].elem == 'R') {
            const a = this.atoms[ai - 1];
            if (a.alias == null || a.alias == '')
              a.alias = 'R' + rr;
            if (rAtoms != null)
              rAtoms[rr] = a;
          }
        }
      } else if (token == 'M  APO') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const ai = parseInt(s.substr(10 + k * 8, 3));
          const rr = parseInt(s.substr(14 + k * 8, 3));
          if (!isNaN(ai) && !isNaN(rr) && this.atoms[ai - 1] != null)
            this.atoms[ai - 1].attachpoints.push(rr);
        }
      } else if (token == 'M  STY') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const si = parseInt(s.substr(10 + k * 8, 3));
          const sn = s.substr(14 + k * 8, 3);
          let br = null;
          if (sn == 'DAT') {
            br = new JSDraw2.Text<TBio>();
          } else if (sn == 'SUP') {
            br = {type: 'SUPERATOM', atoms: []};
          } else {
            for (const ty in JSDraw2.SGroup.stys) {
              if (JSDraw2.SGroup.stys[ty] == sn) {
                br = new JSDraw2.Bracket(ty == '' ? null : ty, null);
                break;
              }
            }
            if (br == null)
              br = new JSDraw2.Bracket(null, null);
          }
          if (br != null)
            sgroups[si] = br;
        }
      } else if (token == 'M  SMT') {
        const si = parseInt(s.substr(7, 3));
        let sa = s.substr(11);
        if (sa.length > 0 && sa.substr(0, 1) == '^')
          sa = sa.substr(1);
        sgroups[si].subscript = sa;
      } else if (token == 'M  SCL') {
        const si = parseInt(s.substr(7, 3));
        sgroups[si].cls = s.substr(11);
      } else if (token == 'M  SPL') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const ci = parseInt(s.substr(10 + k * 8, 3));
          const pi = parseInt(s.substr(14 + k * 8, 3));
          if (JSDraw2.Text.cast<TBio>(sgroups[ci]) != null && JSDraw2.Bracket.cast<TBio>(sgroups[pi]) != null)
            sgroups[ci].anchors = [sgroups[pi]]; // text attached to bracket
        }
      } else if (token == 'M  SCN') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const si = parseInt(s.substr(10 + k * 8, 3));
          const conn = s.substr(14 + k * 8, 2);
          if (JSDraw2.Bracket.cast<TBio>(sgroups[si]) != null)
            sgroups[si].conn = conn;
        }
      } else if (token == 'M  SNC') {
        const n = parseInt(s.substr(6, 3));
        for (let k = 0; k < n; ++k) {
          const si = parseInt(s.substr(10 + k * 8, 3));
          const num = scil.Utils.trim(s.substr(14 + k * 8, 2));
          if (JSDraw2.Bracket.cast<TBio>(sgroups[si]) != null) {
            if (sgroups[si].type == 'c')
              sgroups[si].type = 'c' + num;
            else if (sgroups[si].type == 'mul')
              sgroups[si].type = num + '';
          }
        }
      } else if (token == 'M  SAL') {
        const si = parseInt(s.substr(7, 3));
        const sg = sgroups[si];
        if (sg != null) {
          const n = parseInt(s.substr(10, 3));
          for (let k = 0; k < n; ++k) {
            const ai = parseInt(s.substr(14 + k * 4, 3));
            const a = this.atoms[ai - 1];
            if (a != null) {
              if (sg.type == 'SUPERATOM')
                sg.atoms.push(a);
              else if (JSDraw2.Bracket.cast<TBio>(sg) != null)
                sg.atoms.push(a);
              else if (JSDraw2.Text.cast<TBio>(sg) != null)
                sg.anchors.push(a);
            }
          }
        }
      } else if (token == 'M  SPA') {
        const si = parseInt(s.substr(7, 3));
        const sg = sgroups[si];
        if (JSDraw2.Bracket.cast<TBio>(sg) != null && sg.type == 'mul') {
          const n = parseInt(s.substr(10, 3));
          for (let k = 0; k < n; ++k) {
            const ai = parseInt(s.substr(14 + k * 4, 3));
            const a = this.atoms[ai - 1];
            if (a != null) {
              if (sg.spa == null)
                sg.spa = [];
              sg.spa.push(a);
            }
          }
        }
      } else if (token == 'M  SBL') {
        const si = parseInt(s.substr(7, 3));
        const sg = sgroups[si];
        const n = parseInt(s.substr(10, 3));
        for (let k = 0; k < n; ++k) {
          const bi = parseInt(s.substr(14 + k * 4, 3));
          const b = this.bonds[bi - 1];
          if (b != null && JSDraw2.Text.cast<TBio>(sg) != null)
            sg.anchors.push(b);
        }
      } else if (token == 'M  SDI') {
        const si = parseInt(s.substr(7, 3));
        const sg = sgroups[si];
        const n = parseInt(s.substr(10, 3));
        if (sg != null && n == 4) {
          const p1 = new JSDraw2.Point(parseFloat(s.substr(13, 10)), -parseFloat(s.substr(23, 10)));
          const p2 = new JSDraw2.Point(parseFloat(s.substr(33, 10)), -parseFloat(s.substr(43, 10)));
          if (p1.isValid() && p2.isValid()) {
            if (sg._rect == null)
              sg._rect = new JSDraw2.Rect().set(p1, p2);
            else
              sg._rect.unionPoint(p1).unionPoint(p2);
          }
        }
      } else if (token == 'M  SDT') {
        const si = parseInt(s.substr(7, 3));
        const sg = sgroups[si];
        if (JSDraw2.Text.cast<TBio>(sg) != null)
          sg.fieldtype = scil.Utils.trim(s.substr(11, 30));
      } else if (token == 'M  SDD') {
        const si = parseInt(s.substr(7, 3));
        const sg = sgroups[si];
        if (JSDraw2.Text.cast<TBio>(sg) != null) {
          const p = new JSDraw2.Point(parseFloat(s.substr(11, 10)), -parseFloat(s.substr(21, 10)));
          if (p.isValid())
            sg._rect = new JSDraw2.Rect(p.x, p.y, 0, 0);
        }
      } else if (token == 'M  SED') {
        const si = parseInt(s.substr(7, 3));
        const sg = sgroups[si];
        if (JSDraw2.Text.cast<TBio>(sg) != null)
          sg.text = scil.Utils.trim(s.substr(11));
      } else if (token3 == 'A  ') {
        const ai = parseInt(s.substr(3, 3));
        ++i;
        this.atoms[ai - 1].alias = scil.Utils.trim(lines[i]);
      } else if (token3 == 'V  ') {
        const ai = parseInt(s.substr(3, 3));
        const v = scil.Utils.trim(s.substr(7));
        this.atoms[ai - 1].tag = v;
      } else if (token == 'M  END') {
        break;
      }
    }

    const superatoms = [];
    const brackets: Bracket<TBio>[] = [];
    const gap = this.medBondLength(1.56) / 2;
    for (let i = 0; i < sgroups.length; ++i) {
      // post-process sgroups
      const sg = sgroups[i];
      if (sg == null)
        continue;
      const br = JSDraw2.Bracket.cast<TBio>(sg);
      if (sg._rect != null && (br != null || sg.text != null && sg.text != '')) {
        this.addGraphics(sg);
        if (br != null) {
          if (br.getType() != '') {
            //this.setSgroup(br, "BRACKET_TYPE", br.getType(), br._rect.right() + gap / 4, br._rect.bottom() - gap);
            this.setSgroup(br, 'BRACKET_TYPE', br.subscript || br.getType(), br._rect.right() + gap / 4, br._rect.bottom() - gap);
          } else
            brackets.push(br);
          if (br.conn != null && br.conn != '')
            this.setSgroup(br, 'BRACKET_CONN', br.conn.toLowerCase(), br._rect.right() + gap / 4, br._rect.top - gap / 4);
          // @ts-ignore
          JSDraw2.SuperAtoms.collapseRepeat(this, br);
        } else {
          if (scil.Utils.endswith(sg.fieldtype, '_TYPE') && sg.fieldtype != 'BRACKET_TYPE')
            sg.fieldtype = 'BRACKET_SUBTYPE';
          else if (scil.Utils.endswith(sg.fieldtype, '_MOD'))
            sg.fieldtype = 'BRACKET_MOD';
        }
      } else if (sg.type == 'SUPERATOM') {
        const na = new JSDraw2.Atom<TBio>(null, 'C');
        const m = new JSDraw2.Mol();
        superatoms.push({a: na, m: m});
        m.atoms = sg.atoms;
        for (let k = 0; k < m.atoms.length; ++k)
          scil.Utils.removeArrayItem(this.atoms, m.atoms[k]);

        let p = null;
        let apo = 0;
        for (let j = this.bonds.length - 1; j >= 0; --j) {
          const b = this.bonds[j];
          const f1 = scil.Utils.indexOf(m.atoms, b.a1);
          const f2 = scil.Utils.indexOf(m.atoms, b.a2);
          if (f1 >= 0 && f2 >= 0) {
            m.bonds.splice(0, 0, b);
            this.bonds.splice(j, 1);
          } else if (f1 >= 0) {
            if (p == null)
              p = b.a1.p.clone();
            b.a1.attachpoints.push(++apo);
            b.apo1 = apo;
            b.a1 = na;
          } else if (f2 >= 0) {
            if (p == null)
              p = b.a2.p.clone();
            b.a2.attachpoints.push(++apo);
            b.apo2 = apo;
            b.a2 = na;
          }
        }

        na.p = p != null ? p : m.atoms[0].p.clone();
        na.superatom = m;
        na.alias = sg.subscript;
        switch (sg.cls) {
        case 'AminoAcid':
        case 'AA':
          na.bio = {type: JSDraw2.BIO.AA as TBio};
          na.elem = na.alias!;
          na.alias = null;
          break;
        case 'BASE':
        case 'DNA':
          na.bio = {type: JSDraw2.BIO.BASE_DNA as TBio};
          na.elem = na.alias!;
          na.alias = null;
          break;
        case 'RNA':
          na.bio = {type: JSDraw2.BIO.BASE_RNA as TBio};
          na.elem = na.alias!;
          na.alias = null;
          break;
        }
        this._addAtom(na);
      }
    }

    for (let i = 0; i < brackets.length; ++i) {
      const br = brackets[i];
      const t = this.getSgroupText(br, 'BRACKET_TYPE');
      if (t != null)
        brackets[i].type = t.text;

      if (br.atoms != null) {
        for (let k = 0; k < superatoms.length; ++k) {
          const a = superatoms[k].a;
          const m = superatoms[k].m;
          if (scil.Utils.removeArrayItems(br.atoms, m.atoms) > 0)
            br.atoms.push(a);
        }
      }
    }

    // set R groups: some R groups are only marked using alias
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.elem == 'C' && a.alias != null && (/^R[0-9]+$/).test(a.alias)) {
        const alias = a.alias;
        a.alias = null;
        this.setAtomAlias(a, alias);
      }
    }

    if (JSDraw2.defaultoptions.and_enantiomer) {
      if (this.hasStereoCenter() && chiral == '  0')
        this.chiral = ChiralTypes.AND;
    }
    return this;
  }

  hasRGroup() {
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.elem == 'R')
        return true;
    }
    return false;
  }

  /**
   * Get molfile
   * @function getMolfile
   * @param {bool} rxn - get it as a Rxn file
   * @param {bool} v3000 - render it in Molfile V3000 format
   * @returns a string
   */
  getMolfile(rxn?: any, v3000?: boolean, excludeDummyBonds?: boolean): string {
    if (v3000 == null) {
      if (this.needV3000())
        v3000 = true;
    }

    if (v3000)
      return this.getMolV3000(rxn);
    else
      return this.getMolV2000(rxn, excludeDummyBonds);
  }

  needV3000() {
    return this.atoms.length > 999 || this.bonds.length > 999 || this.hasEnhancedStereochemistry();
  }

  getRgfile(rxn: boolean, rgroups: RGroupsType<TBio>, superatoms: any[]): string | null {
    return null;
  }

  _getRgroups(rgroups?: RGroupsType<TBio>): RGroupsType<TBio> {
    if (rgroups == null)
      rgroups = {n: 0, list: []};

    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      a.iR = null;
      if (a.elem == 'R' && (a.alias != null && a.alias != '' || a.rgroup != null)) {
        a.iR = ++rgroups.n;
        if (a.rgroup != null && a.rgroup.mols.length > 0)
          rgroups.list.push(a);
      }
    }
    return rgroups;
  }

  getSubMol(atoms: Atom<TBio>[]): SubMolType<TBio> {
    const m = this;
    const set: SubMolType<TBio> = {atoms: scil.clone(atoms), bonds: [], openbonds: []};
    for (let j = 0; j < m.bonds.length; ++j) {
      const b = m.bonds[j];
      const f1 = scil.Utils.indexOf(atoms, b.a1) >= 0;
      const f2 = scil.Utils.indexOf(atoms, b.a2) >= 0;
      if (f1 && f2) {
        //if (scil.Utils.indexOf(set.atoms, b.a1) < 0)
        //    set.atoms.push(b.a1);
        //if (scil.Utils.indexOf(set.atoms, b.a2) < 0)
        //    set.atoms.push(b.a2);
        set.bonds.push(b);
      } else if (f1) {
        //if (scil.Utils.indexOf(set.atoms, b.a1) < 0)
        //    set.atoms.push(b.a1);
        set.openbonds.push({b: b, oa: b.a2});
      } else if (f2) {
        //if (scil.Utils.indexOf(set.atoms, b.a2) < 0)
        //    set.atoms.push(b.a2);
        set.openbonds.push({b: b, oa: b.a1});
      }
    }

    return set;
  }

  expandSuperAtoms(superatoms2?: SuperAtomType<TBio>[]): Mol<TBio> {
    const superatoms = [];

    const m = this.clone(null);
    const list = scil.clone(m.atoms);
    for (let i = 0; i < list.length; ++i) {
      const a = list[i];
      if (a.superatom != null) {
        //@ts-ignore
        const m2: Molt<TBio> = JSDraw2.SuperAtoms.addToMol(m, a, a.superatom);
        superatoms.push({a: a, m: m2});
        if (superatoms2 != null)
          superatoms2.push({a: a, m: m2});
      } else if (a.elem == '5\'') {
        m.setAtomType(a, 'H');
      } else if (a.elem == '3\'') {
        m.setAtomType(a, 'O');
      }
    }

    for (let i = 0; i < m.graphics.length; ++i) {
      const br = JSDraw2.Bracket.cast<TBio>(m.graphics[i]);
      if (br == null)
        continue;

      if (br.atoms != null && superatoms != null) {
        const atoms = [];
        let m2: Mol<TBio> | null = null;
        for (let k = 0; k < br.atoms.length; ++k) {
          for (let j = 0; j < superatoms.length; ++j) {
            if (br.atoms[k] == superatoms[j].a) {
              m2 = superatoms[j].m;
              break;
            }
          }
          if (m2 == null) {
            atoms.push(br.atoms[k]);
          } else {
            for (let j = 0; j < m2.atoms.length; ++j)
              atoms.push(m2.atoms[j]);
          }
        }
        br.atoms = atoms;
      }

      // @ts-ignore
      JSDraw2.SuperAtoms.expandRepeat(m, br);
    }

    m.calcHCount(true);
    return m;
  }

  getMolV2000(rxn: boolean, excludeDummyBonds?: boolean): string {
    const superatoms: SuperAtomType<TBio>[] = [];
    const m = this.expandSuperAtoms(superatoms);
    m.chiral = this.chiral;

    if (excludeDummyBonds) {
      for (let i = m.bonds.length - 1; i >= 0; --i) {
        const b = m.bonds[i];
        if (b.type == JSDraw2.BONDTYPES.DUMMY)
          m.bonds.splice(i, 1);
      }
    }

    const hasRgroup = false;
    const rgroups = m._getRgroups();
    if (rgroups.list.length > 0)
      return m.getRgfile(rxn, rgroups, superatoms)!;

    let s = (m.name == null ? '' : m.name) + '\n';
    s += m._getMolHeader();
    s += '\n';
    s += m._getMolV2000(rxn, null, superatoms);
    return s;
  }

  allAtoms(list?: Atom<TBio>[]): Atom<TBio>[] {
    if (list == null)
      list = [];
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      list.push(a);
      if (a.rgroup != null) {
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          a.rgroup.mols[j].allAtoms(list);
      }
    }
    return list;
  }

  allBonds(list?: Bond<TBio>[]): Bond<TBio>[] {
    if (list == null)
      list = [];
    for (let i = 0; i < this.bonds.length; ++i)
      list.push(this.bonds[i]);

    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.rgroup != null) {
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          a.rgroup.mols[j].allBonds(list);
      }
    }
    return list;
  }

  _getMolTime() {
    const dt = new Date();
    const yr = dt.getFullYear() + '';
    return scil.Utils.formatStr(dt.getMonth() + 1, 2, 0).replace(' ', '0') +
      scil.Utils.formatStr(dt.getDate(), 2, 0).replace(' ', '0') +
      yr.substr(2) +
      scil.Utils.formatStr(dt.getHours(), 2, 0).replace(' ', '0') +
      scil.Utils.formatStr(dt.getMinutes(), 2, 0).replace(' ', '0');
  }

  _getMolHeader() {
    const dt = new Date();
    const yr = dt.getFullYear() + '';
    return '   JSDraw2' + this._getMolTime() + '2D\n';
  }

  _getMolV2000(rxn: boolean, rgroups: any, superatoms: SuperAtomType<TBio>[]): string {
    if (rgroups != null)
      this._getRgroups(rgroups);

    const len = this.bondlength! > 0 ? this.bondlength : this.medBondLength();
    const scale = len! > 0 ? (1.56 / len!) : 1.0;

    let s = '';
    s += scil.Utils.formatStr(this.atoms.length, 3, 0);
    s += scil.Utils.formatStr(this.bonds.length, 3, 0);
    s += '  0  0';
    if (this.hasStereoCenter() && this.chiral != 'and')
      s += '  1';
    else
      s += '  0';
    s += '  0              0 V2000\n';

    let isotopes = '';
    let radicals = '';
    let tags = '';
    let query = '';
    let rgp = '';
    let apo = '';
    let astr = '';
    this.resetIds();
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.isotope != null)
        isotopes += 'M  ISO' + '  1' + scil.Utils.formatStr(i + 1, 4, 0) + scil.Utils.formatStr(a.isotope, 4, 0) + '\n';
      if (a.radical! >= 1 && a.radical! <= 3)
        radicals += 'M  RAD  1' + scil.Utils.formatStr(i + 1, 4, 0) + scil.Utils.formatStr(a.radical!, 4, 0) + '\n';
      if (a.tag != null && a.tag != '')
        tags += 'V  ' + scil.Utils.formatStr(i + 1, 3, 0) + ' ' + a.tag + '\n';
      if (a.alias != null && a.alias != '')
        astr += 'A  ' + scil.Utils.formatStr(i + 1, 3, 0) + '\n' + a.alias + '\n';
      for (let k = 0; k < a.attachpoints.length; ++k)
        apo += 'M  APO  1' + scil.Utils.formatStr(i + 1, 4, 0) + scil.Utils.formatStr(a.attachpoints[k], 4, 0) + '\n';
      if (a.query != null) {
        if (a.query.als != null && a.query.als.length > 0) {
          query += 'M  ALS ' + scil.Utils.formatStr(i + 1, 3, 0) + scil.Utils.formatStr(a.query.als.length, 3, 0) + (a.query.t == false ? ' T ' : ' F ');
          for (let k = 0; k < a.query.als.length; ++k)
            query += scil.Utils.padRight(a.query.als[k], 4, ' ');
          query += '\n';
        }
        if (a.query.rbc != null)
          query += 'M  RBC  1' + scil.Utils.formatStr(i + 1, 4, 0) + scil.Utils.formatStr(a.query.rbc == 0 ? -1 : a.query.rbc, 4, 0) + '\n';
        if (a.query.uns != null)
          query += 'M  UNS  1' + scil.Utils.formatStr(i + 1, 4, 0) + scil.Utils.formatStr(a.query.uns ? 1 : 0, 4, 0) + '\n';
        if (a.query.sub != null)
          query += 'M  SUB  1' + scil.Utils.formatStr(i + 1, 4, 0) + scil.Utils.formatStr(a.query.sub == 0 ? -1 : (a.query.sub == '*' ? -2 : a.query.sub), 4, 0) + '\n';
      }

      let elem = a.elem;
      if (a.elem == 'R') {
        if ((a.iR as number) > 0) {
          elem = 'R#';
          rgp += 'M  RGP  1' + scil.Utils.formatStr(i + 1, 4, 0) + scil.Utils.formatStr(parseInt(a.iR as string), 4, 0) + '\n';
        } else {
          elem = 'R';
        }
      } else if (elem == 'H') {
        if (a.isotope == 2)
          elem = 'D';
        else if (a.isotope == 3)
          elem = 'T';
      }

      s += scil.Utils.formatStr(a.p.x * scale, 10, 4);
      s += scil.Utils.formatStr(-a.p.y * scale, 10, 4);
      s += scil.Utils.formatStr(0, 10, 4);
      s += ' ';
      s += scil.Utils.padRight(elem, 2, ' ');
      s += '  0';
      let c = 0;
      switch (a.charge) {
      case 1:
        c = 3;
        break;
      case 2:
        c = 2;
        break;
      case 3:
        c = 1;
        break;
      case -1:
        c = 5;
        break;
      case -2:
        c = 6;
        break;
      case -3:
        c = 7;
        break;
      }
      s += scil.Utils.formatStr(c, 3, 0);

      s += '  0';
      if (a.hs! > 0)
        s += scil.Utils.formatStr(a.hs!, 3, 0);
      else
        s += '  0';

      s += '  0  0';
      if (a.val > 0)
        s += scil.Utils.formatStr(a.val, 3, 0);
      else
        s += '  0';

      s += '  0  0';
      if (rxn && a.atommapid! > 0)
        s += scil.Utils.formatStr(a.atommapid!, 3, 0);
      else
        s += '  0';
      s += '  0  0\n';
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];

      s += scil.Utils.formatStr(b.a1.id!, 3, 0);
      s += scil.Utils.formatStr(b.a2.id!, 3, 0);

      let order = 0;
      let stereo = 0;
      switch (b.type) {
      case JSDraw2.BONDTYPES.UNKNOWN:
        order = 8;
        break;
      case JSDraw2.BONDTYPES.DUMMY:
        order = 9;
        break;
      case JSDraw2.BONDTYPES.DOUBLEORAROMATIC:
        order = 7;
        break;
      case JSDraw2.BONDTYPES.SINGLEORAROMATIC:
        order = 6;
        break;
      case JSDraw2.BONDTYPES.SINGLEORDOUBLE:
        order = 5;
        break;
      case JSDraw2.BONDTYPES.SINGLE:
      case JSDraw2.BONDTYPES.DOUBLE:
      case JSDraw2.BONDTYPES.TRIPLE:
      case JSDraw2.BONDTYPES.DELOCALIZED:
        order = b.type;
        stereo = 0;
        break;
      case JSDraw2.BONDTYPES.PEPTIDE:
      case JSDraw2.BONDTYPES.NUCLEOTIDE:
      case JSDraw2.BONDTYPES.DISULFIDE:
      case JSDraw2.BONDTYPES.AMIDE:
        order = 1;
        stereo = 0;
        break;
      case JSDraw2.BONDTYPES.WEDGE:
      case JSDraw2.BONDTYPES.BOLD:
        order = 1;
        stereo = 1;
        break;
      case JSDraw2.BONDTYPES.HASH:
      case JSDraw2.BONDTYPES.BOLDHASH:
        order = 1;
        stereo = 6;
        break;
      case JSDraw2.BONDTYPES.WIGGLY:
        order = 1;
        stereo = 4;
        break;
      case JSDraw2.BONDTYPES.EITHER:
        order = 2;
        stereo = 3;
        break;
      }
      s += scil.Utils.formatStr(order, 3, 0);
      s += scil.Utils.formatStr(stereo, 3, 0);
      s += scil.Utils.formatStr(0, 3, 0);
      if (b.ring != null)
        s += scil.Utils.formatStr(b.ring ? 1 : 2, 3, 0);
      else
        s += scil.Utils.formatStr(0, 3, 0);
      s += scil.Utils.formatStr(b.rcenter == null ? 0 : b.rcenter, 3, 0);
      s += '\n';
    }

    s += isotopes;
    s += radicals;
    s += tags;
    s += astr;
    s += query;
    s += rgp;
    s += apo;

    let nSTY = 0;
    if (superatoms != null) {
      for (let i = 0; i < superatoms.length; ++i) {
        const a = superatoms[i].a;
        const m = superatoms[i].m;
        if (m == null)
          continue;

        ++nSTY;
        const sty = scil.Utils.formatStr(nSTY, 3, 0);
        s += 'M  STY  1 ' + sty + ' SUP\n';
        s += this.writeList('M  SAL ' + sty, m.atoms, 'id', 4, 8);
        s += this.writeList('M  SBL ' + sty, m.bonds, 'bondid', 4, 8);

        s += 'M  SMT ' + sty + ' ' + (a.alias == null ? a.elem : a.alias) + '\n';
        if (a.bio != null)
          s += 'M  SCL ' + sty + ' ' + a.biotype() + '\n';
      }
    }

    const texts = [];
    for (let i = 0; i < this.graphics.length; ++i) {
      const t = JSDraw2.Text.cast<TBio>(this.graphics[i]);
      if (t != null)
        texts.push(t);
    }

    // SGroup
    let sgroupdata = '';
    const id = {k: nSTY};
    const brackets = [];
    for (let i = 0; i < this.graphics.length; ++i) {
      const br = JSDraw2.Bracket.cast<TBio>(this.graphics[i]);
      if (br == null)
        continue;
      brackets.push(br);
      const r = br._rect;

      let bracketatoms = null;
      let bracketbonds = null;
      if (br.atoms.length > 0) {
        bracketatoms = this.getExpandedAtoms(br.expandedatoms == null ? br.atoms : br.expandedatoms);
        bracketbonds = br.getXbonds(this);
      }

      const k = ++id.k;
      let connectivity = null;
      const sgroup: any = {sty: '', spl: '', data: '', id: id};
      const tp: string = br.getType();
      const snc: string | null = br.getTypeNum();
      sgroup.subscript = tp;

      // @ts-ignore
      let type = JSDraw2.SGroup.stys[tp];
      if (type == null) {
        if (bracketbonds != null && bracketbonds.length == 2)
          type = 'SRU';
        else
          type = 'GEN';
      }
      sgroup.sty += ' ' + scil.Utils.formatStr(k, 3, 0) + ' ' + type;
      // @ts-ignore
      let fieldtype = JSDraw2.SGroup.fieldtypes[tp!];
      if (fieldtype == null)
        fieldtype = 'BRACKET';
      const custom = type == null;

      let subscript = null;
      for (let j = 0; j < texts.length; ++j) {
        const t = texts[j];
        if (t != null && t.anchors.length == 1 && t.anchors[0] == br) {
          if (t.fieldtype == 'BRACKET_CONN') {
            connectivity = t.text;
          } else if (t.fieldtype != 'BRACKET_TYPE' || t.text != tp && tp != 'mul' || custom) {
            let ft = t.fieldtype!;
            if (fieldtype != null && ft != null && ft.length > 8 && ft.substr(0, 8) == 'BRACKET_') {
              if (ft == 'BRACKET_SUBTYPE')
                ft = fieldtype + '_TYPE';
              else
                ft = fieldtype + ft.substr(7);
            }

            if (type == 'SRU')
              sgroup.subscript = t.text;
            else
              this.getDataGroup(t.text, ft, t._rect.left * scale, -t._rect.top * scale, k, sgroup);
          } else if (t.fieldtype == 'BRACKET_TYPE' && tp == 'mul') {
            subscript = t.text;
          }
          texts[j] = null;
        }
      }

      sgroupdata += 'M  STY' + scil.Utils.formatStr(sgroup.sty.length / 8, 3, 0) + sgroup.sty + '\n';
      //sgroupdata += "M  SLB  1   1   1\n";

      if (connectivity == 'ht' || connectivity == 'hh' || connectivity == 'eu')
        sgroupdata += 'M  SCN' + scil.Utils.formatStr(1, 3, 0) + ' ' + scil.Utils.formatStr(k, 3, 0) + ' ' + connectivity.toUpperCase() + ' \n';
      if (snc != null)
        sgroupdata += 'M  SNC' + scil.Utils.formatStr(1, 3, 0) + ' ' + scil.Utils.formatStr(k, 3, 0) + ' ' + scil.Utils.padLeft(snc, 3, ' ') + ' \n';
      if (sgroup.spl != '')
        sgroupdata += 'M  SPL' + scil.Utils.formatStr(sgroup.spl.length / 8, 3, 0) + sgroup.spl + '\n';
      if (br.atoms.length > 0) {
        sgroupdata += this.writeList('M  SAL ' + scil.Utils.formatStr(k, 3, 0), bracketatoms, 'id', 4, 8);
        sgroupdata += this.writeList('M  SBL ' + scil.Utils.formatStr(k, 3, 0), bracketbonds, 'id', 4, 8);

        if (!scil.Utils.isNullOrEmpty(sgroup.subscript) && /* I#10773 */ !(type == 'MUL' && sgroup.subscript == 'mul'))
          sgroupdata += 'M  SMT   1 ' + sgroup.subscript + '\n';

        const atoms = br.atoms;
        if (br.type != 'n' || type == 'SRU')
          sgroupdata += this.writeList('M  SPA ' + scil.Utils.formatStr(k, 3, 0), atoms, 'id', 4, 8);
      }

      sgroupdata += 'M  SDI ' + scil.Utils.formatStr(k, 3, 0) + '  4';
      sgroupdata += scil.Utils.formatStr(br._rect.left * scale, 10, 4);
      sgroupdata += scil.Utils.formatStr(-br._rect.bottom() * scale, 10, 4);
      sgroupdata += scil.Utils.formatStr(br._rect.left * scale, 10, 4);
      sgroupdata += scil.Utils.formatStr(-br._rect.top * scale, 10, 4);
      sgroupdata += '\n';

      sgroupdata += 'M  SDI ' + scil.Utils.formatStr(k, 3, 0) + '  4';
      sgroupdata += scil.Utils.formatStr(br._rect.right() * scale, 10, 4);
      sgroupdata += scil.Utils.formatStr(-br._rect.top * scale, 10, 4);
      sgroupdata += scil.Utils.formatStr(br._rect.right() * scale, 10, 4);
      sgroupdata += scil.Utils.formatStr(-br._rect.bottom() * scale, 10, 4);
      sgroupdata += '\n';

      if (subscript != null && subscript != '') {
        sgroupdata += 'M  SMT ' + scil.Utils.formatStr(k, 3, 0) + ' ' + subscript;
        sgroupdata += '\n';
      }

      sgroupdata += sgroup.data;
    }

    for (let i = 0; i < texts.length; ++i) {
      const t = texts[i];
      if (t == null)
        continue;

      let k = id.k;
      const sgroup = {sty: '', spl: '', data: '', id: id};
      this.getDataGroup(t.text, t.fieldtype!, t._rect.left * scale, -t._rect.top * scale, null, sgroup);
      sgroupdata += 'M  STY' + scil.Utils.formatStr(sgroup.sty.length / 8, 3, 0) + sgroup.sty + '\n';

      // I#11604
      if (id.k == k)
        ++id.k;
      k = id.k;

      let sal = '';
      let sbl = '';
      for (let j = 0; j < t.anchors.length; ++j) {
        const a = t.anchors[j];
        if (JSDraw2.Atom.cast<TBio>(a) != null)
          sal += ' ' + scil.Utils.formatStr((a as Atom<TBio>).atomid!, 3, 0);
        else if (JSDraw2.Bond.cast<TBio>(a) != null)
          sbl += ' ' + scil.Utils.formatStr((a as Bond<TBio>).bondid!, 3, 0);
      }
      if (sal != '')
        sgroupdata += 'M  SAL ' + scil.Utils.formatStr(k, 3, 0) + scil.Utils.formatStr(sal.length / 4, 3, 0) + sal + '\n';
      if (sbl != '')
        sgroupdata += 'M  SBL ' + scil.Utils.formatStr(k, 3, 0) + scil.Utils.formatStr(sbl.length / 4, 3, 0) + sbl + '\n';

      sgroupdata += sgroup.data;
    }

    s += sgroupdata;
    s += 'M  END\n';
    return s;
  }

  getExpandedAtoms(atoms: Atom<TBio>[]): Atom<TBio>[] {
    const ret: Atom<TBio>[] = [];
    for (let i = 0; i < atoms.length; ++i) {
      const a = atoms[i];
      if (a.superatom == null) {
        ret.push(a);
      } else {
        for (let k = 0; k < a.superatom.atoms.length; ++k)
          ret.push(a.superatom.atoms[i]);
      }
    }
    return ret;
  }

  writeList(prefix: string, list: any[] | null, key: string, chars: number, countperline: number): string {
    if (list == null || list.length == 0)
      return '';

    let s = '';
    let countlastline = list.length % countperline;
    if (countlastline == 0)
      countlastline = countperline;
    const lines = (list.length - countlastline) / countperline + 1;

    for (let i = 0; i < lines; ++i) {
      const countthisline = i + 1 == lines ? countlastline : countperline;
      s += prefix;
      s += scil.Utils.formatStr(countthisline, 3);
      for (let j = 0; j < countthisline; ++j)
        s += scil.Utils.formatStr(list[i * countperline + j][key], chars);
      s += '\n';
    }

    return s;
  }

  getMolV3000(rxn: boolean): string {
    const superatoms: SuperAtomType<TBio>[] = [];
    const m = this.expandSuperAtoms(superatoms);
    m.chiral = this.chiral;
    return m._getMolV3000();
  }

  _getMolV3000(rxn?: any) {
    const len = this.bondlength! > 0 ? this.bondlength : this.medBondLength();
    const scale = len! > 0 ? (1.56 / len!) : 1.0;

    this.resetIds();

    const dt = new Date();
    const yr = dt.getFullYear() + '';

    let s = '';
    if (!rxn) {
      s += (this.name == null ? '' : this.name) + '\n';
      s += '   JSDraw ' + scil.Utils.formatStr(dt.getMonth() + 1, 2, 0).replace(' ', '0') +
        scil.Utils.formatStr(dt.getDate(), 2, 0).replace(' ', '0') +
        yr.substr(2) +
        scil.Utils.formatStr(dt.getHours(), 2, 0).replace(' ', '0') +
        scil.Utils.formatStr(dt.getMinutes(), 2, 0).replace(' ', '0') + '2D\n';
      s += '\n';
      s += '  0  0        0               999 V3000\n';
    }

    const enhancedstereochemistry = this.getEnhancedStereochemistry();
    const chiral = this.hasStereoCenter() || !scil.Utils.isNullOrEmpty(enhancedstereochemistry);

    s += 'M  V30 BEGIN CTAB\n';
    s += 'M  V30 COUNTS ' + this.atoms.length + ' ' + this.bonds.length + ' 0 0 ' + (chiral ? 1 : 0) + '\n';

    s += 'M  V30 BEGIN ATOM\n';
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      let elem = a.elem;
      if (elem == 'R') {
        if ((a.iR as number) > 0)
          elem = 'R#';
        else
          elem = 'R';
      } else if (elem == 'H') {
        if (a.isotope == 2)
          elem = 'D';
        else if (a.isotope == 3)
          elem = 'T';
      }

      s += 'M  V30 ' + a.id + ' ' + elem;
      s += ' ' + scil.Utils.formatStr(a.p.x * scale, 0, 4);
      s += ' ' + scil.Utils.formatStr(-a.p.y * scale, 0, 4);
      s += ' 0 ' + (rxn && a.atommapid! > 0 ? a.atommapid : 0);
      if (a.charge != null && a.charge != 0)
        s += ' CHG=' + a.charge;
      if (a.radical! >= 1 && a.radical! <= 3)
        s += ' RAD=' + a.radical;

      //if (chiralatoms[a.id] != null)
      //    s += " CFG=" + chiralatoms[a.id];

      s += '\n';
    }
    s += 'M  V30 END ATOM\n';
    s += 'M  V30 BEGIN BOND\n';
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      let order = 0;
      let stereo = 0;
      switch (b.type) {
      case JSDraw2.BONDTYPES.UNKNOWN:
        order = 8;
        break;
      case JSDraw2.BONDTYPES.DUMMY:
        order = 9;
        break;
      case JSDraw2.BONDTYPES.DOUBLEORAROMATIC:
        order = 7;
        break;
      case JSDraw2.BONDTYPES.SINGLEORAROMATIC:
        order = 6;
        break;
      case JSDraw2.BONDTYPES.SINGLEORDOUBLE:
        order = 5;
        break;
      case JSDraw2.BONDTYPES.SINGLE:
      case JSDraw2.BONDTYPES.DOUBLE:
      case JSDraw2.BONDTYPES.TRIPLE:
      case JSDraw2.BONDTYPES.DELOCALIZED:
        order = b.type;
        stereo = 0;
        break;
      case JSDraw2.BONDTYPES.WEDGE:
        order = 1;
        stereo = 1;
        break;
      case JSDraw2.BONDTYPES.HASH:
        order = 1;
        stereo = 3;
        break;
      case JSDraw2.BONDTYPES.WIGGLY:
        order = 1;
        stereo = 2;
        break;
      case JSDraw2.BONDTYPES.EITHER:
        order = 2;
        stereo = 2;
        break;
      }
      s += 'M  V30 ' + (i + 1) + ' ' + order + ' ' + b.a1.id + ' ' + b.a2.id;
      if (stereo > 0)
        s += ' CFG=' + stereo;
      if (b.ring != null)
        s += ' TOPO=' + (b.ring ? 1 : 2);
      if (rxn && b.rcenter! > 0)
        s += ' RXCTR=' + b.rcenter;
      s += '\n';
    }

    s += 'M  V30 END BOND\n';
    s += enhancedstereochemistry;
    s += 'M  V30 END CTAB\n';
    s += 'M  END\n';
    return s;
  }

  hasStereoCenter() {
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.type == JSDraw2.BONDTYPES.WEDGE || b.type == JSDraw2.BONDTYPES.HASH)
        return true;
    }

    return false;
  }

  hasEnhancedStereochemistry() {
    return false;
  }

  getEnhancedStereochemistry() {
    return '';
  }

  setMolV3000(lines: any, start: any, rxn: any, pos?: any, endtoken?: any): Mol<TBio> {
    return this;
  }

  readV30Collections(lines: any, i: number, atommap: any): void {
  }

  readV30Bonds(lines: any, i: number, atommap: any, rxn: boolean): void {
  }

  getChiralAtom(t: Text<TBio>): Atom<TBio> | null {
    if (t == null || t.anchors == null || t.anchors.length != 1 || t.fieldtype != 'CHIRAL')
      return null;
    const a = JSDraw2.Atom.cast<TBio>(t.anchors[0]);
    if (a == null)
      return null;
    return JSDraw2.Atom.isValidChiral(t.text) ? a : null;
  }

  markChirality(a: Atom<TBio>, c: number, bondlength: number): boolean {
    return false;
  }

  findBestPosition(a: Atom<TBio>, bondlength: number): Point {
    const atoms = a._parent.getNeighborAtoms(a);
    const p = a.p.clone();
    if (atoms != null && atoms.length > 0) {
      const deg = atoms[0].p.angleTo(a.p);
      p.offset(bondlength * 0.37, 0);
      p.rotateAround(a.p, deg - 60);

      p.x -= bondlength * 0.25;
      p.y -= bondlength * 0.25;
    } else {
      p.x -= bondlength * 0.25;
      p.y -= bondlength * 0.75;
    }
    return p;
  }

  readRxnCenter(bond: Bond<TBio>, s: string | null): void {
    const rcenter = s == null ? null : parseInt(s);
    switch (rcenter) {
    case -1:
      bond.rcenter = JSDraw2.RXNCENTER.NOTCENTER;
      break;
    case 1:
      bond.rcenter = JSDraw2.RXNCENTER.CENTER;
      break;
    case 12:
    case 13:
      bond.rcenter = JSDraw2.RXNCENTER.BREAKANDCHANGE;
      break;
    case 4:
    case 5:
      bond.rcenter = JSDraw2.RXNCENTER.BREAK;
      break;
    case 8:
    case 9:
      bond.rcenter = JSDraw2.RXNCENTER.CHANGE;
      break;
    }
  }

  readV30Atoms(lines: string[], i: number, atommap: any[], rxn: boolean): any {

  }

  readV30Counts(lines: string[], i: number, counts: number): any {

  }

  parseV30Attributes(ss: string, start: number): null {
    return null;
  }

  getDataGroup(data: string, key: string, x: number, y: number, k2: number | null, sgroup: any): void {

  }

  containsWord(word: string): boolean {
    word = word.toLowerCase();
    for (let i = 0; i < this.graphics.length; ++i) {
      const t = JSDraw2.Text.cast<TBio>(this.graphics[i]);
      if (t != null && scil.Utils.containsWord(t.text, word, true))
        return true;
    }
    return false;
  }

  containsText(s: string): boolean {
    s = s.toLowerCase();
    for (let i = 0; i < this.graphics.length; ++i) {
      const t = JSDraw2.Text.cast<TBio>(this.graphics[i]);
      if (t != null && t.text != null && t.text.toLowerCase().indexOf(s) >= 0)
        return true;
    }
    return false;
  }

  /**
   * Get Mol property
   * @function getProp
   * @param {string} k - the property name
   * @returns the property
   */
  getProp(k: string): any {
    return this.props == null ? null : this.props[k];
  }

  /**
   * Set Mol property
   * @function setProp
   * @param {string} k - the property name
   * @param {object} v - the property value
   * @returns null
   */
  setProp(k: string, v: any): void {
    if (v == null) {
      if (this.props != null)
        delete this.props[k];
    } else {
      if (this.props == null)
        this.props = {};
      this.props[k] = v + '';
    }
  }

  /**
   * Set RGfile
   * @function setRgfile
   * @param {string} rgfile - the input rgfile
   * @returns the Mol object
   */
  setRgfile(rgfile: string): Mol<TBio> | null {
    return null;
  }

  _setParent(m: Mol<TBio>): void {
    for (let i = 0; i < this.atoms.length; ++i)
      this.atoms[i]._parent = m;
    for (let i = 0; i < this.bonds.length; ++i)
      this.bonds[i]._parent = m;
    for (let i = 0; i < this.graphics.length; ++i)
      this.graphics[i]._parent = m;
  }

  _setGroup(g: any) {
    for (let i = 0; i < this.atoms.length; ++i)
      this.atoms[i].group = g;
    for (let i = 0; i < this.bonds.length; ++i)
      this.bonds[i].group = g;
  }

  toggleAtom(p: Point, tor: number): Atom<TBio> | null {
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.toggle(p, tor))
        return a;

      if (a.rgroup != null) {
        const list = a.rgroup.mols;
        for (let j = 0; j < list.length; ++j) {
          const r = list[j].toggleAtom(p, tor);
          if (r != null)
            return r;
        }
      }
    }
    return null;
  }

  toggle(p: Point, tor: number): any {
    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      if (a.toggle(p, tor))
        return a;

      if (a.rgroup == null)
        continue;

      if (a.rgroup.toggle(p, tor))
        return a.rgroup;

      const list: Mol<TBio>[] = a.rgroup.mols;
      for (let j = 0; j < list.length; ++j) {
        const r = list[j].toggle(p, tor);
        if (r != null)
          return r;
      }
    }

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.toggle(p, tor))
        return this.bonds[i];
    }

    for (let i = this.graphics.length - 1; i >= 0; --i) {
      const g = this.graphics[i];
      if (g.toggle(p, tor))
        return this.graphics[i];
    }
    return null;
  }

  /**
   * Set Rxnfile
   * @function setRxnfile
   * @param {string} rxnfile - the input rxnfile
   * @returns the Mol object
   */
  setRxnfile(rxnfile: string): Mol<TBio> {
    return this;
  }

  setRxnV3000(lines: string): Mol<TBio> {
    return this;
  }

  readCtabs(lines: string, i: number, n: number, list: any[], endtoken: string): number {
    for (let k = 0; k < n; ++k) {
      const m: Mol<TBio> = new JSDraw2.Mol<TBio>();
      const pos: any = {};
      m.setMolV3000(lines, i, true, pos, endtoken);
      i = pos.i;
      if (!m.isEmpty())
        list.push(m);
    }
    return i;
  }

  setRxnV2000(lines: string): Mol<TBio> {
    return this;
  }

  setRxn(rxn: boolean, bondlength: number): Mol<TBio> {
    return this;
  }

  /**
   * Get Rxnfile
   * @function getRxnfile
   * @param {bool} groupbyplus - indicate if grouping reactants/products by explicit plus signs
   * @param {bool} v3000 - indicate if rendering the rxnfile in V3000 format
   * @returns a string
   */
  getRxnfile(groupbyplus: boolean, v3000: boolean): string | null {
    const rxn = this.parseRxn(true, groupbyplus);
    if (rxn == null)
      return null;

    if (v3000)
      return this.getRxnV3000(rxn);
    else
      return this.getRxnV2000(rxn);
  }

  getAllBrackets() {
    const list = [];
    for (let j = 0; j < this.graphics.length; ++j) {
      const b = this.graphics[j];
      if (JSDraw2.Bracket.cast<TBio>(b) != null)
        list.push(b);
    }
    return list;
  }

  getAllTexts() {
    const list = [];
    for (let j = 0; j < this.graphics.length; ++j) {
      const b = this.graphics[j];
      if (JSDraw2.Text.cast<TBio>(b) != null)
        list.push(b);
    }
    return list;
  }

  getRxnV2000(rxn: boolean): string | null {
    return null;
  }

  getRxnV3000(rxn: boolean, groupbyplus?: boolean): string | null {
    return null;
  }

  /**
   * Get JSDraw xml file format
   * @function getXml
   * @param {number} width - the width of the view
   * @param {number} height - the height of the view
   * @param {bool} viewonly - in viewonly mode
   * @returns a string
   */
  getXml(width: number, height: number, viewonly: boolean, svg: any, len: number): string | null {
    return this._getXml(width, height, viewonly, svg, len);
  }

  getHtml(width: number, height: number, viewonly: boolean, svg: any, len: number): string | null {
    return this.getXml(width, height, viewonly, svg, len);
  }

  _getXml(width: number | null, height: number | null, viewonly: boolean | null, svg: any | null, len: number, inside?: boolean): string | null {
    return null;
  }

  /**
   * Set Secptrum JDX data
   * @function setJdx
   * @param {string} data - JDX string
   * @returns a Mol object
   */
  setJdx(data: string, bondlength: number): Mol<TBio> {
    return this;
  }

  /**
   * Set JSDraw xml file format
   * @function setXml
   * @param {string} xml - the input JSDraw html/xml string
   * @returns a Mol object
   */
  setXml(xml: HTMLElement): Mol<TBio> {
    return this;
  }

  setHtml(xml: HTMLElement): Mol<TBio> {
    return this.setXml(xml);
  }

  toScreen(screenBondLength: number): number {
    let len = this.medBondLength();
    if (!(len > 0))
      len = 1.56;

    const scale = screenBondLength / len;
    this.scale(scale);
    return scale;
  }

  /**
   * Scale the molecule
   * @function scale
   * @param {number} scale - the scaling factor
   * @param {Point} origin - the origin of scaling
   * @returns null
   */
  scale(scale: number, origin?: Point): void {
    if (!(scale > 0))
      return;

    for (let i = 0; i < this.atoms.length; ++i) {
      const a = this.atoms[i];
      a.p.scale(scale, origin);
      if (a.rgroup != null) {
        if (a.rgroup != null)
          a.rgroup.scale(scale, origin);
        for (let j = 0; j < a.rgroup.mols.length; ++j)
          a.rgroup.mols[j].scale(scale, origin);
      }
    }

    for (let i = 0; i < this.graphics.length; ++i)
      this.graphics[i].scale(scale, origin);
  }

  /**
   * Flip the molecule around an X axis
   * @function flipX
   * @param {number} x - the x axis
   * @returns null
   */
  flipX(x: number): void {
    for (let i = 0; i < this.atoms.length; ++i) {
      const p = this.atoms[i].p;
      p.x = x - (p.x - x);
    }
    for (let i = 0; i < this.graphics.length; ++i)
      this.graphics[i].flipX(x);
  }

  /**
   * Flip the molecule around a Y axis
   * @function flipY
   * @param {number} y - the y axis
   * @returns null
   */
  flipY(y: number): void {
    for (let i = 0; i < this.atoms.length; ++i) {
      const p = this.atoms[i].p;
      p.y = y - (p.y - y);
    }
    for (let i = 0; i < this.graphics.length; ++i)
      this.graphics[i].flipY(y);
  }

  clearFlag(): void {
    for (let i = 0; i < this.atoms.length; ++i) {
      this.atoms[i].f = null;
      this.atoms[i].ringclosures = null;
    }
    for (let i = 0; i < this.bonds.length; ++i)
      this.bonds[i].f = null;
  }

  _connectFragsByPlus(frags: Mol<TBio>[], bondlen: number): null {
    return null;
  }

  _splitFrags(frags: Mol<TBio>[]): void {
    for (let i = 0; i < frags.length; ++i) {
      const ss = frags[i].splitFragments();
      if (ss.length > 0) {
        frags.splice(i, 1);
        for (let k = 0; k < ss.length; ++k)
          frags.splice(i, 0, ss[k]);
        i += ss.length - 1;
      }
    }
  }

  _connectNextLine(frags: Mol<TBio>[], rect: Rect, above: any, arrow: any, bondlen: number): null {
    return null;
  }

  detectRxn(arrow: any): null {
    return null;
  }

  _findCloseTexts(t: Text<TBio>, texts: (Text<TBio> | null)[], dy: number, ret: Text<TBio>[]): void {
    for (let k = 0; k < texts.length; ++k) {
      const x = texts[k];
      if (x == null)
        continue;

      const r1 = t.rect()!;
      const r2 = x.rect()!;
      if (Math.abs(r1.top - r2.top) < dy || Math.abs(r1.top - r2.bottom()) < dy ||
        Math.abs(r1.bottom() - r2.top) < dy || Math.abs(r1.bottom() - r2.bottom()) < dy) {
        const overlap = Math.min(r1.right(), r2.right()) - Math.max(r1.left, r2.left);
        if (overlap >= Math.min(r1.width, r2.width) / 2) {
          ret.push(x);
          texts[k] = null;
        }
      }
    }
  }

  parseRxn2() {
    return null;
  }

  /**
   * Test if the molecule is a reaction
   * @function isRxn
   * @returns true or false
   */
  isRxn() {
    return null;
  }

  _groupByPlus(rxn: IRxn | null): IRxn | null {
    if (rxn == null)
      return rxn;

    const pluses = [];
    for (let i = 0; i < this.graphics.length; ++i) {
      if (this.graphics[i].T == 'PLUS')
        pluses.push(this.graphics[i]);
    }

    if (pluses.length == 0) {
      if (rxn.reactants.length > 1) {
        for (let i = 1; i < rxn.reactants.length; ++i)
          rxn.reactants[0].mergeMol(rxn.reactants[i]);
        rxn.reactants = [rxn.reactants[0]];
      }
      if (rxn.products.length > 1) {
        for (let i = 1; i < rxn.products.length; ++i)
          rxn.products[0].mergeMol(rxn.products[i]);
        rxn.products = [rxn.products[0]];
      }
    } else {
      // order by x
      const xx: number[] = [];
      for (let i = 0; i < pluses.length; ++i) {
        const x = pluses[i].p.x;
        let p = xx.length;
        for (let k = 0; k < xx.length; ++k) {
          if (x < xx[k]) {
            p = k;
            break;
          }
        }

        xx.splice(p, 0, x);
      }

      rxn.reactants = this._groupByPlus2(xx, rxn.reactants);
      rxn.products = this._groupByPlus2(xx, rxn.products);
    }
    return rxn;
  }

  _groupByPlus2(pluses: number[], mols: Mol<TBio>[]): Mol<TBio>[] {
    const list: Mol<TBio>[] = [];
    const n = pluses.length;
    for (let i = 0; i < mols.length; ++i) {
      const m = mols[i];
      const cx = mols[i].center().x;
      let f = false;
      for (let k = 0; k < n; ++k) {
        if (cx < pluses[k]) {
          if (list[k] == null)
            list[k] = m;
          else
            list[k].mergeMol(m);
          f = true;
          break;
        }
      }

      if (!f) {
        if (list[n] == null)
          list[n] = m;
        else
          list[n].mergeMol(m);
      }
    }

    const ret: Mol<TBio>[] = [];
    for (let i = 0; i < list.length; ++i) {
      if (list[i] != null)
        ret.push(list[i]);
    }
    return ret;
  }

  /**
   * Parse the molecule as a reaction
   * @function parseRxn
   * @returns a Reaction object: { reactants, products, arrow, above, below }
   */
  parseRxn(copygraphics?: boolean, groupbyplus?: boolean): IRxn {
    let rxn = this._parseRxn();
    if (groupbyplus)
      rxn = this._groupByPlus(rxn);

    //        if (rxn != null && copygraphics) {
    //            var brackets = this.getAllBrackets();
    //            var texts = this.getAllTexts();
    //            this._addGraphicsRxnMol(rxn.reactants, brackets, texts);
    //            this._addGraphicsRxnMol(rxn.products, brackets, texts);
    //        }

    return rxn;
  }

  _addGraphicsRxnMol(mols: Mol<TBio>[], brackets: (Bracket<TBio> | null)[], texts: Text<TBio>[]): void {
    for (let i = 0; i < mols.length; ++i) {
      const m = mols[i];
      for (let k = 0; k < brackets.length; ++k) {
        const b = brackets[k];
        if (b != null && b.allAtomsIn(m)) {
          m.graphics.push(b);
          brackets[k] = null;
        }
      }
      for (let k = 0; k < texts.length; ++k) {
        const b = texts[k];
        if (b != null && b.allAnchorsIn(m)) {
          // @ts-ignore
          m.graphics.push(b);
          brackets[k] = null;
        }
      }
    }
  }

  _parseRxn(): IRxn | null {
    return null;
  }

  _hasOverlap(left: number, right: number, rect: Rect): boolean {
    const l = rect.left;
    const r = rect.right();
    return l < right && r > left;
  }

  _sortTextByTop(texts: Text<TBio>[]): Text<TBio>[] {
    if (texts == null || texts.length == 0)
      return texts;

    const yy: number[] = [];
    const sorted: Text<TBio>[] = [];
    for (let i = 0; i < texts.length; ++i) {
      const y = texts[i]._rect.top;
      let p = yy.length;
      for (let k = 0; k < yy.length; ++k) {
        if (y < yy[k]) {
          p = k;
          break;
        }
      }

      yy.splice(p, 0, y);
      sorted.splice(p, 0, texts[i]);
    }

    return sorted;
  }

  /**
   * Get the whole fragment containing an input atom
   * @function getFragment
   * @param {Atom} a - the input atom
   * @returns a Mol object
   */
  getFragment(a: Atom<TBio>, parent?: Mol<TBio>): Mol<TBio> {
    this.setAtomBonds();
    this.clearFlag();

    const tree = this._getTree(a).tree;
    const path: any[] = [];
    tree.list(path, 'breadthfirst');

    const m = new JSDraw2.Mol<TBio>();
    for (let k = 0; k < path.length; ++k) {
      const b = path[k];
      if (b.a != null && b.ringclosure == null)
        m._addAtom(b.a, parent);
      if (b.b != null)
        m._addBond(b.b, parent);
    }
    return m;
  }

  /**
   * Split it into fragments
   * @function splitFragments
   * @returns an array of Mol
   */
  splitFragments(skipHiddenAtoms?: boolean) {
    this.clearFlag();

    let fragid = -1;
    const bonds: Bond<TBio>[] = scil.Utils.cloneArray(this.bonds);
    while (bonds.length > 0) {
      const b: Bond<TBio> = bonds[0];
      if (skipHiddenAtoms) {
        if (b.a1.hidden || b.a2.hidden) {
          bonds.splice(0, 1);
          continue;
        }
      }
      b.f = b.a1.f = b.a2.f = ++fragid;
      bonds.splice(0, 1);

      while (true) {
        let n = 0;
        for (let i = bonds.length - 1; i >= 0; --i) {
          const b = bonds[i];
          if (b.a1.hidden || b.a2.hidden) {
            bonds.splice(i, 1);
            continue;
          }

          if (b.f == null && (b.a1.f == fragid || b.a2.f == fragid)) {
            b.f = b.a1.f = b.a2.f = fragid;
            bonds.splice(i, 1);
            ++n;
          }
        }

        if (n == 0)
          break;
      }
    }

    const frags = [];
    for (let k = 0; k <= fragid; ++k) {
      const m = new JSDraw2.Mol();
      frags.push(m);

      for (let i = 0; i < this.atoms.length; ++i) {
        if (this.atoms[i].f == k)
          m._addAtom(this.atoms[i], this);
      }

      for (let i = 0; i < this.bonds.length; ++i) {
        if (this.bonds[i].f == k)
          m._addBond(this.bonds[i], this);
      }
    }

    for (let i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i].f == null) {
        if (skipHiddenAtoms && this.atoms[i].hidden)
          continue;

        const m = new JSDraw2.Mol();
        frags.push(m);
        m._addAtom(this.atoms[i], this);
      }
    }

    // brackets
    for (let i = 0; i < this.graphics.length; ++i) {
      const br = JSDraw2.Bracket.cast<TBio>(this.graphics[i]);
      if (br == null)
        continue;

      for (let k = 0; k < frags.length; ++k) {
        if (br.atoms == null || br.atoms.length == 0)
          continue;
        if (frags[k].containsAllAtoms(br.atoms)) {
          frags[k].graphics.push(br);
          for (let j = 0; j < this.graphics.length; ++j) {
            const t: Text<TBio> | null = JSDraw2.Text.cast<TBio>(this.graphics[j]);
            if (t != null && t.anchors != null && t.anchors.length == 1 && t.anchors[0] == br) {
              // @ts-ignore
              frags[k].graphics.push(t);
            }
          }
        }
      }
    }

    // attached texts
    for (let i = 0; i < this.graphics.length; ++i) {
      const t: Text<TBio> | null = JSDraw2.Text.cast<TBio>(this.graphics[i]);
      if (t == null || t.anchors == null || t.anchors.length == 0)
        continue;

      for (let k = 0; k < frags.length; ++k) {
        if (frags[k].containsAllAtoms(t.anchors as Atom<TBio>[])) {
          // @ts-ignore
          frags[k].graphics.push(t);
        }
      }
    }


    // set chiral flags
    for (let i = 0; i < frags.length; ++i) {
      const frag = frags[i];
      for (let j = 0; j < frag.atoms.length; ++j) {
        const g = frag.atoms[j].group;
        if (g != null && g.type == 'chiral') {
          frag.chiral = true;
          break;
        }
      }
    }

    for (let i = 0; i < frags.length; ++i)
      frags[i].bondlength = this.bondlength;

    return frags;
  }

  containsAllAtoms(atoms: Atom<TBio>[]): boolean {
    if (atoms == null || atoms.length == 0)
      return false;
    for (let i = 0; i < atoms.length; ++i) {
      if (scil.Utils.indexOf(this.atoms, atoms[i]) < 0)
        return false;
    }

    return true;
  }

  /**
   * Check if the Mol contains an atom
   * @function containsAtom
   * @param {Atom} a - the input atom
   * @returns true or false
   */
  containsAtom(a: Atom<TBio>): boolean {
    for (let i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i] == a)
        return true;
    }
    return false;
  }

  setAtomBonds(clear?: boolean) {
    for (let i = 0; i < this.atoms.length; ++i)
      this.atoms[i].bonds = null;

    if (clear)
      return;

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];

      if (b.a1.bonds == null)
        b.a1.bonds = [];
      b.a1.bonds.push(b);

      if (b.a2.bonds == null)
        b.a2.bonds = [];
      b.a2.bonds.push(b);
    }
  }

  setBondOrders() {
    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      b.order = b.valence();
    }

    if (DEBUG.enable) {
      for (let i = 0; i < this.bonds.length; ++i) {
        const b = this.bonds[i];
        DEBUG.print(b.a1.id + '-' + b.a2.id + ' ' + b.order);
      }
    }

    const rings = this._getRings();
    const ars = [];
    while (rings.length > 0) {
      let n = 0;
      for (let i = rings.length - 1; i >= 0; --i) {
        const r = rings[i];
        if (this.isAromaticRing(r)) {
          ++n;
          ars.push(r);
          rings.splice(i, 1);
          for (let k = 0; k < r.length; ++k)
            r[k].order = 1.5;
        }
      }

      if (n == 0)
        break;
    }

    return {arrings: ars, rings: rings};
  }

  isAromaticRing(r: Bond<TBio>[]): boolean {
    if (r.length == 6) {
      let b1 = r[0];
      for (let k = 1; k <= r.length; ++k) {
        const b2 = r[k == r.length ? 0 : k];
        if (!(b1.order == 1 && b2.order == 2 ||
          b1.order == 2 && b2.order == 1 ||
          b1.order == 1.5 && b2.order! >= 1 && b2.order! <= 2 ||
          b2.order == 1.5 && b1.order! >= 1 && b1.order! <= 2)) {
          return false;
        }
        b1 = b2;
      }

      return true;
    }

    if (r.length == 5) {
      let b1 = r[0];
      for (let k = 1; k <= r.length; ++k) {
        const b2 = r[k == r.length ? 0 : k];
        if (b1.order == 1 && b2.order == 1) {
          let v;
          if (b1.a1 == b2.a1 || b1.a1 == b2.a2)
            v = b1.a1;
          else if (b1.a2 == b2.a1 || b1.a2 == b2.a2)
            v = b1.a2;

          if (v != null &&
            (r[(k + 1) % 5].order == 2 || r[(k + 1) % 5].order == 1.5) &&
            r[(k + 2) % 5].order == 1 &&
            (r[(k + 3) % 5].order == 2 || r[(k + 3) % 5].order == 1.5)) {
            if (v.elem == 'N' || v.elem == 'O' || v.elem == 'S' || v.elem == 'P') {
              return true;
            } else if (v.elem == 'C') {
              const bList: Bond<TBio>[] = v.bonds!;
              for (let i = 0; i < bList.length; ++i) {
                const order = bList[i].order;
                if (order == 1.5 || order == 2)
                  return true;
              }
            }
          }

          return false;
        }
        b1 = b2;
      }

      return false;
    }

    return false;
  }

  prepareScreen() {
    const atoms = JSDraw2.FormulaParser.getAtomStats(this).elements;
    const allrings = this.setBondOrders();

    const bonds: { [bt: number]: number } = {[0]: 0, [1]: 0, [1.5]: 0, [2]: 0, [3]: 0};
    for (let i = 0; i < this.bonds.length; ++i)
      ++bonds[this.bonds[i].order!];

    const rings = {n5: 0, a5: 0, n6: 0, a6: 0};
    for (let i = 0; i < allrings.arrings.length; ++i) {
      if (allrings.arrings[i].length == 5)
        ++rings.a5;
      else if (allrings.arrings[i].length == 6)
        ++rings.a6;
    }
    for (let i = 0; i < allrings.rings.length; ++i) {
      if (allrings.rings[i].length == 5)
        ++rings.n5;
      else if (allrings.rings[i].length == 6)
        ++rings.n6;
    }

    return {atoms: atoms, bonds: bonds, rings: rings};
  }

  clearAtomMap(ai?: number) {
    let n = 0;
    if (ai == null) {
      for (let i = 0; i < this.atoms.length; ++i) {
        if (this.atoms[i].atommapid != null) {
          ++n;
          this.atoms[i].atommapid = null;
        }
      }
    } else {
      for (let i = 0; i < this.atoms.length; ++i) {
        if (ai == this.atoms[i].atommapid) {
          ++n;
          this.atoms[i].atommapid = null;
        }
      }
    }
    return n;
  }

  getMaxMapId(): number {
    let maxid = 0;
    const list = this.atoms;
    for (let i = 0; i < list.length; ++i) {
      if (list[i].atommapid != null && list[i].atommapid! >= maxid)
        maxid = list[i].atommapid!;
    }
    return maxid + 1;
  }

  screen(target: Mol<TBio>, fullstructure: boolean): boolean {
    if (this.stats == null)
      this.stats = this.prepareScreen();
    if (target.stats == null)
      target.stats = target.prepareScreen();

    const atomsq = this.stats.atoms;
    const atomst = target.stats.atoms;
    let at = atomst['*'] == null ? 0 : atomst['*'];
    at += atomst['A'] == null ? 0 : atomst['A'];
    at += atomst['X'] == null ? 0 : atomst['X'];
    at += atomst['Q'] == null ? 0 : atomst['Q'];
    at += atomst['L'] == null ? 0 : atomst['L'];
    for (const e in atomsq) {
      if (e == 'H' || e == '*' || e == 'A' || e == 'X' || e == 'Q' || e == 'L')
        continue;

      if (fullstructure && !(atomsq[e] == atomst[e]) || !fullstructure && !(atomsq[e] <= atomst[e] + at))
        return false;
    }

    const bondsq = this.stats.bonds;
    const bondst = target.stats.bonds;
    for (const e in bondsq) {
      if (fullstructure && !(bondsq[e] == bondst[e]) || !fullstructure && !(bondsq[e] <= bondst[e]))
        return false;
    }

    return fullstructure &&
      this.stats.rings.a5 == target.stats.rings.a5 &&
      this.stats.rings.n5 == target.stats.rings.n5 &&
      this.stats.rings.a6 == target.stats.rings.a6 &&
      this.stats.rings.n6 == target.stats.rings.n6 ||
      !fullstructure &&
      this.stats.rings.a5 <= target.stats.rings.a5 &&
      this.stats.rings.n5 <= target.stats.rings.n5 &&
      this.stats.rings.a6 <= target.stats.rings.a6 &&
      this.stats.rings.n6 <= target.stats.rings.n6;
  }

  /**
   * Perform a full-structure search
   * @function fullstructureMatch
   * @param {Mol} target - the target mol
   * @returns true or false
   */
  fullstructureMatch(target: Mol<TBio>, matchstereobonds?: boolean): boolean {
    if (
      target == null || this.atoms.length != target.atoms.length ||
      this.bonds.length != target.bonds.length || this.getMolWeight() != target.getMolWeight()
    ) return false;
    return this.aamap(target, true, null, matchstereobonds) != null;
  }

  getBrackets() {
    const list = [];
    for (let i = 0; i < this.graphics.length; ++i) {
      const b = JSDraw2.Bracket.cast<TBio>(this.graphics[i]);
      if (b != null) {
        list.push(b);
        b.sgrouptexts = this.getSgroupTexts(b)!;
      }
    }
    return list;
  }

  // todo: match included atoms as well
  matchBrackets(target: Mol<TBio>): boolean {
    const list1 = this.getBrackets();
    const list2 = target == null ? [] : target.getBrackets();
    if (list1.length != list2.length)
      return false;

    for (let i = 0; i < list1.length; ++i) {
      let f = false;
      for (let k = 0; k < list2.length; ++k) {
        if (list1[i].sgrouptexts == list2[k].sgrouptexts) {
          f = true;
          break;
        }
      }
      if (f != null)
        return false;
    }

    return true;
  }

  /**
   * Perform a sub-structure search using the Mol as a query
   * @function substructureMatch
   * @param {Mol} target - the target mol
   * @returns true or false
   */
  substructureMatch(target: Mol<TBio>) {
    return this.aamap(target, false) != null;
  }

  /**
   * Perform atom-by-atom mapping using the Mol as a query
   * @function aamap
   * @param {Mol} target - the target mol
   * @param {bool} fullstructure - indicate if performing a full-structure search
   * @param {bool} highlighting - indicate if highlighting mapped atoms and bonds
   * @returns the map result as a dictionary
   */
  aamap(target: Mol<TBio>, fullstructure: boolean, highlighting?: boolean | null, matchsterebonds?: boolean) {
    const map = this.aamap2(target, fullstructure, matchsterebonds);

    if (highlighting) {
      target.setColor(map == null ? null : 'black');
      if (map != null) {
        for (let i = 0; i < map.atoms.length; ++i)
          map.atoms[i].t.color = 'red';
        for (let i = 0; i < map.bonds.length; ++i)
          map.bonds[i].t.color = 'red';
      }
    }

    return map;
  }

  aamap2(target: Mol<TBio>, fullstructure: boolean, matchsterebonds?: boolean): AaMapType<TBio> | null {
    if (DEBUG.enable) {
      DEBUG.clear();
    }

    if (!this.screen(target, fullstructure)) {
      if (DEBUG.enable)
        DEBUG.print('screen failed');
      return null;
    }

    const path: any[] = this._bfPath();
    target.setAtomBonds();
    target.clearFlag();
    this.clearFlag();

    let i = 0;
    while (i < path.length) {
      let f = false;
      let n = path[i];

      if (n.b == null) { // start of new fragment
        for (let j = (n.f == null ? 0 : (n.f + 1)); j < target.atoms.length; ++j) {
          const t = target.atoms[j];
          n.f = j;
          if (t.f == null && JSDraw2.Atom.match(t, n.a)) {
            f = true;
            n.a.f = t;
            t.f = n.a;
            break;
          }
        }
      } else if (n.ringclosure != null) { // ring closure
        const b = target.findBond(n.b.a1.f, n.b.a2.f);
        if (b != null && n.b.order == b.order && (!matchsterebonds || n.b.type == b.type)) {
          f = true;
          b.f = n.b;
          n.b.f = b;
        }
      } else {
        const st = n.f == null ? 0 : n.f + 1;
        const t = n.startAtom().f;
        for (let k = st; k < t.bonds.length; ++k) {
          n.f = k;
          const b = t.bonds[k];
          const oa = b.otherAtom(t);
          if (b.f == null && oa.f == null && n.b.order == b.order && (!matchsterebonds || n.b.type == b.type) && JSDraw2.Atom.match(n.a, oa)) {
            f = true;
            n.a.f = oa;
            oa.f = n.a;
            n.b.f = b;
            b.f = n.b;
            break;
          }
        }
      }

      if (f) {
        // step next
        ++i;
        if (DEBUG.enable) {
          let s = '';
          if (n.a != null)
            s += n.a.id + ' -> ' + n.a.f.id + ' ';
          if (n.b != null)
            s += n.b.a1.id + '-' + n.b.a2.id + ' -> ' + n.b.f.a1.id + '-' + n.b.f.a2.id;
          DEBUG.print(s);
        }
      } else {
        // then back-trace
        if (n.b != null && n.b.f != null) {
          n.b.f.f = null;
          n.b.f = null;
        }
        if (n.a != null && n.a.f != null) {
          n.a.f.f = null;
          n.a.f = null;
        }
        n.f = null;

        if (--i < 0) {
          if (DEBUG.enable)
            DEBUG.print('failed');
          return null;
        }
        n = path[i];
        if (n.b != null && n.b.f != null) {
          n.b.f.f = null;
          n.b.f = null;
        }
        if (n.a != null && n.a.f != null) {
          n.a.f.f = null;
          n.a.f = null;
        }

        if (DEBUG.enable)
          DEBUG.print('trace back');
      }
    }

    if (DEBUG.enable)
      DEBUG.print('succeed');

    const atommap: AaMapAtomType<TBio>[] = [];
    for (let i = 0; i < this.atoms.length; ++i)
      atommap.push({q: this.atoms[i], t: this.atoms[i].f});

    const bondmap: AaMapBondType<TBio>[] = [];
    for (let i = 0; i < this.bonds.length; ++i)
      bondmap.push({q: this.bonds[i], t: this.bonds[i].f});

    return {atoms: atommap, bonds: bondmap};
  }

  _setAromaticFlag() {
    for (let i = 0; i < this.atoms.length; ++i)
      this.atoms[i].aromatic = false;

    for (let i = 0; i < this.bonds.length; ++i) {
      const b = this.bonds[i];
      if (b.type == JSDraw2.BONDTYPES.DELOCALIZED)
        b.a1.aromatic = b.a2.aromatic = true;
    }
  }

  /**
   * Get SMILES
   * @function getSmiles
   * @returns a string
   */
  getSmiles() {
    return null;
  }

  _getSmiles() {
    return null;
  }

  _getRings() {
    //        if (DEBUG.enable) {
    //            DEBUG.clear();
    //        }

    const rings = [];

    this.setAtomBonds();
    this.clearFlag();
    for (let i = 0; i < this.atoms.length; ++i) {
      this.clearFlag();
      for (let j = 0; j < i; ++j)
        this.atoms[j].f = 'ex';
      const start = this.atoms[i];
      const ret = this._getTree(start);
      if (ret.ri == 0)
        continue;

      const path: any[] = [];
      ret.tree.list(path, 'breadthfirst');

      for (let k = 0; k < path.length; ++k) {
        const b = path[k];
        if (b.depth > 3)
          break;

        if (b.ringclosure != null) {
          const ring = [b.b];
          rings.push(ring);

          let a = b.startAtom();
          let n = k;
          while (a != start) {
            for (let j = n - 1; j > 0; --j) {
              const t = path[j];
              if (t.a == a) {
                ring.push(t.b);
                a = t.startAtom();
                n = j;
                break;
              }
            }
          }

          a = b.a;
          n = k;
          while (a != start) {
            for (let j = n - 1; j > 0; --j) {
              const t = path[j];
              if (t.a == a) {
                ring.splice(0, 0, t.b);
                a = t.startAtom();
                n = j;
                break;
              }
            }
          }
        }
      }
    }

    //        if (DEBUG.enable) {
    //            for (let i = 0; i < rings.length; ++i) {
    //                DEBUG.print("ring:" + i);
    //                var r = rings[i];
    //                for (let j = 0; j < r.length; ++j) {
    //                    var s = " " + r[j].a1.id + "-" + r[j].a2.id;
    //                    DEBUG.print(s);
    //                }
    //            }
    //        }
    return rings;
  }

  _bfPath(): any[] {
    const ss: any[] = [];
    const trees = this._getTrees();
    for (let i = 0; i < trees.length; ++i)
      trees[i].list(ss, 'breadthfirst');
    return ss;
  }

  _getTrees() {
    this.setAtomBonds();
    this.clearFlag();

    const starts = [];
    let ri = 0;
    while (true) {
      let start = null;
      for (let i = 0; i < this.atoms.length; ++i) {
        const a = this.atoms[i];
        if (a.f == null && !a.isMarkedStereo()) {
          start = a;
          break;
        }
      }

      if (start == null) {
        for (let i = 0; i < this.atoms.length; ++i) {
          const a = this.atoms[i];
          if (a.f == null/* && !a.isMarkedStereo() */) {
            start = a;
            break;
          }
        }
      }

      if (start == null)
        break;

      const ret = this._getTree(start, ri);
      starts.push(ret.tree);
      ri = ret.ri;
    }

    return starts;
  }

  // breadthfirst
  _getTree(a: Atom<TBio>, ri?: number) {
    if (ri == null)
      ri = 0;

    const start = new JSDraw2.BA(null, a, null);
    start.depth = 0;

    start.a.f = true;
    const stack = new JSDraw2.Stack();
    stack.push(start);

    let ba;
    while ((ba = stack.popHead()) != null) {
      const bonds = ba.a.bonds;
      if (bonds == null)
        continue;

      for (let i = 0; i < bonds.length; ++i) {
        const b = bonds[i];
        if (b.f)
          continue;
        b.f = true;

        let next = null;
        const oa = b.otherAtom(ba.a);
        if (oa.f == 'ex')
          continue;

        if (oa.f == null) {
          oa.f = true;
          next = new JSDraw2.BA(b, oa, null);
          stack.push(next);
        } else {
          ++ri;
          if (oa.f == true && oa.ringclosures == null)
            oa.ringclosures = [];
          oa.ringclosures.push({ri: ri, next: new JSDraw2.BA(b, ba.a, ri)});
          next = new JSDraw2.BA(b, oa, ri);
        }
        ba.addNext(next);
      }
    }

    return {tree: start, ri: ri};
  }

  // depth-first
  _getPath(b: any): any[] {
    const stack = new JSDraw2.Stack();
    stack.push({b: b, a: b.a1.bonds.length > b.a2.bonds.length ? b.a1 : b.a2});

    b.a1.f = true;
    const path: any[] = [];
    while ((b = stack.pop()) != null) {
      if (b.b.f)
        continue;

      path.push(b);
      if (b.a.f)
        b.ringclosure = true;
      b.b.f = b.a.f = true;

      const bonds = b.a.bonds;
      for (let i = bonds.length - 1; i >= 0; --i) {
        if (!bonds[i].f)
          stack.push({b: bonds[i], a: bonds[i].otherAtom(b.a)});
      }
    }

    return path;
  }

  /**
   * Get molecular formula
   * @function getFormula
   * @param {bool} html - indicate if rendering the formula in HTML format
   * @returns a string
   */
  getFormula(html: boolean): string {
    const rxn = this.parseRxn();
    if (rxn == null)
      return this._getFormula(html);

    let s = '';
    if (rxn.arrow != null) {
      for (let i = 0; i < rxn.reactants.length; ++i)
        s += (i > 0 ? ' + ' : '') + rxn.reactants[i]._getFormula(html);
      s += html ? ' &rarr; ' : ' ---> ';
      for (let i = 0; i < rxn.products.length; ++i)
        s += (i > 0 ? ' + ' : '') + rxn.products[i]._getFormula(html);
      return s;
    } else {
      for (let i = 0; i < rxn.reactants.length; ++i)
        s += (i > 0 ? ' + ' : '') + rxn.reactants[i]._getFormula(html);
    }
    return s;
  }

  _getFormula(html: boolean): string {
    const m = this.expandSuperAtoms();
    const stats = JSDraw2.FormulaParser.getAtomStats(m);
    return JSDraw2.FormulaParser.stats2mf(stats, html);
  }

  /**
   * Get molecular weight
   * @function getMolWeight
   * @returns a number
   */
  getMolWeight(): number | null {
    const mw = this.getMixtureMW();
    if (mw! > 0)
      return mw;

    if (this.hasGenericAtom())
      return null;

    const m = this.expandSuperAtoms();
    const stats = JSDraw2.FormulaParser.getAtomStats(m);
    const sum = JSDraw2.FormulaParser.stats2mw(stats);
    return sum == null ? null : Math.round(sum * 10000) / 10000;
  }

  getMixtureMW() {
    for (let i = 0; i < this.graphics.length; ++i) {
      const br = JSDraw2.Bracket.cast<TBio>(this.graphics[i]);
      if (br == null || !(br.type == '' || br.type == null))
        continue;

      const t = this.getSgroupText(br, 'POLYMER_MW');
      if (t == null)
        continue;

      const s = scil.Utils.trim(t.text);
      if (s != null && scil.Utils.startswith(s, 'mw=')) {
        const n = s.substr(3);
        return parseFloat(n);
      }
    }
    return null;
  }

  /**
   * Get exact mass
   * @function getExactMass
   * @returns a number
   */
  getExactMass() {
    if (this.hasGenericAtom())
      return null;

    const m = this.expandSuperAtoms();
    const stats = JSDraw2.FormulaParser.getAtomStats(m);
    const sum = JSDraw2.FormulaParser.stats2em(stats);
    return sum == null ? null : Math.round(sum * 10000) / 10000;
  }

  getAllBonds(a: Atom<TBio>): Bond<TBio>[] {
    const ret = [];
    const bonds = this.bonds;
    for (let i = 0; i < bonds.length; ++i) {
      if (bonds[i].a1 == a || bonds[i].a2 == a)
        ret.push(bonds[i]);
    }
    return ret;
  }

  getAllBondAtoms(a: Atom<TBio>): Atom<TBio>[] {
    const ret: Atom<TBio>[] = [];
    const bonds: Bond<TBio>[] = this.bonds;
    for (let i = 0; i < bonds.length; ++i) {
      if (bonds[i].a1 == a)
        ret.push(bonds[i].a2);
      else if (bonds[i].a2 == a)
        ret.push(bonds[i].a1);
    }
    return ret;
  }

  countSelected() {
    let n = 0;
    for (let i = 0; i < this.atoms.length; ++i) {
      if (this.atoms[i].selected)
        ++n;
    }
    for (let i = 0; i < this.bonds.length; ++i) {
      if (this.bonds[i].selected)
        ++n;
    }
    for (let i = 0; i < this.graphics.length; ++i) {
      if (this.graphics[i].selected)
        ++n;
    }
    return n;
  }

  setSgroup(br: Bracket<TBio>, fieldtype: string, v: string | null, x: number, y: number): Text<TBio> | null {
    if (v == '')
      v = null;

    if (fieldtype == 'BRACKET_TYPE' && v == 'mul' && br.subscript != null && br.subscript != '') {
      v = br.subscript;
      br.subscript = null;
    }

    let t = this.getSgroupText(br, fieldtype);
    if (v == null) {
      if (t != null) {
        this.delGraphics(t as IGraphics);
        return t;
      }
    } else {
      if (t != null) {
        if (t.text != v) {
          t.text = v;
          return t;
        }
      } else {
        const r = new JSDraw2.Rect(x, y, 0, 0);
        t = new JSDraw2.Text(r, v);
        t.fieldtype = fieldtype;
        t.anchors.push(br);
        br._parent.addGraphics(t as IGraphics);
        return t;
      }
    }

    return null;
  }

  getSgroupText(br: any, fieldtype: string): Text<TBio> | null {
    for (let i = 0; i < this.graphics.length; ++i) {
      const t = JSDraw2.Text.cast<TBio>(this.graphics[i]);
      if (t != null && t.fieldtype == fieldtype && t.anchors.length == 1 && t.anchors[0] == br)
        return t;
    }
    return null;
  }

  getSgroupTexts(br: any): string | null {
    const ss: any[] = [];
    for (let i = 0; i < this.graphics.length; ++i) {
      const t = JSDraw2.Text.cast<TBio>(this.graphics[i]);
      if (t != null && t.anchors.length == 1 && t.anchors[0] == br)
        ss.push(t.text);
    }

    if (ss.length == 0)
      return null;

    ss.sort();
    return scil.Utils.array2str(ss, '; ');
  }

  removeTags(br: any, fieldtypes: any) {
    let n = 0;
    for (let i = this.graphics.length - 1; i >= 0; --i) {
      const t = JSDraw2.Text.cast<TBio>(this.graphics[i]);
      if (t != null && t.anchors.length == 1 && t.anchors[0] == br && fieldtypes.indexOf(t.fieldtype + ',') >= 0) {
        this.delGraphics(t as IGraphics);
        ++n;
      }
    }
    return n;
  }
}

JSDraw2.Mol = Mol;

var JsMol: (typeof Mol) = Mol;
