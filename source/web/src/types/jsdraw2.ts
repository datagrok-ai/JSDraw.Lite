import type {IMolHandler} from './mol-handler';
import type {Plus, Point} from '../Point';
import type {Text} from '../Text';
import type {Editor} from '../JSDraw.Editor';
import type {Atom} from '../Atom';
import type {Rect} from '../Rect';
import type {Bond, BondB} from '../Bond';
import type {Mol} from '../Mol';
import type {Bracket} from '../Bracket';
import type {Drawer} from '../Drawer';
import type {Group} from '../Group';
import type {Lasso} from '../Lasso';

import {MolHandler} from '../JSDraw.MolHandler';
import {SuperAtoms} from '../SuperAtoms';

export const enum DrawSteps {
  highlight,
  select,
  main
}

export type DrawStep = typeof DrawSteps[keyof typeof DrawSteps];

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

export type BondType = typeof BondTypes[keyof typeof BondTypes];

export const enum RxnCenterTypes {
  NOTCENTER = -1,
  CENTER = 1,
  BREAK = 4,
  CHANGE = 8,
  BREAKANDCHANGE = 12
}

export type RxnCenterType = typeof RxnCenterTypes[keyof typeof RxnCenterTypes];

export const MoleculeTypes = ["SmallMolecule", "Polymer", "Peptide", "DNA", "RNA", "ADC", "ChemicalReagent"];

export const TextKeywords = ["°C", "rt", "reflux", "hr", "min", "sec", "psi", "atm", "overnight", "microwave", "Δ"];

// export type BondType = `${BondTypes}`;

const AlignTypes = new class {
  RIGHT = 0;
  BOTTOM = 1;
  LEFT = 2;
  TOP = 3;
}();

export enum TextAligns {
  left = 'left',
  right = 'right',
}

export type TextAlign = typeof TextAligns[keyof typeof TextAligns];

const AntibodyTypes = new class {
  IgG = 'IgG';
  Fab = 'Fab';
  ScFv = 'ScFv';
}();

const BioTypes = new class {
  AA: BioType = 'AA';
  //BASE: 'BASE';
  ANTIBODY: BioType = 'ANTIBODY';
  PROTEIN: BioType = 'PROTEIN';
  GENE: BioType = 'GENE';
  DNA: BioType = 'DNA';
  RNA: BioType = 'RNA';
  BASE_DNA = 'BASEDNA';
  BASE_RNA = 'BASERNA';
}();

export type BioType = keyof typeof BioTypes;

export enum ShapeTypes {
  LINE = 'line',
  RECT = 'rect',
  CIRCLE = 'circle',
  SQUARE = 'square',
  ELLIPSE = 'ellipse',
  POLYGON = 'polygon'
}

export enum CommandTypes {
  ABOUT = 'about',
  JSDRAW = 'jsdraw',
  INKCLEARALL = 'inkclearall'
}

export type ShapeType = typeof ShapeTypes[keyof typeof ShapeTypes];

export interface IObjWithId {
  id?: number | null;
}

export interface ICast<T> {
  cast(obj: any): T;
}

export interface IGraphics {
  readonly T: string;
  color: string | null;
  // atoms: Atom<any>[];
  // _parent: Mol<any>;
  // anchors: any[];
  // froms: any[];

  // a: any; // TODO
  // group: any; // TODO
  // reject: any; // TODO // Shape specific
  selected?: boolean;
  id: number;
  graphicsid?: number;
  rect(): Rect;
  clone(map: any[]): IGraphics;
  draw(surface: any, m: any, drawOpts: IDrawOptions, drawStep?: number): void;

  [p: string]: any;
}

export type ColorArray = [number, number, number, number];

export interface IOrgPlugin<TBio, TDrawOptions extends IDrawOptions> {
  get jsd(): Editor<TBio, TDrawOptions>;

  new(jsd: IMolHandler<TBio>): IOrgPlugin<TBio, TDrawOptions>;

  setHelmBlobType(a: Atom<TBio>, type: string): void;

  setHelm(s: string): void;

  getSequence(highlightselection: boolean): string;

  // [p: string]: any;
}

export interface IDrawOptions {
  linewidth: number;
  fontsize: number;
}

export interface IEditorOptions<TDrawOptions extends IDrawOptions> {
  drawOptions: Partial<TDrawOptions>;

  usexdraw: boolean;
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
  abbreviations: string;
  helmtoolbar: boolean;

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

  popup: boolean | null;
  appmode: any;
  btnsize: number;
  movingresolution: any;
}

// export interface IEditor<TBio> extends IMolHandler<TBio> {
//   BONDLENGTH: number;
//   ANGLESTOP: number;
//   LINEWIDTH: number;
//   TOR: number;
//   FONTSIZE: number;
//
//   COLORCURRENT: ColorArrayType;
//   COLORSELECTED: ColorArrayType;
//
//   dblclickdelay: number;
//   helm: IOrgPlugin<TBio>;
//
//   _id: number | null;
//   _allitems: {};
//
//   undoGestureTime: number;
//
//   get options(): IEditorOptions;
//
//   get div(): HTMLDivElement;
//
//   get m(): IMol<TBio>;
//
//   about: any | null;
//   jsd: any | null;
//   periodictable: any | null;
//   popupdlg: any | null;
//   openfiledlg: any | null;
//   savefiledlg: any | null;
//
//   new(host: HTMLElement, options?: Partial<IEditorOptions>): IEditor<TBio>;
//
//   initNoDelay(): void;
//   destroy(): void;
//   setSize(w: number, h: number): void;
//   resize(width: number, height: number): void;
//
//   /** Clear all contents */ clear(redraw: boolean, fireevents: boolean): void;
//   /** Resets and clears undo and redo buffers */ reset(): void;
//   setData(data: string, format: string): void;
//   setHelm(helm: string): void;
//
//   getClipboard(): IMol<TBio>;
//   setClipboard(m: IMol<TBio>, bondlength: number): void;
//
//   getMolfile(): string;
//   setMolfile(m: IMol<TBio>): void;
//
//   getFormula(b: boolean): string;
//   getMolWeight(): number;
//   getExtinctionCoefficient(): number;
//
//   showPopup(title: string, btnText: string, btnFn: Function, value?: any, zindex?: number): any;
//   showAbout(): void;
//
//   get(id: string): IEditor<TBio>;
//   onPT(elem: HTMLElement): void;
//   onSaveFile(): void;
//
//   [p: string]: any;
// }

export type IShape = any;

// export interface IRect {
//   left: number;
//   top: number;
//   width: number;
//   height: number;
//
//   new(left: number, top: number, width: number, height: number): IRect;
//   new(): IRect;
//
//   contains(p: Point): boolean;
//   right(): number;
//   bottom(): number;
//   center(): Point;
//
//   set(p1: Point, p2: Point): IRect;
//
//   offset(dx: number, dy: number): IRect;
//   union(r: IRect): IRect;
// }

export interface IStack<T = any> {
  new<T = any>(length?: number): IStack<T>;
  push(item: T): void;
  pop(): T | null;
  popHead(): T | null;

  clear(): void;
}

export interface IPistoiaBase {
  get T(): string;
}

export interface IBio<TBio> {
  id?: number | string | null;
  continuousId?: number | string | null;

  type: TBio;
  subtype?: string | null;
  blobtype?: string | null;

  ambiguity?: string | null;
  annotation?: string | null;
  annotationshowright?: boolean | null;

  sequences?: string | null;
}

export interface IJsAtom<TBio> extends IPistoiaBase {
  get T(): 'ATOM';

  p: Point;

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

export interface IRxn {
  [p: string]: any;
}

export type AtomQueryType = {
  t?: boolean;
  sub?: number | '*';
  uns?: boolean | null;
  rbc?: number | null;
  als?: string[] | null;
  v?: number;
};

// export interface IAtom<TBio = any> extends IJsAtom<TBio> {
//   elem: string;
//   charge: number;
//   isotope: string;
//   radical: string;
//   hcount: number;
//   id: number;
//   color: string;
//   tag: string;
//   alias: string;
//   superatom: IMol<TBio>;//ISuperAtoms<TBio> | null;
//   attachpoints: any[];
//   atommapid: number;
//   rgroup: IRGroup<TBio>;
//   hasError: boolean;
//   hs: number;
//   val: any;
//   query: any;
//   locked: boolean;
//   hidden: boolean;
//   ratio: number;
//   selected: boolean;
//   f: number;
//
//   group: AtomGroupType;
//
//   _aaid: number | null;
//   _parent: IMol<TBio>;
//   _helmgroup: any;
//
//   new(p: Point, elem?: string, bio?: IBio<TBio>): IAtom<TBio>;
//   //constructor(p: IPoint, elem: string, bio?: IBio<TBio>): IAtom<TBio>;
//
//   biotype(): TBio;
//   cast(obj: any): IAtom<TBio>;
//   getLabel(): string;
//   drawAlias(...args: any[]): void;
//   isValidChiral(c: string): boolean;
//   isStereo(c: string): boolean;
//   match(x: IAtom<TBio>, y: IAtom<TBio>): boolean;
//   match2(e1: string, e2: string): boolean;
// }

// export interface IBond<TBio = any> extends ICast<IBond<TBio>> {
//   get a1(): Atom<TBio>;
//   get a2(): Atom<TBio>;
//
//   apo1: number;
//   apo2: number;
//
//   ratio1: number;
//   ratio2: number;
//
//   ring: boolean;
//   selected: boolean;
//   type: number;
//   tag: string;
//   f: number;
//
//   _parent: IMol<TBio>;
//
//   new(a1: Atom<TBio>, a2: Atom<TBio>, bt?: BondTypes): IBond<TBio>;
//
//   isBio(): boolean;
//   angle(): number;
//   bondLength(): number;
//
//   reverse(): void;
// }

export interface IRGroup<TBio = any> extends ICast<IRGroup<TBio>> {
  color: string | null;
  selected: boolean;
  id: number;
  position: Point;
  mols: Mol<TBio>[];
  text: string;

  new(): IRGroup<TBio>;

  readHtml(t: HTMLElement, v: any): any;
  html(scale: number): string;
  clone(selectedOnly?: boolean | null): IRGroup<TBio>;

  [p: string]: any;
}

export type SruGenType = 'SRU' | 'GEN' | 'MUL';

export interface ISGroup {
  fieldtypes: any[];
  stys: SruGenType[];

  getDisplayTypes(): any;
}

export interface ISuperAtoms<TBio> {
  addToMol(m: Mol<TBio>, a: Atom<TBio>, superatom: Mol<TBio>): void;
  get(name: string): any | null;
  guessOne(name: string): any | null;

  collapseRepeat(m: Mol<TBio>, br: Bracket<TBio>): void;
  expandRepeat(m: Mol<TBio>, br: Bracket<TBio>): void;

  _getFirstAttachAtom(m: any): any;
  _alignMol(dest: Mol<TBio>, a: Atom<TBio>, src: Mol<TBio>, a0: Atom<TBio>, len?: number): boolean;

  getAA(name: string): Mol<TBio>;
  getRNA(name: string): Mol<TBio>;
  getDNA(name: string): Mol<TBio>;
  [p: string]: any;
}

export interface ISpeedup {
  fontsize: number,
  gap: number,
  disableundo: boolean;
  minbondlength: number;
}

export type IContextMenu = any;

export type IDialog = any;

export interface IElement {
  /** Mass */ m: number;
}

export interface IPeriodicTable {
  [elem: string]: IElement | any;

  isValidAtomList(s: string): boolean;
}

export type JSDraw2ModuleType = {
  password: any;

  defaultoptions: Partial<IEditorOptions<IDrawOptions>>;
  version: string;

  abbreviations: string;

  __touchmolapp: boolean;
  __currentactived: any;


  speedup: ISpeedup;

  ALIGN: typeof AlignTypes;
  ANTIBODY: typeof AntibodyTypes;
  BIO: typeof BioTypes;
  BONDTYPES: typeof BondTypes;
  RXNCENTER: typeof RxnCenterTypes;
  MOLECULETYPES: typeof MoleculeTypes;
  TEXTKEYWORDS: typeof TextKeywords;

  Atom: typeof Atom;
  Bond: typeof Bond;
  BondB: typeof BondB; // TODO: Hide
  Bracket: typeof Bracket;
  Drawer: Drawer;

  Editor: typeof Editor;
  MolHandler: typeof MolHandler;

  Formulation: any;
  Group: typeof Group;
  Mol: typeof Mol;
  Point: typeof Point;
  Rect: typeof Rect;
  Plate: any;
  Plates: any;
  Plus: typeof Plus;
  Shape: any;
  Text: typeof Text;
  SequenceEditor: any;
  Lasso: typeof Lasso;
  Skin: any;
  Security: any;

  AssayCurve: any;
  Spectrum: any;
  Stack: IStack;
  PT: IPeriodicTable;
  TLC: any;
  Base64: any;
  JSDrawIO: any;
  Symbol: any;
  Table: any;

  RGroup: IRGroup;
  SGroup: ISGroup;
  SuperAtoms: SuperAtoms;

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
  ContextMenu: IContextMenu;
  Dialog: IDialog;
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
