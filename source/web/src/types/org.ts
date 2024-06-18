import {Atom} from '../Atom';
import {Editor} from '../JSDraw.Editor';
import {Point} from '../Point';
import {IOrgPlugin} from './jsdraw2';

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

export const enum HelmTypes {
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
}

export type MonomerSetType = { [key: string]: IWebEditorMonomer };

export interface IOrgMonomers<TBio> {
  getMonomer(a: Atom<TBio> | TBio, elem?: string): IWebEditorMonomer | null;
  getMonomerSet(biotype: TBio): MonomerSetType;
  getMonomerList(a: Atom<TBio> | TBio): any;
  [p: string]: any;
}

export interface IOrgInterface<TBio> {
  drawMonomer(surface: SVGSVGElement, a: Atom<TBio>, p: Point, fontsize: number, linewidth: number, color: string): void;
  onContextMenu(ed: Editor<TBio>, e: Event, viewonly: boolean): any[];
}

/** scil.helm */
export type IOrgWebEditor<TBio> = {
  HELM: typeof HelmTypes;
  Interface: IOrgInterface<TBio>;
  Monomers: IOrgMonomers<TBio>;
  Plugin: IOrgPlugin<TBio>;
  MolViewer: any;
  MonomerExplorer: any;

  defaultbondratio: number;

  isHelmNode(a: any): boolean;
  symbolCase(s: string): string;

  about(): void;
}

export type OrgHelmType<TBio> = {
  webeditor: IOrgWebEditor<TBio>;
}

export type OrgType<TBio> = {
  helm: OrgHelmType<TBio>;
}
