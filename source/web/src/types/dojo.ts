import type {StyleType} from './common';

export type DojoConfigType = {
  afterOnLoad: boolean;
}

export type DojoType = {
  config: DojoConfigType;

  ready(handler: Function): void;

  attr(node: HTMLElement | string, att: string, value?: any): any;
  byId(id: string): HTMLElement;
  clone<T>(src: T): T;

  connect(obj: Object | null, event: string, method: string | Function, dontFix?: boolean): any;
  disconnect(handler: any): void;

  require(id: string): (callback: () => void) => void;
  style(e: HTMLElement, style: Partial<StyleType>): string;
  hasClass(e: HTMLElement, className: string): boolean;
  removeClass(e: HTMLElement, className: string): boolean;

  [p: string]: any;
}

export interface DojoRect {
  top: number;
}

export interface DojoText {
  _rect: DojoRect;
}

export type DojoxMatrixType = {
  rotategAt(deg: number, x: number, y: number): any;
  translate(shiftX: number, shiftY?: number, shiftZ?: number): any;

  [p: string]: any;
}

export type DojoxGfxUtilsType = {
  _cleanSvg(s: string): string;
  _innerXML(node: Node): string;
}

export interface IDojoGfxSurface {

}

export type DojoxGfxType = {
  renderer: string;
  matrix: DojoxMatrixType;
  utils: DojoxGfxUtilsType;

  createSurface(e: HTMLElement, width: number, height: number): any; // TODO: Surface to draw molecule

  [p: string]: any;
};

export type DojoxType = {
  gfx: DojoxGfxType;
  storage: any;
}

export type DojoWindow = {
  dojo: DojoType;
  dojox: DojoxType;
}
