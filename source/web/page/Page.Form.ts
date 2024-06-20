//////////////////////////////////////////////////////////////////////////////////
//
// Scilligence JSDraw
// Copyright (C) 2014 Scilligence Corporation
// Version 1.0.0.2013-11-06
// http://www.scilligence.com/
//
//////////////////////////////////////////////////////////////////////////////////

// @ts-nocheck

import type {ScilModuleType} from '../src/types';
import type {IPageForm, Page} from './Page';
import type {PageExplorerForm} from './Page.ExplorerForm';
import type {Form} from '../form/Form';

declare const scil: ScilModuleType;

/**
 * Page.Form class - Page.Form Control
 * @class scilligence.Page.Form
 */
export class PageForm implements IPageForm {
  private T: string;
  private receivers: any[];
  private refreshneeded: boolean;
  private page: Page;
  private options: any;
  private table: Form;
  private args: any;

  public form: PageExplorerForm;

  constructor(page: Page, options: any, parent: HTMLElement) {
    this.T = 'PAGE.FORM';
    const me = this;
    this.refreshneeded = true;
    this.page = page;
    this.options = options;
    this.receivers = [];

    let buttons = [];
    if (options.norefresh == false)
      buttons.push({
        src: scil.App.imgSmall('refresh.png'), title: 'Refresh', onclick: function() {
          me.refresh();
        },
      });
    if (this.options.buttons != null)
      buttons = buttons.concat(this.options.buttons);

    if (options.viewonly == null)
      options.viewonly = true;

    this.form = new scil.Page.ExplorerForm(parent, {expandable: options.expandable, caption: options.caption, visible: options.visible, buttons: buttons, marginBottom: options.marginBottom, expanded: this.options.expanded, onexpand: this.options.onexpand});
    this.form.host = this;
    this.table = new scil.Form({alternativeforms: this.options.alternativeforms, viewonly: options.viewonly, onchange: this.options.onformchange});
    this.table.render(this.form.div, this.options.fields, {immediately: true, hidelabel: options.hidelabel});
  }

  show() {
    this.form.show();
  }

  hide() {
    this.form.hide();
  }

  refresh(from?: any, args?: any) {
    if (args != null)
      this.args = args;

    if (!this.form.isVisible() || !this.form.isExpanded()) {
      this.refreshneeded = true;
      return;
    }

    if (scil.Utils.isDictEmpty(this.args))
      return;

    const me = this;
    this.refreshneeded = false;
    let params = this.args;
    if (params == null)
      params = {};
    if (me.options.onbeforerefresh != null)
      me.options.onbeforerefresh(params);

    this.page.receiverClear(this);

    scil.Utils.ajax(this.page.url + this.options.object + '.load', function(ret) {
      if (me.options.onsetdata != null) {
        me.options.onsetdata(me.table, ret);
      } else if (me.options.savedoc && ret.doc != null && ret.doc != '') {
        me.table.setXml(ret.doc);
        me.table.setData(ret, true);
      } else {
        me.table.setData(ret);
      }
    }, params);
  }

  clear() {
    this.table.setData({});
    this.page.receiverClear(this);
  }
}

scil.Page.Form = PageForm;
