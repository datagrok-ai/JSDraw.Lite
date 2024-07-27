import type {DojoType, DojoWindow} from './types/dojo';
import type {JSDraw2Window} from './types';
import {errInfo, timeout} from './dg-utils/index';

declare const window: Window & DojoWindow & JSDraw2Window;
declare const dojo: DojoType;

export async function initJsDrawLite(): Promise<void> {
  const logPrefix: string = 'JSDrawLite: _package.initJsDrawLite()';
  console.debug(`${logPrefix}, start`);
  window.jsDraw2$ = window.jsDraw2$ || {};
  if (!window.jsDraw2$.initPromise) {
    window.jsDraw2$.initPromise = (async () => {
      console.debug(`${logPrefix}, IN`);

      // console.debug(`${logPrefix}, dojo.ready(), before`);
      // await timeout<void>(new Promise<void>((resolve, reject) => {
      //   try {
      //     if (window.dojo.config.afterOnLoad) {
      //       console.debug(`${logPrefix}, dojo.config.afterOnLoad already`);
      //       resolve();
      //     }
      //
      //     dojo.require('dojo/ready')(() => {
      //       console.debug(`${logPrefix}, dojo.ready(), callback`);
      //       resolve();
      //     });
      //   } catch (err: any) {
      //     reject(err);
      //   }
      // }), 20000, 'dojo.ready() callback timeout 20000 ms');

      console.debug(`${logPrefix}, loadModules(), before`);
      await loadModules();
      console.debug(`${logPrefix}, loadModules(), after`);

      console.debug(`${logPrefix}, OUT`);
    })();
  }

  console.debug(`${logPrefix}, end`);
  return window.jsDraw2$.initPromise;
}

async function loadModules(): Promise<void> {
  const logPrefix: string = 'JSDrawLite: _package.loadModules()';
  console.debug(`${logPrefix}, start`);

  // Based on _merge.lite.bat
  require('./Core.js'); // defines window.scilligence (scil)
  require('./Utils.js');
  require('./JSDraw.Core.js');
  require('./JSDraw.Lite.js');
  require('./PT.Lite.js');

  await import(/* webpackMode: "eager" */ './Atom');
  require('./BA.js');
  require('./Base64.js');
  await import(/* webpackMode: "eager" */ './Bond');
  require('./JSDrawIO.js');
  await import(/* webpackMode: "eager" */ './Mol');
  await import(/* webpackMode: "eager" */ './Point');
  await import(/* webpackMode: "eager" */ './Rect');
  require('./Stack.js');
  require('./SuperAtoms.js');
  require('./FormulaParser.js');
  require('./Toolbar.js');
  require('./Lasso.js');
  await import(/* webpackMode: "eager" */ './Drawer');
  require('./Language.js');
  require('./IDGenerator.js');
  require('./Skin.js');
  await import(/* webpackMode: "eager" */ './JSDraw.Editor');
  await import(/* webpackMode: "eager" */ './JSDraw.MolHandler');
  require('./JSDraw.Table.js');
  await import(/* webpackMode: "eager" */ './Bracket'); // File not found
  require('./Group.js');
  require('./Text.js');

  await import(/* webpackMode: "eager" */ '../form/Lang');
  require('../form/Menu.js');
  require('../form/ContextMenu.js');
  require('../form/Dialog.js');
  await import(/* webpackMode: "eager" */ '../form/Form');
  require('../form/AutoComplete.js');
  require('../form/Progress.js');
  require('../form/Table.js');
  require('../form/Tree.js');
  require('../form/DropdownInput.js');
  require('../form/Popup.js');
  require('../form/UploadFile.js');
  await import(/* webpackMode: "eager" */ '../form/Tab');
  await import(/* webpackMode: "eager" */ '../form/TabbedForm');
  require('../form/FieldNumber.js');
  require('../form/Chart.js');
  require('../form/Clipboard.js');
  require('../form/Accordion.js');
  require('../form/DnD.js');
  require('../form/Resizable.js');
  require('../form/Favorite.js');
  require('../form/DropdownButton.js');
  require('../form/App.Lite.js');

  await import(/* webpackMode: "eager" */ '../page/Page');
  await import(/* webpackMode: "eager" */ '../page/Page.Custom');
  await import(/* webpackMode: "eager" */ '../page/Page.Explorer');
  await import(/* webpackMode: "eager" */ '../page/Page.ExplorerForm');
  await import(/* webpackMode: "eager" */ '../page/Page.Form');
  await import(/* webpackMode: "eager" */ '../page/Page.Tab');
  await import(/* webpackMode: "eager" */ '../page/Page.Table');
  await import(/* webpackMode: "eager" */ '../page/Page.Tree');

  require('../Scilligence.JSDraw2.Resources.js');

  console.debug(`${logPrefix}, end`);
}

// //name: ensureLoadJsDrawLite
// export async function ensureLoadJsDrawLite(): Promise<void> {
//   _package.logger.debug(`Package '${_package.friendlyName}' ensure load.`);
// }

window.jsDraw2$ = window.jsDraw2$ || {};
window.jsDraw2$.initPromise = (async () => {
  await initJsDrawLite();
})();
