//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw.Lite
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//
// (Released under LGPL 3.0: https://opensource.org/licenses/LGPL-3.0)
//
//////////////////////////////////////////////////////////////////////////////////

import type {Atom} from './Atom';
import type {Bond} from './Bond';
import type {Mol} from './Mol';

import type {JSDraw2ModuleType, ScilModuleType} from './types';
import type {OrgType} from './types/org';
import {IDrawOptions} from './types/jsdraw2';

declare const scil: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType;
declare const org: OrgType<any, IDrawOptions>;

export class SuperAtoms<TBio = any> {
  sdf: string = "\nMolEngine02241412152D\n\n  6  6  0  0  0  0            999 V2000\n    1.3510    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.7800    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    2.3400    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7020    0.7800    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7020    2.3400    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.3510    3.1200    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  2  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  4  5  2  0  0  0  0\n  5  6  1  0  0  0  0\n  6  3  2  0  0  0  0\nM  END\n> <T>\nBenzene\n\n$$$$\n\nMolEngine02241412152D\n\n  6  6  0  0  0  0            999 V2000\n    1.3510    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.7800    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    2.3400    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.3510    3.1200    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7020    2.3400    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7020    0.7800    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  6  1  1  0  0  0  0\nM  END\n> <T>\nHexane\n\n$$$$\n\nMolEngine02241412152D\n\n  5  5  0  0  0  0            999 V2000\n    0.0000    0.4821    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4836    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.4006    1.2621    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4836    2.5242    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    2.0421    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  1  1  0  0  0  0\nM  END\n> <T>\nPentane\n\n$$$$\n\nMolEngine02241412152D\n\n  3  3  0  0  0  0            999 V2000\n    0.7800    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    1.3510    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.5600    1.3510    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\n  2  3  1  0  0  0  0\nM  END\n> <T>\nPropane\n\n$$$$\n\nMolEngine02241412152D\n\n  4  4  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    1.5600    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.5600    1.5600    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.5600    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  1  1  0  0  0  0\nM  END\n> <T>\nButane\n\n$$$$\n\nMolEngine02241412152D\n\n  7  7  0  0  0  0            999 V2000\n    0.0000    0.9727    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.2196    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7405    0.3471    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.4174    1.7527    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7405    3.1581    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.2196    3.5054    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    2.5327    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  6  7  1  0  0  0  0\n  7  1  1  0  0  0  0\nM  END\n> <T>\nHeptane\n\n$$$$\n\nMolEngine02241412152D\n\n  8  8  0  0  0  0            999 V2000\n    0.0000    1.1031    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.1031    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.6631    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.7660    1.1031    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.7660    2.6631    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.6631    3.7662    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.1031    3.7662    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    2.6631    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  6  7  1  0  0  0  0\n  7  8  1  0  0  0  0\n  8  1  1  0  0  0  0\nM  END\n> <T>\nOctane\n\n$$$$\n";

  dict: { [name: string]: Mol<TBio> } | null = null;
  reversible: { [name: string]: any } = {};
  AminoAcids: { [name: string]: any } = {};
  DNAs: { [name: string]: any } = {};
  RNAs: { [name: string]: any } = {};
  templates: { [name: string]: any } = {};
  nterminals: { [name: string]: any } = {};
  cterminals: { [name: string]: any } = {};
  customtemplates: { [name: string]: any } = {};
  public onAfterRead: Function | null = null;

  listFunctionalGroups(parent: any): void {
    this.read();
    const cols = [{key: 'name', caption: 'Name', width: 200}, {key: 'molfile', type: "structure", caption: 'Structure'}];
    const jss = new JSDraw2.Table(null, {columns: cols, toolbar: ["search"]}, parent);

    const list = [];
    for (const name in this.dict)
      list.push({name: name, molfile: this.dict[name] == null ? null : this.dict[name].getMolfile()});
    jss.setJson({rows: list});
  }

  filter(q: string | null, n: number): string[] | null {
    if (q == null || q == "")
      return null;

    const ret: string[] = [];
    q = q.toLowerCase();
    const len = q.length;
    for (const k in this.dict) {
      if (k.length >= len && k.substr(0, len).toLowerCase() == q) {
        ret.push(k);
        if (ret.length >= n)
          break;
      }
    }
    return ret;
  }

  get(name: string): any {
    this.read();
    let m: Mol<TBio> | null = this.dict![name];
    if (m == null)
      m = this.nterminals[name];
    if (m == null)
      m = this.cterminals[name];
    return m == null ? null : m.clone();
  }

  getDNA(name: string): any {
    this.read();
    return this.DNAs[name];
  }

  getRNA(name: string): any {
    this.read();
    return this.RNAs[name];
  }

  getAA(name: string): any {
    this.read();
    return this.AminoAcids[name];
  }

  getTemplate(name: string): any {
    this.read();
    return this.templates[name];
  }

  hasCustomTemplates(name: string): boolean {
    this.read();
    for (var k in this.customtemplates)
      return true;
    return false;
  }

  getCustomTemplate(name: string): any {
    this.read();
    return this.customtemplates[name];
  }

  // COOH --> HOOC, CO2H --> HO2C, n-But --> n-But, Boc --> Boc
  reverseLabel(s: string): string {
    this.read();
    if (this.get(s) != null)
      return this.reverseLabel2(s);

    const c = s.substr(0, 1);
    const s1 = s.substr(1);
    if ((c == "O" || c == "S") && this.get(s1) != null)
      return this.reverseLabel2(s1) + c;

    return s;
  }

  reverseLabel2(s: string): string {
    if (this.reversible[s] == null)
      return s;

    let ret = "";
    for (let i = s.length - 1; i >= 0; --i) {
      let n = 1;
      for (let j = i; j >= 0; --j) {
        const c = s.charCodeAt(j);
        if (c >= 65 && c <= 90)
          break;
        else
          ++n;
      }
      i -= n - 1;
      ret += s.substr(i, n);
    }
    return ret;
  }

  guessOne(name: string): string | null {
    this.read();

    name = name.toLowerCase();
    for (const k in this.dict) {
      if (k.toLowerCase() == name)
        return k;
    }

    return null;
  }

  read() {
    if (this.dict != null)
      return;
    this.dict = {};
    this.addSdf(this.sdf);

    if (JSDraw2.defaultoptions != null)
      this.addSdf(JSDraw2.defaultoptions.abbreviations!);
    this.addSdf(JSDraw2.abbreviations);

    if (this.onAfterRead != null)
      this.onAfterRead();
  }

  addSdf(sdf: string): void {
    if (sdf == null || sdf == "")
      return;

    const ss: string[] = sdf.split("$$$$");
    for (let k = 0; k < ss.length; ++k) {
      const r = JSDraw2.Table.readSdfRecord(ss[k], true);
      if (r == null)
        break;

      const template = r.props["T"];
      const customtemplate = r.props["CT"];
      const strname = r.props["Name"];
      const m: Mol<TBio> = new JSDraw2.Mol();
      m.setMolfile(r.molfile);
      //this.normalize(m);
      if (template != null) {
        this.templates[template] = m;
      } else if (customtemplate != null) {
        this.customtemplates[customtemplate] = m;
      }
    }
  }

  _getAttachAtoms(m: Mol<TBio>) {
    const list = [];
    if (m != null) {
      for (let i = 0; i < m.atoms.length; ++i) {
        const a: Atom<TBio> = m.atoms[i];
        for (var k = 0; k < a.attachpoints.length; ++k)
          list[a.attachpoints[k] - 1] = {apo: a.attachpoints[k], a: a};
      }
    }
    return list;
  }

  _alignMol(dest: Mol<TBio>, a: Atom<TBio>, src: Mol<TBio>, a0: Atom<TBio>, len: number): boolean {
    if (len > 0)
      src.setBondLength(len);

    const bonds = dest.getNeighborBonds(a);
    if (bonds.length == 0) {
      src.offset(a.p.x - a0.p.x, a.p.y - a0.p.y);
    } else if (bonds.length == 1) {
      // offset to reference atom
      src.offset(a.p.x - a0.p.x, a.p.y - a0.p.y);

      const b = bonds[0];
      // rotate to the reversed direction
      const deg = b.otherAtom(a)!.p.angleTo(a.p);
      const bs: Bond<TBio>[] = src.getNeighborBonds(a0);
      if (bs.length == 1)
        src.rotate(a.p, deg + 60 - a0.p.angleTo(bs[0].otherAtom(a0)!.p));
      else if (bs.length == 2)
        src.rotate(a.p, deg + 180 - a0.p.middleAngle(bs[0].otherAtom(a0)!.p, bs[1].otherAtom(a0)!.p));
    } else if (bonds.length == 2) {
      // offset to reference atom
      src.offset(a.p.x - a0.p.x, a.p.y - a0.p.y);

      // rotate to the reversed direction
      const deg = a.p.middleAngle(bonds[0].otherAtom(a)!.p, bonds[1].otherAtom(a)!.p);
      const bs: Bond<TBio>[] = src.getNeighborBonds(a0);
      if (bs.length == 1)
        src.rotate(a.p, deg + 60 - a0.p.angleTo(bs[0].otherAtom(a0)!.p));
      else if (bs.length == 2)
        src.rotate(a.p, deg + 180 - a0.p.middleAngle(bs[0].otherAtom(a0)!.p, bs[1].otherAtom(a0)!.p));
    } else {
      return false;
    }

    return true;
  }
}

JSDraw2.SuperAtoms = new SuperAtoms();
