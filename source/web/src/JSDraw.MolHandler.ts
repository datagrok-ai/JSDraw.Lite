// @ts-nocheck

import type {JSDraw2ModuleType} from './types/jsdraw2';
import type {ScilModuleType} from './types';

import type {MolHandlerOptions} from './types/mol-handler';

import {defaultMolHandlerOptions} from './types/mol-handler';

declare const JSDraw2: JSDraw2ModuleType<any>;
declare const scil: ScilModuleType;

JSDraw2.MolHandler = scil.extend(scil._base, {
  constructor: function(options?: MolHandlerOptions) {
    this.T = 'MOLHANDLER';
    this.options = JSON.parse(JSON.stringify(defaultMolHandlerOptions));
    this.options = Object.assign(this.options, options ?? {});

    this.bondlength = JSDraw2.Editor.BONDLENGTH;
    this.m = new JSDraw2.Mol(this.options.showimplicithydrogens);
  }
});
