import {IOrgWebEditor} from './org';

export type IndexType = { prefix: string, index: number | null };

export interface IDebug {
  enable: boolean;
  clear(): void;
  print(s: string): void;
}

interface IScilUtils {
  get isOpera(): boolean;

  alert: (s: string) => void; // to override
  beep(): void;
  eval(expression: string): any | null;

  listOptions(select: any, items: { [p: string]: string }, selected: string, removeall: boolean, sortitems: boolean): void;
  json2str(v: {}, readable: boolean, restrict: boolean): string;
  parseXml(s: string): any;

  areListEq<T>(list1: T[], list2: T[]): boolean;
  isNullOrEmpty(s: string): boolean;

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
  trim(s: string | null): string | null;
  rtrim(s: string | null): string | null;
  parseIndex(s: string | null): IndexType | null;

  getInnerText(e: HTMLElement): string;
  getFirstElement(parent: HTMLElement, tagName: string): HTMLElement;
  getElements(parent: HTMLElement, tagName: string): HTMLElement[];
  getParent(obj: HTMLElement | null, tag: string): HTMLElement | null;
}

interface IForm {
  [pName: string]: any;
}

export type ScilModuleType = {
  apply<T>(dest: T, atts: Partial<T>, defaults?: Partial<T>): void;
  Utils: IScilUtils;
  Form: IForm;

  helm: IOrgWebEditor<any>;
  _base: any;
  //extend<T>(base: any, obj: T): T;
  extend(base: any, obj: any): any;

  clone<T>(src: T): T;
}

