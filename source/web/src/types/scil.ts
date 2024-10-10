import type {IOrgWebEditor} from './org';
import type {Page} from '../../page/Page';
import type {Point} from '../Point';
import type {Rect} from '../Rect';
import type {ButtonDescType, Form, LangType} from '../../form/Form';
import type {TabbedForm} from '../../form/TabbedForm';
import type {Tabs} from '../../form/Tab';
import type {Lang} from '../../form/Lang';
import type {IEditorOptions} from './jsdraw2';

export type IndexType = { prefix: string, index: number | null };

export interface IDebug {
  enable: boolean;
  clear(): void;
  print(s: string): void;
}

export interface IScilUtils {
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
  confirmYes(message: string, callback: Function, owner?: any): void;

  ajax(url: string, callback: Function, params?: any, opts?: any): void;
  beep(): void;
  eval(expression: string): any | null;

  listOptions(select: any, items: { [p: string]: string }, selected?: string | null, removeall?: boolean | null, sortitems?: boolean | null): void;
  json2str(v: any, readable?: boolean, restrict?: boolean): string;
  parseXml(s: string): any;

  areListEq<T>(list1: T[], list2: T[]): boolean;
  isNullOrEmpty(s: string | null | undefined): boolean;
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
  escXmlValue(el: object | string | null): string;

  containsWord(str: string, word: string, ignorecase: boolean): boolean;
  formatStr(value: number, width: number, d?: number): string;
  padLeft(s: string, n: number, c: string): string;
  padRight(s: string, n: number, c: string): string;
  trim(s: string): string;
  rtrim(s: string): string;
  parseIndex(s: string | null): IndexType | null;

  createCookie(name: string, value: string, days?: number, ignoreStore?: boolean): void;
  readCookie(name: string, ignoreStore?: boolean): string | null;

  createTable(parent?: HTMLElement, cellspacing?: number, cellpadding?: number, styles?: Partial<CSSStyleDeclaration> | null, border?: string): HTMLTableElement;
  createElement(parent: HTMLElement | null, tag: string, html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLElement;
  createElement(parent: HTMLElement | null, tag: 'div', html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLDivElement;
  createElement(parent: HTMLElement | null, tag: 'input', html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLInputElement;
  createElement(parent: HTMLElement | null, tag: 'select', html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLSelectElement;
  createElement(parent: HTMLElement | null, tag: 'tr', html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLTableRowElement;
  createElement(parent: HTMLElement | null, tag: 'td', html?: string | null, styles?: Partial<CSSStyleDeclaration> | null, attributes?: any, onclick?: Function): HTMLTableCellElement;
  isAttTrue(e: HTMLElement, att: string): boolean;
  isAttFalse(e: HTMLElement, att: string): boolean;
  getInnerText(e: Element): string;
  getFirstElement(parent: HTMLElement, tagName?: string): HTMLElement;
  getElements(parent: HTMLElement, tagName: string): HTMLElement[];

  getTopWindow(): Window;
  getScreenSize(win: Window): { w: number, h: number };
  getOffset(e: HTMLElement, scroll: boolean): Point;
  hasAnsestor(obj: Node, parent: Node): boolean;
  scrollOffset(): Point;
  getZindex(e: HTMLElement): number;
  getMaxZindex(): number;
  getParent(obj: HTMLElement | null, tag: string): HTMLElement | null;
  styleRect(e: HTMLElement): Rect;
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

  createButton(parent: HTMLElement, button: Partial<ButtonDescType>, lang?: LangType): HTMLElement;

  [p: string]: any;
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

export type ITable = any;

export type ITree = any;

export type ScilModuleType = {
  eln: any;
  DnD: IDnD;
  DnDFile: any;
  Favorite: IFavorite;

  apply<T>(dest: T, atts: Partial<T>, defaults?: Partial<T>): T;
  Utils: IScilUtils;

  App: any;
  AutoComplete: any;
  Clipboard: any;
  ColorPicker2: any;
  ContextMenu: any;
  DatePicker: any;
  Dialog: any;
  DropdownInput: any;
  DropdownCheck: any;
  EditableSelect: any;
  FieldCode: any;
  FieldCurve: any;
  FieldFile: any;
  FieldFileLink: any;
  FieldImage: any;
  FieldNumber: any;
  FieldPlainText: any;
  FieldRichText: any;
  FieldSketches: any;
  FieldSubform: any;
  FieldTabText: any;
  FieldSignature: any;
  FileShelf: any;
  Page: typeof Page;
  Form: typeof Form;
  Richtext: any;
  TabbedForm: typeof TabbedForm;
  Table: ITable;
  Tabs: typeof Tabs;
  Tree: ITree;
  XDraw: any;
  Resizable: any;
  Lang: typeof Lang;
  MobileData: any;

  mstouch: any;
  helm: IOrgWebEditor<any, IEditorOptions>;

  _base: any;
  //extend<T>(base: any, obj: T): T;
  extend(base: any, obj: any): any;

  byId(id: string): HTMLElement;
  clone<T>(src: T): T;
  connect(node: Node | Window, event: string, callback: Function): any;
  onload(handler: Function): void;
  ready(handler: Function): void;
}
