import type {IMol} from './jsdraw2';

export const defaultMolHandlerOptions = new class {
  showimplicithydrogens: boolean = true;
};

export type MolHandlerOptions = typeof defaultMolHandlerOptions;

/** Molecular handler for parser plugin. */
export interface IParserMolHandler<TBio> {
  bondlength: number;
  m: IMol<TBio>;

  new(options?: MolHandlerOptions): IParserMolHandler<TBio>;
}
