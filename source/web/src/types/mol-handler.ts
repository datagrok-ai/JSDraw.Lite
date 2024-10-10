import type {Mol} from '../Mol';
import type {IEditorOptions} from './jsdraw2';

export const defaultMolHandlerOptions = new class {
  showimplicithydrogens: boolean = true;
};

export type MolHandlerOptions = typeof defaultMolHandlerOptions;

/** Molecular handler for parser plugin. */
export interface IMolHandler<TBio, TEditorOptions extends IEditorOptions> {
  get bondlength(): number;
  get m(): Mol<TBio>;
  get options(): Partial<TEditorOptions>;
}
