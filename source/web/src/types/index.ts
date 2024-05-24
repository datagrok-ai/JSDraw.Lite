import * as grok from 'datagrok-api/grok';
import * as ui from 'datagrok-api/ui';
import * as DG from 'datagrok-api/dg';

import {ScilModuleType} from './scil';
import {JSDraw2ModuleType} from './jsdraw2';

export {ScilModuleType, JSDraw2ModuleType};

type JSDrawWindowType = {
  scil: ScilModuleType;
  JSDraw2: JSDraw2ModuleType<any>;
}

declare const window: JSDrawWindowType;

export async function getJSDrawModules(): Promise<JSDrawWindowType> {
  await grok.functions.call('JsDrawLite:ensureLoadJsDrawLite');
  return window;
}
