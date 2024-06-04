import {MonomerTypes} from './org';
import {IParserMolHandler} from './parser-mol-handler';

export const enum BondTypes {
  UNKNOWN = 0,
  SINGLE = 1,
  DOUBLE = 2,
  TRIPLE = 3,
  DELOCALIZED = 4,
  WEDGE = 5,
  HASH = 6,
  WIGGLY = 7,
  EITHER = 8,
  SINGLEORDOUBLE = 9,
  SINGLEORAROMATIC = 10,
  DOUBLEORAROMATIC = 11,
  QUADRUPLE = 12,
  DUMMY = 13,
  BOLD = 14,
  BOLDHASH = 15,
  PEPTIDE = 21,
  NUCLEOTIDE = 22,
  DISULFIDE = 23,
  AMIDE = 24,
}

export const enum RxnCenterTypes {
  NOTCENTER = -1,
  CENTER = 1,
  BREAK = 4,
  CHANGE = 8,
  BREAKANDCHANGE = 12
}

// export type BondType = `${BondTypes}`;

const AlignTypes = new class {
  RIGHT = 0;
  BOTTOM = 1;
  LEFT = 2;
  TOP = 3;
}();

const AntibodyTypes = new class {
  IgG = 'IgG';
  Fab = 'Fab';
  ScFv = 'ScFv';
}();

const BioTypes = new class {
  AA = 'AA';
  //BASE: 'BASE';
  ANTIBODY = 'ANTIBODY';
  PROTEIN = 'PROTEIN';
  GENE = 'GENE';
  DNA = 'DNA';
  RNA = 'RNA';
  BASE_DNA = 'BASEDNA';
  BASE_RNA = 'BASERNA';
}();

export type BioType = keyof typeof BioTypes;

// const BioTypes = new class {
//   AA = 'AA';
//   //BASE= 'BASE',
//   ANTIBODY = 'ANTIBODY';
//   PROTEIN = 'PROTEIN';
//   GENE = 'GENE';
//   DNA = 'DNA';
//   RNA = 'RNA';
//   BASE_DNA = 'BASEDNA';
//   BASE_RNA = 'BASERNA';
// }();

export interface ICast<T> {
  cast(obj: any): T;
}

export interface IEditorOptions {
  width: number;
  height: number;
  skin: string;
  viewonly: boolean;
}

export interface IEditorPoint {
  get x(): number;

  get y(): number;
}

export interface IAtomBio {
  type: 'HELM_BASE' | 'HELM_SUGAR' | 'HELM_LINKER' | 'HELM_AA' | 'HELM_CHEM' | 'HELM_BLOB' |
    /* type as in Pistoia.HELM-uncompressed.js */'HELM_NUCLETIDE';

}

export interface IBond<TBio = any> extends ICast<IBond<TBio>> {
  get a1(): IAtom<TBio>;
  get a2(): IAtom<TBio>;

  ratio1: number;
  ratio2: number;

  ring: boolean;
  f: number;
  tag: string;

  get type(): number;
  new(a1: IAtom<TBio>, a2: IAtom<TBio>, bt: BondTypes): IBond<TBio>;
}

export interface IGraphics {
  rect(): IRect;
}

export interface IBracket<TBio> extends IGraphics, ICast<IBracket<TBio>> {
  atoms: IAtom<TBio>[];
  conn: string | null;
  expandedatoms: any | null;
  sgrouptexts: string;
  subscript: string | null;
  type: string | null;

  _rect: IRect;

  new(ty: string, r: IRect | null): IBracket<TBio>;

  getType(): string;
  getXbonds(m: IMol<TBio>): any;
  getTypeNum(): string;
  createSubscript(mol: IMol<TBio>, repeat?: string): void;
}

export interface IMol<TBio> {
  atoms: IAtom<TBio>[];
  bonds: IBond<TBio>[];
  graphics: IGraphics[];

  bondlength: number;
  name: string;
  chiral: any;
  props: any;
  showimplicithydrogens: boolean;
  mw: number;
  attachpoints: any;

  new(showimplicithydrogens?: boolean): IMol<TBio>;

  isEmpty(): boolean;
  clone(selectedOnly: boolean): IMol<TBio>;
  getSgroupTexts(br: IBracket<TBio>): string;
  setXml(el: HTMLElement): any;
  setMolV3000(linses: string[], start: number, rxn: any, pos?: any, endtoken?: any): void;

  addGraphics(G: IGraphics): IGraphics;
  _addAtom(a1: IAtom<TBio>, parent?: IMol<TBio>): void;
  _addBond(b1: IBond<TBio>, parent?: IMol<TBio>): void;
  _addGraphics(g1: any): void;
  _setParent(parent: IMol<TBio>): void;

  getMaxRIndex(index: number): number;
}

export interface IEditor<TBio> extends IParserMolHandler<TBio> {
  BONDLENGTH: number;
  ANGLESTOP: number;
  LINEWIDTH: number;
  TOR: number;
  FONTSIZE: number;

  get options(): IEditorOptions;

  get div(): HTMLDivElement;

  get m(): IMol<TBio>;

  new(host: HTMLElement, options?: Partial<IEditorOptions>): IEditor<TBio>;

  resize(width: number, height: number): void;

  /** Clear all contents */ clear(redraw: boolean, fireevents: boolean): void;

  /** Resets and clears undo and redo buffers */ reset(): void;

  setData(data: string, format: string): void;

  setHelm(helm: string): void;

  setSize(w: number, h: number): void;

  getMolfile(): string;

  getFormula(b: boolean): string;

  getMolWeight(): number;

  getExtinctionCoefficient(): number;
}

export interface IPoint {
  x: number;
  y: number;

  new(x: number, y: number): IPoint;
  fromString(pointStr: string): IPoint;

  clone(): IPoint;
  isValid(): boolean;
  intersect(p1: IPoint, q1: IPoint, p2: IPoint, q2: IPoint): boolean;
  rotate(deg: number): any;

  _orientation(p: IPoint, q: IPoint, r: IPoint): number;
}

export interface IPlus {
  p: IPoint;
  new(p: IPoint): IPlus;
}

export interface IRect {
  left: number;
  top: number;
  width: number;
  height: number;

  new(left: number, top: number, width: number, height: number): IRect;
  new(): IRect;

  contains(p: IPoint): boolean;
  right(): number;
  bottom(): number;
  center(): IPoint;

  set(p1: IPoint, p2: IPoint): IRect;
  union(r: IRect): IRect;
}

export interface IStack<T = any> {
  new<T = any>(): IStack<T>;
  push(item: T): void;
  pop(): T | null;
  popHead(): T | null;
}

export interface IPistoiaBase {
  get T(): string;
}

export interface IBio<TBio> {
  id?: number | null;
  type: TBio;
  ambiguity?: string | null;
  annotation?: string | null;
  annotationshowright?: string | null;
}

export interface IJsAtom<TBio> extends IPistoiaBase {
  get T(): 'ATOM';

  p: IPoint;

  get elem(): string;

  bio: IBio<TBio>;

  // [propName: string]: any;

  // get charge(): number;
  //
  // get isotope(): string | null;
  //
  // get radical(): string | null;
  //
  // get group(): string | null;
  //
  // get alias(): string | null;
  //
  // get superatom(): string | null;
  //
  // get attachpoints(): [];
  //
  // get rgroup(): string | null;
  //
  // get locked(): boolean;
  //
  // get hidden(): boolean | null;
  //
  // private get _rect(): object | null;
  //
  // get color(): string | null;
  //
  // get hcount(): number | null;
  //
  // get selected(): boolean;
  //
  // get f(): number | null;
  //
  // get bonds(): [] | null;
  //
  // get id(): string | null;
  //
  // get atommapid(): string | null;
}

export type AtomGroupType = string;

export interface IAtom<TBio = any> extends IJsAtom<TBio> {
  elem: string;
  charge: number;
  isotope: string;
  radical: string;
  hcount: number;
  id: number;
  color: string;
  tag: string;
  alias: string;
  superatom: IMol<TBio> | null;
  attachpoints: any[];
  atommapid: number;
  rgroup: IRGroup<TBio>;
  hasError: boolean;
  hs: number;
  val: any;
  query: any;
  locked: boolean;
  hidden: boolean;
  ratio: number;
  selected: boolean;
  f: number;

  group: AtomGroupType;

  _aaid: number | null;

  new(p: IPoint, elem: string, bio?: IBio<TBio>): IAtom<TBio>;
  //constructor(p: IPoint, elem: string, bio?: IBio<TBio>): IAtom<TBio>;

  biotype(): TBio;
  cast(obj: any): IAtom<TBio>;
  drawAlias(...args: any[]): void;
  isValidChiral(c: string): boolean;
  isStereo(c: string): boolean;
  match(x: IAtom<TBio>, y: IAtom<TBio>): boolean;
  match2(e1: string, e2: string): boolean;
}

export interface IRGroup<TBio = any> {
  position: IPoint;
  mols: IMol<TBio>[];

  new(): IRGroup<TBio>;

  readHtml(t: HTMLElement, v: any): any;
}

export type SruGenType = 'SRU' | 'GEN' | 'MUL';

export interface ISGroup {
  fieldtypes: any[];
  stys: SruGenType[];
}

export interface ISuperAtoms<TBio> {
  addToMol(m: IMol<TBio>, a: IAtom<TBio>, superatom: IMol<TBio>): void;
  get(name: string): any | null;
  guessOne(name: string): any | null;

  collapseRepeat(m: IMol<TBio>, br: IBracket<TBio>): void;
  expandRepeat(m: IMol<TBio>, br: IBracket<TBio>): void;

  _getFirstAttachAtom(m: any): any;
  _alignMol(dest: IMol<TBio>, a: any, src: IMol<TBio>, a0: any, len: number): void;
}

export interface IDefaultOptions {
  xdraw: string;
  popupwidth: string;
  popupheight: string;
  popupxdraw: boolean;
  jdrawpath: string;
  monocolor: boolean;

  and_enantiomer: boolean;
}

export interface ISpeedup {
  fontsize: number,
  gap: number,
  disableundo: boolean;
  minbondlength: number;
}

export type JSDraw2ModuleType<TBio> = {
  defaultoptions: IDefaultOptions;
  speedup: ISpeedup;

  ALIGN: typeof AlignTypes;
  ANTIBODY: typeof AntibodyTypes;
  BIO: typeof BioTypes;
  BONDTYPES: typeof BondTypes;
  RXNCENTER: typeof RxnCenterTypes;

  Atom: IAtom<TBio>;
  Bond: IBond<TBio>;
  Bracket: IBracket<TBio>;
  Drawer: any;

  Editor: IEditor<TBio>;
  MolHandler: IParserMolHandler<TBio>;

  Group: any;
  Mol: IMol<TBio>;
  Point: IPoint;
  Rect: IRect;
  Plus: IPlus;
  Shape: any;
  Text: any;
  Lasso: any;

  Stack: IStack;
  PT: any;

  RGroup: IRGroup<TBio>;
  SGroup: ISGroup;
  SuperAtoms: ISuperAtoms<TBio>;

  BA: any;
  IDGenerator: any;
  FormulaParser: any;
}
