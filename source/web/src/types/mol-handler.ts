import {Mol} from '../Mol';

export const defaultMolHandlerOptions = new class {
  showimplicithydrogens: boolean = true;
};

export type MolHandlerOptions = typeof defaultMolHandlerOptions;

/** Molecular handler for parser plugin. */
export interface IMolHandler<TBio> {
  bondlength: number;
  m: Mol<TBio>;

  new(): IMolHandler<TBio>;
}
