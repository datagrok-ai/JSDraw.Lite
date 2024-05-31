export type DojoType = {
  clone<T>(src: T): T;
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
