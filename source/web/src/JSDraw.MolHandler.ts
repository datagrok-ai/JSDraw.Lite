import type {JSDraw2ModuleType} from './types/jsdraw2';
import type {ScilModuleType} from './types';

import type {IMolHandler, MolHandlerOptions} from './types/mol-handler';

import {defaultMolHandlerOptions} from './types/mol-handler';
import {Mol} from './Mol';

declare const JSDraw2: JSDraw2ModuleType;
declare const scil: ScilModuleType;

export class MolHandler<TBio> implements IMolHandler<TBio> {
  public readonly T: string;
  private readonly options: MolHandlerOptions;

  public readonly bondlength: number;
  public readonly m: Mol<TBio>;

  constructor(options?: MolHandlerOptions) {
    this.T = 'MOLHANDLER';
    this.options = JSON.parse(JSON.stringify(defaultMolHandlerOptions));
    this.options = Object.assign(this.options, options ?? {});

    this.bondlength = JSDraw2.Editor.BONDLENGTH;
    this.m = new JSDraw2.Mol(this.options.showimplicithydrogens);
  }
}

JSDraw2.MolHandler = MolHandler;
