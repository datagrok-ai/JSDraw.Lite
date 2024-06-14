import {IOrgWebEditor} from './org';
import type {IPoint, IRect} from './jsdraw2';

export type IndexType = { prefix: string, index: number | null };

export interface IDebug {
  enable: boolean;
  clear(): void;
  print(s: string): void;
}

interface IScilUtils {
  buttonWidth: number;

  get isOpera(): boolean;
  get isFirefox(): boolean;
  get isIE(): number;
  get isIE8Lower(): boolean;
  get isIpad(): boolean;
  isSilverlight: boolean | null;

  get isTouch(): boolean;

  alert: (s: string) => void; // to override
  alert2(message: string, caption?: string, callback?: Function, iconurl?: string, width?: number): void;
  confirmYes(message: string, callback: Function, owner: any): void;

  ajax(url: string, callback: Function, params?: any, opts?: any): void;
  beep(): void;
  eval(expression: string): any | null;

  listOptions(select: any, items: { [p: string]: string }, selected?: string | null, removeall?: boolean, sortitems?: boolean): void;
  json2str(v: any, readable?: boolean, restrict?: boolean): string;
  parseXml(s: string): any;

  areListEq<T>(list1: T[], list2: T[]): boolean;
  isNullOrEmpty(s: string | null): boolean;
  isNumber(s: any, allowoperator?: boolean): boolean;

  arrayContainsArray<T = any>(superset: T[], subset: T[]): boolean;
  array2str(list: string[], sep: string | null): string;
  delFromArray<T = any>(list: T[], a: T): number;
  removeArrayItem<T = any>(list: T[], item: T): boolean;
  removeArrayItems<T = any>(list: T[], items: T[]): number;
  cloneArray<T>(list: T[]): T[];
  mergeArray<T>(dest: T[], src: T[]): void;

  indexOf(s: any, token: any, ignorecase?: boolean): number;
  startswith(s: string, token: string, casesensitive?: boolean): boolean;
  endswith(s: string, token: string, casesensitive?: boolean): boolean;
  escXmlValue(el: HTMLElement): string;

  containsWord(str: string, word: string, ignorecase: boolean): boolean;
  formatStr(value: number, width: number, d?: number): string;
  padLeft(s: string, n: number, c: string): string;
  padRight(s: string, n: number, c: string): string;
  trim(s: string): string;
  rtrim(s: string): string;
  parseIndex(s: string | null): IndexType | null;

  createCookie(name: string, value: string, days?: number, ignoreStore?: boolean): void;
  readCookie(name: string): string | null;

  createTable(parent?: HTMLElement, cellspacing?: number, cellpadding?: number, styles?: Partial<CSSStyleDeclaration> | null, border?: string): HTMLTableElement;
  createElement(parent: HTMLElement | null, tag: string, html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLElement;
  createElement(parent: HTMLElement | null, tag: 'div', html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLDivElement;
  createElement(parent: HTMLElement | null, tag: 'input', html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLInputElement;
  createElement(parent: HTMLElement | null, tag: 'select', html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLSelectElement;
  isAttTrue(e: HTMLElement, att: string): boolean;
  isAttFalse(e: HTMLElement, att: string): boolean;
  getInnerText(e: HTMLElement): string;
  getFirstElement(parent: HTMLElement, tagName: string): HTMLElement;
  getElements(parent: HTMLElement, tagName: string): HTMLElement[];

  getTopWindow(): Window;
  getScreenSize(win: Window): { w: number, h: number };
  getOffset(e: HTMLElement, scroll: boolean): IPoint;
  hasAnsestor(obj: Node, parent: Node): boolean;
  scrollOffset(): IPoint;
  getZindex(e: HTMLElement): number;
  getMaxZindex(): number;
  getParent(obj: HTMLElement | null, tag: string): HTMLElement | null;
  styleRect(e: HTMLElement): IRect;
  textWidth(s: string): number;

  disableContextMenu(element: HTMLElement, doc?: string): void;
  isTouchDblClick(e: TouchEvent): boolean;

  imgTag(b: string, label?: string, extra?: string): string;
  imgSrc(button: string, wrapasinurl?: boolean): string;
  download(url: string, callback: Function): void;

  serviceAvailable(): boolean;

  getFileExt(filename: string | null): string | null;
  isChemFile(ext: string): boolean;

  getDictKeys(dict: {}): string[];

  [p: string]: any;
}

export type PageTreeType = {
  caption: string;
  marginBottom: string;
  marginTop: string;
  onresizetree: Function;
  onrender: (div: HTMLDivElement) => void;
};

export type PageFormsType = {
  resizable: boolean;
  leftwidth: number;
}

export interface IPageExplorerForm {
  kHeaderStyle: any;
  kToolbarStyle: any;
  kAreaStyle: any;
  new(parent: HTMLElement, options?: any): IPageExplorerForm;
}

export interface IPage {
  ExplorerForm: IPageExplorerForm;

  new(parent: HTMLElement, tree: PageTreeType, forms: PageFormsType, middle?: any, onRefreshReceivers?: Function): IPage;
}

interface IFormOptions {
  viewonly: boolean;
  lang: string;
}

interface IForm {

  new(options?: Partial<IFormOptions> | boolean): IForm;
  [pName: string]: any;
}

export interface IFavorite {
  new(key: string, onAddFavorite?: Function): IFavorite;
}

export type DnDOptions = {
  onstartdrag: Function, oncreatecopy: Function, ondrop: Function, oncancel: Function
}

export interface IDnD {
  src: HTMLElement;
  floatingbox: HTMLDivElement | null;

  new(src: HTMLElement, options: DnDOptions): IDnD;
}

export type ScilModuleType = {
  eln: any;
  DnD: IDnD;
  DnDFile: any;
  Favorite: IFavorite;

  apply<T>(dest: T, atts: Partial<T>, defaults?: Partial<T>): void;
  Utils: IScilUtils;

  App: any;
  Clipboard: any;
  ContextMenu: any;
  Dialog: any;
  DropdownInput: any;
  Page: IPage;
  Form: IForm;
  Tabs: any;
  XDraw: any;
  Resizable: any;
  Lang: any;

  mstouch: any;
  helm: IOrgWebEditor<any>;

  _base: any;
  //extend<T>(base: any, obj: T): T;
  extend(base: any, obj: any): any;

  byId(id: string): HTMLElement;
  clone<T>(src: T): T;
  connect(node: Node | Window, event: string, callback: Function): any;
  onload(handler: Function): void;
}
