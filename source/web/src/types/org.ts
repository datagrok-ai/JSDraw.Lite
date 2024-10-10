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

export interface IMonomer extends IOrgMonomer {
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

export type MonomerSetType = { [symbol: string]: IMonomer };

export interface IOrgMonomers<TBio> {
  getMonomer(a: Atom<TBio> | TBio, elem?: string): IMonomer | null;
  getMonomerSet(biotype: TBio): MonomerSetType | null;
  getMonomerList(a: Atom<TBio> | TBio): any;
  [p: string]: any;
}

export interface IOrgInterface<TBio, TEditorOptions extends IEditorOptions> {
  drawMonomer(surface: SVGSVGElement, a: Atom<TBio>, p: Point,
    drawOpts: IDrawOptions, color: string, step?: number): void;
  onContextMenu(ed: Editor<TBio, TEditorOptions>, e: Event, viewonly: boolean): any[];

  getAtomStats(m: any, atoms: any[]): any;
  molStats(m: string): any;
  getElementMass(e: string): number;
}

export interface IFormula<TBio> {

}

/** scil.helm */
export type IOrgWebEditor<TBio, TEditorOptions extends IEditorOptions> = {
  HELM: typeof HelmTypes;
  Interface: IOrgInterface<TBio, TEditorOptions>;
  Monomers: IOrgMonomers<TBio>;
  Plugin: IOrgPlugin<TBio, TEditorOptions>;
  MolViewer: any;
  MonomerExplorer: any;
  Formula: IFormula<TBio>;

  defaultbondratio: number;

  isHelmNode(a: any): boolean;
  symbolCase(s: string): string;

  about(): void;
}

export type OrgHelmType<TBio, TEditorOptions extends IEditorOptions> = {
  webeditor: IOrgWebEditor<TBio, TEditorOptions>;
}

export type OrgType<TBio, TEditorOptions extends IEditorOptions> = {
  helm: OrgHelmType<TBio, TEditorOptions>;
}
