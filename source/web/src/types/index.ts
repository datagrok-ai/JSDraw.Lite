import {ScilModuleType} from './scil';
import {JSDraw2ModuleType} from './jsdraw2';

export {ScilModuleType, JSDraw2ModuleType};

type JSDrawWindowType = {
  scil: ScilModuleType;
  JSDraw2: JSDraw2ModuleType<any>;
}

declare const window: JSDrawWindowType;

export async function getJSDrawModules(): Promise<JSDrawWindowType> {
  return window;
}
