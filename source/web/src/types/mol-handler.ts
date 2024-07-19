import type {Mol} from '../Mol';

export const defaultMolHandlerOptions = new class {
  showimplicithydrogens: boolean = true;
};

export type MolHandlerOptions = typeof defaultMolHandlerOptions;

/** Molecular handler for parser plugin. */
export interface IMolHandler<TBio> {
  get bondlength(): number;
  get m(): Mol<TBio>;
}
