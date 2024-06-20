//////////////////////////////////////////////////////////////////////////////////
//
// Scilligence JSDraw
// Copyright (C) 2014 Scilligence Corporation
// Version 1.0.0.2013-11-06
// http://www.scilligence.com/
//
//////////////////////////////////////////////////////////////////////////////////

// @ts-nocheck

import type {ScilModuleType} from "../src/types/scil";
import type {IPageForm, Page} from './Page';
import type {PageExplorerForm} from './Page.ExplorerForm';

declare const scil: ScilModuleType;

/**
 * Page.Custom class - Page.Custom Control
 * @class scilligence.Page.Custom
 * <pre>
 * <b>Example:</b>
 *        var tabs = this.page.addTabs();
 *        scil.pmf.Company.allForms(this, tabs, this.parenttable, true);
 *
 *        var me = this;
 *        this.dynamicform = tabs.addForm({
 *            caption: "Dynamic Form",
 *            type: "custom",
 *            onclear: function () {
 *                scil.Utils.removeAll(me.dynamicform.form.div);
 *            },
 *            onrefresh: function (from, args) {
 *                scil.Utils.removeAll(me.dynamicform.form.div);
 *                var fields = {
 *                    mass: { label: "Mass", type: "number", width: 200, unit: "g" },
 *                    name: { label: "Compound Name", type: "input", width: 200, button: { label: "Test", onclick: function () { alert(99); } } },
 *                    vendor: { label: "Vendor", type: "select", options: ["Company A", "Company B"], width: 200 }
 *                };
 *                var form = new scil.Form({ viewonly: false });
 *                form.render(me.dynamicform.form.div, fields, { immediately: true });
 *            }
 *        });
 * </pre>
 */
export class PageCustom implements IPageForm {
  private readonly T: string;
  private refreshneeded: boolean;
  protected page: any;
  private options: any;
  private receivers: any[];
  private args: any;

  public form: PageExplorerForm;

  constructor(page: Page, options: any, parent: any) {
    this.T = 'PAGE.CUSTOM';
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

    this.form = new scil.Page.ExplorerForm(parent, {expandable: options.expandable, caption: options.caption, visible: options.visible, buttons: buttons, marginBottom: options.marginBottom, expanded: this.options.expanded, onexpand: this.options.onexpand});
    this.form.host = this;
    if (this.options.oncreate != null)
      this.options.oncreate(this.form.div, this.options);
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

    if (!this.form.isVisible()) {
      this.refreshneeded = true;
      return;
    }

    this.refreshneeded = false;
    if (this.options.onrefresh != null)
      this.options.onrefresh(from, this.args, this);
  }

  clear() {
    if (this.options.onclear != null)
      this.options.onclear();
  }
}

scil.Page.Custom = PageCustom;
