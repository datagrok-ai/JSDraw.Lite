import {ScilModuleType} from './scil';
import {JSDraw2ModuleType} from './jsdraw2';

export {ScilModuleType, JSDraw2ModuleType};

export type JSDraw2Window = {
  jsDraw2$: {
    initPromise?: Promise<void>;
  },
  scil: ScilModuleType;
  JSDraw2: JSDraw2ModuleType<any>;
}
