import type {Atom} from '../Atom';
import type {Editor} from '../JSDraw.Editor';
import type {Point} from '../Point';
import type {IDrawOptions, IEditorOptions, IOrgPlugin} from './jsdraw2';

export const enum MonomerTypes {
  BACKBONE = 'Backbone',
  BRANCH = 'Branch',
  TERMINAL = 'Terminal',
  UNDEFINED = 'Undefined',
}

/** 'Backbone' | 'Branch' | 'Terminal' */
export type MonomerType = `${MonomerTypes}`

export const enum PolymerTypes {
  RNA = 'RNA',
  PEPTIDE = 'PEPTIDE',
  CHEM = 'CHEM',
  BLOB = 'BLOB',
  G = 'G',
}

/** 'RNA' | 'PEPTIDE' | 'CHEM' | 'BLOB' | 'G' */
export type PolymerType = `${PolymerTypes}`

export enum HelmTypes {
  BASE = 'HELM_BASE',
  SUGAR = 'HELM_SUGAR',
  LINKER = 'HELM_LINKER',
  AA = 'HELM_AA',
  CHEM = 'HELM_CHEM',
  BLOB = 'HELM_BLOB',
  NUCLEOTIDE = 'HELM_NUCLETIDE',
}

/** 'HELM_BASE' | 'HELM_SUGAR' | 'HELM_LINKER' | 'HELM_AA' | 'HELM_CHEM' | 'HELM_BLOB' | 'HELM_NUCLETIDE' */
export type HelmType = `${HelmTypes}`

// type IHelmTypes = Record<HelmTypes, OrgHelmType>;

export type WebEditorRGroups = { [group: string]: string };

/** */
export interface IOrgMonomer {
  id?: string;
}

export interface IMonomerColors {
  linecolor?: string;
  backgroundcolor?: string;
  textcolor?: string;
  nature?: string;
}

export interface IWebEditorMonomer extends IOrgMonomer, IMonomerColors {
  /** symbol */ id?: string;
  /** name */ n?: string;
  /** natural analog */ na?: string;
  /* Pistoia.HELM deletes .type and .mt in Monomers.addOneMonomer() */
  /** polymer type */type?: PolymerType;
  /** monomer type */ mt?: MonomerType;
  /** molfile */ m?: string;
  /** molfile compressed */ mz?: any;
  /** substituents */ at?: WebEditorRGroups;
  /** number of substituents */ rs?: number;

  issmiles?: boolean;
  smiles?: string;

  name?: string;
  oldname?: string;

  /** Used by Formula */ stats?: any;
}

export type MonomerSetType = { [symbol: string]: IWebEditorMonomer };

export interface IOrgMonomers<TBio> {
  getMonomer(a: Atom<TBio> | TBio, elem?: string): IWebEditorMonomer | null;
  getMonomerSet(biotype: TBio): MonomerSetType | null;
  getMonomerList(a: Atom<TBio> | TBio): any;
  [p: string]: any;
}

export interface IOrgInterface<TBio, TDrawOptions extends IDrawOptions> {
  drawMonomer(surface: SVGSVGElement, a: Atom<TBio>, p: Point,
    drawOpts: TDrawOptions, color: string, step?: number): void;
  onContextMenu(ed: Editor<TBio, TDrawOptions>, e: Event, viewonly: boolean): any[];

  getAtomStats(m: any, atoms: any[]): any;
  molStats(m: string): any;
  getElementMass(e: string): number;
}

export interface IFormula<TBio> {

}

/** scil.helm */
export type IOrgWebEditor<TBio, TDrawOptions extends IDrawOptions> = {
  HELM: typeof HelmTypes;
  Interface: IOrgInterface<TBio, IDrawOptions>;
  Monomers: IOrgMonomers<TBio>;
  Plugin: IOrgPlugin<TBio, TDrawOptions>;
  MolViewer: any;
  MonomerExplorer: any;
  Formula: IFormula<TBio>;

  defaultbondratio: number;

  isHelmNode(a: any): boolean;
  symbolCase(s: string): string;

  about(): void;
}

export type OrgHelmType<TBio, TDrawOptions extends IDrawOptions> = {
  webeditor: IOrgWebEditor<TBio, TDrawOptions>;
}

export type OrgType<TBio, TDrawOptions extends IDrawOptions> = {
  helm: OrgHelmType<TBio, TDrawOptions>;
}
