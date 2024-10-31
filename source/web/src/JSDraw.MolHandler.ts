import type {IBio, IDrawOptions, IEditorOptions, JSDraw2ModuleType} from './types/jsdraw2';
import type {ScilModuleType} from './types';

import type {IMolHandler, MolHandlerOptions} from './types/mol-handler';

import {defaultMolHandlerOptions} from './types/mol-handler';
import {Mol} from './Mol';
import type {OrgType} from './types/org';

declare const JSDraw2: JSDraw2ModuleType;
declare const scil: ScilModuleType;
declare const org: OrgType<any, IBio<any>, IEditorOptions>;

export class MolHandler<TBio, TBioType extends IBio<TBio>, TEditorOptions extends IEditorOptions>
  implements IMolHandler<TBio, TBioType, TEditorOptions> {
  public readonly T: string;


  public readonly bondlength: number;
  public readonly m: Mol<TBio, TBioType>;
  public readonly options: Partial<TEditorOptions>;

  constructor(options?: MolHandlerOptions) {
    this.T = 'MOLHANDLER';
    this.options = JSON.parse(JSON.stringify(defaultMolHandlerOptions));
    this.options = Object.assign(this.options, options ?? {});

    this.bondlength = JSDraw2.Editor.BONDLENGTH;
    this.m = new JSDraw2.Mol(this.options.showimplicithydrogens);
  }
}

JSDraw2.MolHandler = MolHandler;
