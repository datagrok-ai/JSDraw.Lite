import {errInfo, timeout} from './dg-utils/index';
import {JSDraw2Window} from './types';
import {DojoType, DojoWindow} from './types/dojo';

declare const window: Window & DojoWindow & JSDraw2Window;
declare const dojo: DojoType;

export async function initJsDrawLite(): Promise<void> {
  const logPrefix: string = 'JSDrawLite: _package.initJsDrawLite()';
  console.debug(`${logPrefix}, start`);
  window.jsDraw2$ = window.jsDraw2$ || {};
  if (!window.jsDraw2$.initPromise) {
    window.jsDraw2$.initPromise = (async () => {
      console.debug(`${logPrefix}, IN`);

      console.debug(`${logPrefix}, dojo.ready(), before`);
      await timeout<void>(new Promise<void>((resolve, reject) => {
        try {
          if (window.dojo.config.afterOnLoad) {
            console.debug(`${logPrefix}, dojo.config.afterOnLoad already`);
            resolve();
          }

          dojo.require('dojo/ready')(() => {
            console.debug(`${logPrefix}, dojo.ready(), callback`);
            resolve();
          });
        } catch (err: any) {
          reject(err);
        }
      }), 5000, 'dojo.ready() callback timeout 5000 ms');

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
  // Based on _merge.lite.bat
  require('./Core.js'); // defines window.scilligence (scil)
  require('./Utils.js');
  require('./JSDraw.Core.js');
  require('./JSDraw.Lite.js');
  require('./PT.Lite.js');

  await import(/* webpackMode: "eager" */ './Atom');
  require('./BA.js');
  require('./Base64.js');
  require('./Bond.js');
  require('./JSDrawIO.js');
  await import(/* webpackMode: "eager" */ './Mol');
  require('./Point.js');
  require('./Rect.js');
  require('./Stack.js');
  require('./SuperAtoms.js');
  require('./FormulaParser.js');
  require('./Toolbar.js');
  require('./Lasso.js');
  require('./Drawer.js');
  require('./Language.js');
  require('./IDGenerator.js');
  require('./Skin.js');
  await import(/* webpackMode: "eager" */ './JSDraw.Editor');
  await import(/* webpackMode: "eager" */ './JSDraw.MolHandler');
  require('./JSDraw.Table.js');
  await import(/* webpackMode: "eager" */ './Bracket'); // File not found
  require('./Group.js');
  require('./Text.js');

  require('../form/Lang.js');
  require('../form/Menu.js');
  require('../form/ContextMenu.js');
  require('../form/Dialog.js');
  require('../form/Form.js');
  require('../form/AutoComplete.js');
  require('../form/Progress.js');
  require('../form/Table.js');
  require('../form/Tree.js');
  require('../form/DropdownInput.js');
  require('../form/Popup.js');
  require('../form/UploadFile.js');
  require('../form/Tab.js');
  require('../form/TabbedForm.js');
  require('../form/FieldNumber.js');
  require('../form/Chart.js');
  require('../form/Clipboard.js');
  require('../form/Accordion.js');
  require('../form/DnD.js');
  require('../form/Resizable.js');
  require('../form/Favorite.js');
  require('../form/DropdownButton.js');
  require('../form/App.Lite.js');

  require('../page/Page.js');
  require('../page/Page.Custom.js');
  require('../page/Page.Explorer.js');
  await import(/* webpackMode: "eager" */ '../page/Page.ExplorerForm');
  require('../page/Page.Form.js');
  require('../page/Page.Tab.js');
  require('../page/Page.Table.js');
  require('../page/Page.Tree.js');

  require('../Scilligence.JSDraw2.Resources.js');
}

// //name: ensureLoadJsDrawLite
// export async function ensureLoadJsDrawLite(): Promise<void> {
//   _package.logger.debug(`Package '${_package.friendlyName}' ensure load.`);
// }

window.jsDraw2$ = window.jsDraw2$ || {};
window.jsDraw2$.initPromise = (async () => {
  await initJsDrawLite();
})();
