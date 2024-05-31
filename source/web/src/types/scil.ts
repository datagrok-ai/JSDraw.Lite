export type IndexType = { prefix: string, index: number | null };

export interface IDebug {
  enable: boolean;
  clear(): void;
  print(s: string): void;
}

interface IScilUtils {
  alert: (s: string) => void; // to override
  get isOpera(): boolean;
  areListEq<T>(list1: T[], list2: T[]): boolean;
  isNullOrEmpty(s: string): boolean;

  eval(expression: string): any | null;

  json2str(v: {}, readable: boolean, restrict: boolean): string;
  arrayContainsArray<T = any>(superset: T[], subset: T[]): boolean;
  array2str(list: string[], sep: string | null): string;
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

  getFirstElement(parent: HTMLElement, tagName: string): HTMLElement;
  getElements(parent: HTMLElement, tagName: string): HTMLElement[];
}

export type ScilModuleType = {
  apply<T>(dest: T, atts: Partial<T>, defaults?: Partial<T>): void;
  Utils: IScilUtils;

  _base: any;
  extend(base: any, obj: any): any;

  clone<T>(src: T): T;
}

