import type {Mol} from '../Mol';
import type {IBio, IEditorOptions} from './jsdraw2';

export const defaultMolHandlerOptions = new class {
  showimplicithydrogens: boolean = true;
};

export type MolHandlerOptions = typeof defaultMolHandlerOptions;

/** Molecular handler for parser plugin. */
export interface IMolHandler<TBio, TBioType extends IBio<TBio>, TEditorOptions extends IEditorOptions> {
  get bondlength(): number;
  get m(): Mol<TBio, TBioType>;
  get options(): Partial<TEditorOptions>;
}
