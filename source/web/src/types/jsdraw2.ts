import {IMolHandler} from './mol-handler';

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

export const MoleculeTypes = ["SmallMolecule", "Polymer", "Peptide", "DNA", "RNA", "ADC", "ChemicalReagent"];

export const TextKeywords = ["°C", "rt", "reflux", "hr", "min", "sec", "psi", "atm", "overnight", "microwave", "Δ"];

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

export interface IGraphics {
  rect(): IRect;
}

export interface IBracket<TBio> extends IGraphics, ICast<IBracket<TBio>> {
  atoms: IAtom<TBio>[];
  color: string;
  shape: IShape;
  conn: string | null;
  expandedatoms: any | null;
  sgrouptexts: string;
  subscript: string | null;
  type: string | null;

  _rect: IRect;

  new(type: string, rect: IRect | null, shape?: IShape): IBracket<TBio>;

  clone(): IBracket<TBio>;

  getTexts(m: IMol<TBio>): any;
  getType(): string;
  getSubscript(m: IMol<TBio>): string;
  getXbonds(m: IMol<TBio>): any;
  getTypeNum(): string;
  createSubscript(mol: IMol<TBio>, repeat?: string): void;
}

export interface IMol<TBio = any> {
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
  clone(selectedOnly?: boolean): IMol<TBio>;
  getSgroupTexts(br: IBracket<TBio>): string;

  getXml(width?: number, height?: number, viewonly?: boolean, svg?: any, len?: number): string;
  setXml(el: HTMLElement | string): any;
  setMolV3000(linses: string[], start: number, rxn: any, pos?: any, endtoken?: any): void;
  setJdx(data: any, bondlength: number): IMol<TBio>;

  setMolfile(molfile: string): IMol<TBio>;
  addGraphics(G: IGraphics): IGraphics;
  getFragment(a: IAtom<TBio>, parent: IMol<TBio>): IMol<TBio>;
  mergeMol(m: IMol<TBio>): void;

  addAtom(a: IAtom<TBio>): IAtom<TBio> | null;
  addBond(b: IBond<TBio>, resetcharge?: boolean, add2group?: boolean): IBond<TBio> | null;
  setAtomType(a: IAtom<TBio>, elem: string, setCharge?: boolean): boolean;
  setHCount(a: IAtom<TBio>): void;
  setAtomAlias(a: IAtom<TBio>, alias: string, len?: number): boolean;
  setBondLength(bondlength: number): void;

  _addAtom(a1: IAtom<TBio>, parent?: IMol<TBio>): void;
  _addBond(b1: IBond<TBio>, parent?: IMol<TBio>): void;
  _addGraphics(g1: any): void;
  _setParent(parent: IMol<TBio>): void;

  offset(dx: number, dy: number, selectedOnly?: boolean): void;
  getNeighborAtoms(a: IAtom<TBio>, oa: IAtom<TBio>, excludeDummyBond?: boolean): IAtom<TBio>[];
  getMaxRIndex(index: number): number;

  [p: string]: any;
}

type ColorArrayType = [number, number, number, number];

export interface IOrgPlugin<TBio> {
  new(jsd: IMolHandler<TBio>): IOrgPlugin<TBio>;
}

export interface IEditorOptions {
  xdraw: string;
  popupwidth: string;
  popupheight: string;
  popupxdraw: boolean;
  jdrawpath: string;

  query: boolean;
  rxn: boolean;
  biology: boolean;
  sendquery: boolean;
  showtoolbar: boolean;
  showcustomtemplates: boolean;
  usechemdraw: boolean;

  showcarbon: boolean;
  pastechemdraw: boolean;
  removehydrogens: boolean;

  width: number;
  height: number;
  viewonly: boolean;

  ondatachange: any;
  data: string;
  dataformat: string;

  showimplicithydrogens: boolean;
  inktools: boolean;
  highlighterrors: boolean;
  skin: string;

  monocolor: boolean;
  fullscreen: boolean;

  buttonshape: string;
  scale: number;

  and_enantiomer: boolean;
  delheteroatom: boolean;
  minautowidth1: number;
  minautowidth2: number;
  minautowidth3: number;

  suggestcount: number;

  atomlist: any;
  textlist: any;

  tlc: any;
}

export interface IEditor<TBio> extends IMolHandler<TBio> {
  BONDLENGTH: number;
  ANGLESTOP: number;
  LINEWIDTH: number;
  TOR: number;
  FONTSIZE: number;

  COLORCURRENT: ColorArrayType;
  COLORSELECTED: ColorArrayType;

  dblclickdelay: number;
  helm: IOrgPlugin<TBio>;

  _id: number | null;
  _allitems: {};

  undoGestureTime: number;

  get options(): IEditorOptions;

  get div(): HTMLDivElement;

  get m(): IMol<TBio>;

  about: any | null;
  jsd: any | null;
  periodictable: any | null;
  popupdlg: any | null;
  openfiledlg: any | null;
  savefiledlg: any | null;

  new(host: HTMLElement, options?: Partial<IEditorOptions>): IEditor<TBio>;

  initNoDelay(): void;
  destroy(): void;
  setSize(w: number, h: number): void;
  resize(width: number, height: number): void;

  /** Clear all contents */ clear(redraw: boolean, fireevents: boolean): void;
  /** Resets and clears undo and redo buffers */ reset(): void;
  setData(data: string, format: string): void;
  setHelm(helm: string): void;

  getClipboard(): IMol<TBio>;
  setClipboard(m: IMol<TBio>, bondlength: number): void;

  getMolfile(): string;
  setMolfile(m: IMol<TBio>): void;

  getFormula(b: boolean): string;
  getMolWeight(): number;
  getExtinctionCoefficient(): number;

  showPopup(title: string, btnText: string, btnFn: Function, value?: any, zindex?: number): any;
  showAbout(): void;

  get(id: string): IEditor<TBio>;
  onPT(elem: HTMLElement): void;
  onSaveFile(): void;

  [p: string]: any;
}

export interface IPoint {
  x: number;
  y: number;

  tm: number;

  clientX: number;
  clientY: number;

  new(x: number, y: number): IPoint;
  fromString(pointStr: string): IPoint;

  clone(): IPoint;
  isValid(): boolean;
  intersect(p1: IPoint, q1: IPoint, p2: IPoint, q2: IPoint): boolean;
  offset(dx: number, dy: number): IPoint;
  rotate(deg: number): any;

  _orientation(p: IPoint, q: IPoint, r: IPoint): number;
}

export interface IPlus {
  p: IPoint;
  new(p: IPoint): IPlus;
}

export type IShape = any;

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

  offset(dx: number, dy: number): IRect;
  union(r: IRect): IRect;
}

export interface IStack<T = any> {
  new<T = any>(length?: number): IStack<T>;
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
  superatom: IMol<TBio>;//ISuperAtoms<TBio> | null;
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
  _parent: IMol<TBio>;
  _helmgroup: any;

  new(p: IPoint, elem?: string, bio?: IBio<TBio>): IAtom<TBio>;
  //constructor(p: IPoint, elem: string, bio?: IBio<TBio>): IAtom<TBio>;

  biotype(): TBio;
  cast(obj: any): IAtom<TBio>;
  getLabel(): string;
  drawAlias(...args: any[]): void;
  isValidChiral(c: string): boolean;
  isStereo(c: string): boolean;
  match(x: IAtom<TBio>, y: IAtom<TBio>): boolean;
  match2(e1: string, e2: string): boolean;
}

export interface IBond<TBio = any> extends ICast<IBond<TBio>> {
  get a1(): IAtom<TBio>;
  get a2(): IAtom<TBio>;

  apo1: number;
  apo2: number;

  ratio1: number;
  ratio2: number;

  ring: boolean;
  selected: boolean;
  type: number;
  tag: string;
  f: number;

  _parent: IMol<TBio>;

  new(a1: IAtom<TBio>, a2: IAtom<TBio>, bt?: BondTypes): IBond<TBio>;

  isBio(): boolean;
  angle(): number;
  bondLength(): number;

  reverse(): void;
}

export interface IRGroup<TBio = any> extends ICast<IRGroup<TBio>> {
  position: IPoint;
  mols: IMol<TBio>[];

  new(): IRGroup<TBio>;

  readHtml(t: HTMLElement, v: any): any;
}

export type SruGenType = 'SRU' | 'GEN' | 'MUL';

export interface ISGroup {
  fieldtypes: any[];
  stys: SruGenType[];

  getDisplayTypes(): any;
}

export interface ISuperAtoms<TBio> {
  addToMol(m: IMol<TBio>, a: IAtom<TBio>, superatom: IMol<TBio>): void;
  get(name: string): any | null;
  guessOne(name: string): any | null;

  collapseRepeat(m: IMol<TBio>, br: IBracket<TBio>): void;
  expandRepeat(m: IMol<TBio>, br: IBracket<TBio>): void;

  _getFirstAttachAtom(m: any): any;
  _alignMol(dest: IMol<TBio>, a: IAtom<TBio>, src: IMol<TBio>, a0: IAtom<TBio>, len?: number): boolean;

  getAA(name: string): IMol<TBio>;
  getRNA(name: string): IMol<TBio>;
  getDNA(name: string): IMol<TBio>;
  [p: string]: any;
}

export interface ISpeedup {
  fontsize: number,
  gap: number,
  disableundo: boolean;
  minbondlength: number;
}

export type JSDraw2ModuleType<TBio> = {
  defaultoptions: Partial<IEditorOptions>;
  version: string;

  __currentactived: any;


  speedup: ISpeedup;

  ALIGN: typeof AlignTypes;
  ANTIBODY: typeof AntibodyTypes;
  BIO: typeof BioTypes;
  BONDTYPES: typeof BondTypes;
  RXNCENTER: typeof RxnCenterTypes;
  MOLECULETYPES: typeof MoleculeTypes;
  TEXTKEYWORDS: typeof TextKeywords;

  Atom: IAtom<TBio>;
  Bond: IBond<TBio>;
  Bracket: IBracket<TBio>;
  Drawer: any;

  Editor: IEditor<TBio>;
  MolHandler: IMolHandler<TBio>;

  Group: any;
  Mol: IMol<TBio>;
  Point: IPoint;
  Rect: IRect;
  Plus: IPlus;
  Shape: any;
  Text: any;
  Lasso: any;
  Skin: any;
  Security: any;

  AssayCurve: any;
  Spectrum: any;
  Stack: IStack;
  PT: any;
  TLC: any;
  Base64: any;
  JSDrawIO: any;
  Symbol: any;

  RGroup: IRGroup<TBio>;
  SGroup: ISGroup;
  SuperAtoms: ISuperAtoms<TBio>;

  BA: any;
  IDGenerator: any;
  ChemDraw: any;
  ChemdrawPopup: any;
  FormulaParser: any;
  Fullscreen: any;
  CustomTemplates: any;
  TLCTemplates: any;
  Language: any;
  SequenceBuilder: any;
  Ink: any;

  Arrow: any;
  Curve: any;
  ContextMenu: any;
  Dialog: any;
  Menu: any;
  Toolbar: any;

  needPro(): void;
}

export type JSDraw2Window = {
  navigator: {
    msPointerEnabled: boolean,
  }
}

export type JSDraw2Document = {
  body: { style: { msContentZooming: string } }
}
