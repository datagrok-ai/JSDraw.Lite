//////////////////////////////////////////////////////////////////////////////////
//
// Scilligence JSDraw
// Copyright (C) 2014 Scilligence Corporation
// Version 1.0.0.2013-11-06
// http://www.scilligence.com/
//
//////////////////////////////////////////////////////////////////////////////////

// @ts-nocheck

import {ScilModuleType} from '../src/types';
import {Page} from './Page';
import {Tabs} from '../form/Tab';

declare const scil: ScilModuleType;

/**
 * Page.Tab class - Page.Tab Control
 * @class scilligence.Page.Tab
 */
export class PageTab {
  private readonly T: string;
  private page: Page;
  private options: any;
  private onShowTab2: any;
  public tabs: Tabs;


  constructor(page: Page, options: any, parent: HTMLElement) {
    this.T = 'PAGE.TAB';
    this.page = page;
    this.options = options == null ? {} : options;
    this.onShowTab2 = this.options.onShowTab;

    const me = this;
    this.options.onShowTab = function(tab, old) {
      if (old != null && old.form != null)
        old.form.hide();
      if (tab.form != null)
        tab.form.show();

      if (me.onShowTab2 != null)
        me.onShowTab2(tab, old);
    };
    this.tabs = new scil.Tabs(parent, this.options);
  }

  addForm(options: any, listento?: any) {
    const td = this.tabs.addTab(options);

    const caption = options.captions;
    options.caption = null;
    td.form = scil.Page.addForm(this.page, options, listento, td.clientarea);
    options.caption = caption;

    scil.Page.setBorder(td.form.form);
    return td.form;
  }

  removeTab(key) {
    return this.tabs.removeTab(key);
  }

  findTab(key) {
    return this.tabs.findTab(key);
  }

  showTab(td) {
    this.tabs.showTab(td);
  }

  show() {
    this.tabs.show();
  }

  hide() {
    this.tabs.hide();
  }
}
