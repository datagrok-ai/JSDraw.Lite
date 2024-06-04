export type DojoConfigType = {
  afterOnLoad: boolean;
}
export type DojoType = {
  config: DojoConfigType;

  clone<T>(src: T): T;
  require(id: string): (callback: () => void) => void;
}

export type DojoxMatrixType = {
  rotategAt(deg: number, x: number, y: number): any;
  translate(shiftX: number, shiftY?: number, shiftZ?: number): any;
}

export type DojoxGfxType = {
  matrix: DojoxMatrixType;
};

export type DojoxType = {
  gfx: DojoxGfxType;
}

export type DojoWindow = {
  dojo: DojoType;
  dojox: DojoxType;
}
