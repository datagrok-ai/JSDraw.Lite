import {IAtom, IEditor, IOrgPlugin, IPoint} from './jsdraw2';

export const enum MonomerTypes {
  BACKBONE = 'Backbone',
  BRANCH = 'Branch',
  TERMINAL = 'Terminal',
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
  id: string;
}

export interface IOrgWebEditorMonomer extends IOrgMonomer {
  /** symbol */ id: string;
  /** name */ n?: string;
  /** natural analog */ na?: string;
  /* Pistoia.HELM deletes .type and .mt in Monomers.addOneMonomer() */
  /** polymer type */type?: PolymerType;
  /** monomer type */ mt?: MonomerType;
  /** molfile */ m?: string;
  /** substituents */ at: WebEditorRGroups;
  /** number of substituents */ get rs(): number;

  issmiles?: boolean;
  smiles?: string;
}

export type MonomerSetType = { [key: string]: IOrgWebEditorMonomer };

export interface IOrgMonomers<TBio> {
  getMonomer(a: IAtom<TBio> | TBio, elem?: string): IOrgWebEditorMonomer | null;
  getMonomerSet(biotype: string): MonomerSetType;
  getMonomerList(a: IAtom<TBio> | TBio): any;
}

export interface IOrgInterface {
  drawMonomer(surface: SVGSVGElement, a: IAtom, p: IPoint, fontsize: number, linewidth: number, color: string): void;
  onContextMenu<TBio = any>(ed: IEditor<TBio>, e: Event, viewonly: boolean): any[];
}

/** scil.helm */
export type IOrgWebEditor<TBio> = {
  HELM: typeof HelmTypes;
  Interface: IOrgInterface;
  Monomers: IOrgMonomers<TBio>;
  Plugin: IOrgPlugin<TBio>;
  MolViewer: any;
  MonomerExplorer: any;

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
