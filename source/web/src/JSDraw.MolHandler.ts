import {IMol, JSDraw2ModuleType} from './types/jsdraw2';
import {IParserMolHandler, MolHandlerOptions, defaultMolHandlerOptions} from './types/parser-mol-handler';
import {ScilModuleType} from './types';

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
