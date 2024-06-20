//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw
// Copyright (C) 2014 Scilligence Corporation
// http://www.scilligence.com/
//
//////////////////////////////////////////////////////////////////////////////////

// @ts-nocheck

import type {DojoType} from '../src/types/dojo';
import type {ScilModuleType} from '../src/types';

declare const dojo: DojoType;
declare const scil: ScilModuleType;

export class PageExplorerFormInt {
  private readonly T: string;
  private options: any;
  public dom: HTMLElement;
  private root: HTMLElement;
  private title: HTMLElement;
  private table: HTMLTableElement;

  public main: HTMLElement;
  public div: HTMLDivElement;
  public host: any;
  public toolbar: HTMLElement;


  constructor(parent: HTMLElement | string, options) {
    this.T = 'PAGE.EXPLORER_FORM';
    this.options = options == null ? {} : options;

    if (typeof (parent) == 'string')
      parent = scil.byId(parent);

    const tbody = scil.Utils.createTable(parent, 0, 0, {width: '100%', background: '#fff'});
    this.dom = this.root = tbody.parentNode as HTMLElement;
    if (this.options.visible == false)
      this.root.style.display = 'none';

    if (options.caption == null) {
      tbody.parentElement/* parentNode */.style.borderTop = 'solid 1px ' + scil.Page.ExplorerForm.kHeaderStyle.background;
      this.title = null;
    } else {
      this.title = scil.Utils.createElement(scil.Utils.createElement(tbody, 'tr'), 'td', scil.Lang.res(options.caption), scil.Page.ExplorerForm.kHeaderStyle);
    }
    this.toolbar = scil.Utils.createElement(scil.Utils.createElement(tbody, 'tr'), 'td', null, scil.Page.ExplorerForm.kToolbarStyle);
    if (options.toolbarvisible == false)
      this.toolbar.style.display = 'none';
    this.toolbar.style.whiteSpace = 'nowrap'; //I#11762

    this.main = scil.Utils.createElement(scil.Utils.createElement(tbody, 'tr'), 'td', null, scil.Page.ExplorerForm.kAreaStyle);
    this.div = scil.Utils.createElement(this.main, 'div');
    this.table = tbody.parentNode as HTMLTableElement;

    scil.Form.createToolbarButtons(this.toolbar, options.buttons, options.padding);

    if (this.title != null && options.expandable != false) {
      const me = this;
      dojo.connect(this.title, 'onclick', function() {
        const f = !me.isExpanded();
        me.expand(f);
        if (me.options.onexpand != null)
          me.options.onexpand(f);
      });

      if (options.expanded == false)
        this.expand(false);
    }

    if (this.options.marginTop != null)
      this.table.style.marginTop = this.options.marginTop;
    this.table.style.marginBottom = this.options.marginBottom == null ? '25px' : this.options.marginBottom;
  }

  isVisible(): boolean {
    return scil.Utils.isAllParentVisible(this.root);
  }

  show(): void {
    if (this.isVisible())
      return;
    this.root.style.display = '';

    if (this.host != null && this.host.refresh != null && this.host.refreshneeded)
      this.host.refresh();
  }

  hide(): void {
    this.root.style.display = 'none';
  }

  collapse(): void {
    this.expand(false);
  }

  expand(f: boolean | null): void {
    if (f == null)
      f = true;
    this.toolbar.style.display = f ? '' : 'none';
    this.main.style.display = f ? '' : 'none';
    this.title.style.backgroundImage = scil.App.imgSmall(f ? 'expand.png' : 'collapse.png', true);
    this.title.style.backgroundRepeat = 'no-repeat';
    this.title.style.backgroundPosition = 'left center';

    if (this.host != null && this.host.refresh != null && this.host.refreshneeded)
      this.host.refresh();
  }

  isExpanded(): boolean {
    return this.main.style.display == '';
  }
}

export class PageExplorerForm extends PageExplorerFormInt {
  static kHeaderStyle = {background: '#88f', color: 'white', padding: '3px 10px 3px 16px', whiteSpace: 'nowrap', borderTopLeftRadius: '5px', borderTopRightRadius: '5px'};
  static kToolbarStyle = {background: '#f5f5f5', border: 'solid 1px #f5f5f5', padding: '0 5px 0 5px'};
  static kAreaStyle = {border: 'solid 1px #f5f5f5', padding: '5px'};
}

scil.Page.ExplorerForm = PageExplorerForm;
