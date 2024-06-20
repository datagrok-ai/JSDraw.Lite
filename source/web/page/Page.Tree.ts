﻿//////////////////////////////////////////////////////////////////////////////////
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
import type {ITree} from '../src/types/scil';
import type {IFormDialog} from '../src/types/scil.form';

declare const scil: ScilModuleType;

/**
 * Page.Tree class - Page.Tree Control
 * @class scilligence.Page.Tree
 * <pre>
 * <b>Example:</b>
 *    &lt;div id='parent'&gt;&lt;/div&gt;
 *    &lt;script type="text/javascript"&gt;
 *        scil.ready(function () {
 *            var root = { name: "Root", icon: "", expanded: true, children: [{ name: "Child", icon: "", leaf: true }, { name: "Child 2", icon: "", leaf: false } ] };
 *            var tree = new scil.Tree(scil.byId("parent"));
 *            tree.clear();
 *            tree.add(null, root);
 *        });
 *    &lt;/script&gt;
 * </pre>
 */
export class PageTree implements IPageForm {
  private readonly T: string;
  private refreshneeded: boolean;
  private page: Page;
  private options: any;
  private receivers: any[];
  private tree: ITree;
  private args: any;
  private dlg: IFormDialog;

  public form: PageExplorerForm;

  constructor(page: Page, options: any, parent: HTMLElement) {
    this.T = 'PAGE.TREE';
    var me = this;
    this.refreshneeded = true;
    this.page = page;
    this.options = options == null ? {} : options;
    this.receivers = [];

    var buttons = [];
    if (this.options.onrender == null) {
      buttons.push({
        src: scil.App.imgSmall('refresh.png'), title: 'Refresh', onclick: function() {
          me.refresh();
        },
      });
      if (this.options.fields != null) {
        buttons.push('-', {
          src: scil.App.imgSmall('add.png'), title: 'New', onclick: function() {
            me.add();
          },
        });
        buttons.push({
          src: scil.App.imgSmall('edit.png'), title: 'Edit', onclick: function() {
            me.edit();
          },
        });
      }
    }
    if (this.options.buttons != null)
      buttons = buttons.concat(this.options.buttons);
    var args = this.options.object == null ? null : {url: this.page.url + this.options.object + '.tree', icongap: '3px', onAddItem: this.options.onAddItem};

    this.form = new scil.Page.ExplorerForm(parent, {toolbarvisible: options.toolbarvisible, expandable: options.expandable, caption: options.caption, visible: options.visible, marginTop: options.marginTop, marginBottom: options.marginBottom, buttons: buttons, expanded: this.options.expanded, onexpand: this.options.onexpand});
    this.form.host = this;
    if (this.options.onrender != null) {
      this.options.onrender(this.form.div, args);
    } else {
      this.tree = new scil.Tree(this.form.div, args);
      this.tree.onSelectItem = function(item) {
        me.select(item);
      };
      this.tree.onExpandItem = function(node, f) {
        if (me.options.onexpand != null) return me.options.onexpand(node, f);
      };

      if (this.options.startrefresh != false)
        this.refresh();
    }

    this.form.main.style.padding = `0`;
    scil.Page.setBorder(this.form);
  }

  show() {
    this.form.show();
  }

  hide() {
    this.form.hide();
  }

  select(node) {
    if (this.options.onselectitem != null) {
      if (this.options.onselectitem(node))
        return;
    }

    var args = {};
    if (this.options.onBuildArgs != null) {
      args = this.options.onBuildArgs(node);
    } else {
      if (node != null && node.item != null && node.item[this.options.key] != null) {
        args[this.options.key] = node.item[this.options.key];
        if (this.options.name != null)
          args[this.options.name] = node.item.name;
      }
    }

    this.page.receiverRefresh(this, args);
  }

  refresh(currentOnly?: boolean) {
    if (!this.form.isVisible()) {
      this.refreshneeded = true;
      return;
    }

    if (this.tree == null)
      return;

    if (currentOnly) {
      this.tree.reloadCur();
      return;
    }

    this.refreshneeded = false;
    this.tree.clear();
    if (this.options.root != null) {
      if (this.options.root.selectable == null)
        this.options.root.selectable = false;
      if (this.options.root.showroot == false && this.options.root.children != null) {
        for (var i = 0; i < this.options.root.children.length; ++i)
          this.tree.cur = this.tree.add(null, this.options.root.children[i]);
      } else {
        this.tree.cur = this.tree.add(null, this.options.root);
      }
    }
    if (this.options.object != null && this.options.object != '')
      this.tree.reloadCur();
  }

  applyArgs(data) {
    if (this.args != null)
      scil.apply(data, this.args);
  }

  add() {
    this.create();
    this.dlg.show();
    if (this.options.onshowform != null)
      this.options.onshowform(this.dlg);

    this.dlg.form.setData(this.options.defaultvalues == null ? {} : this.options.defaultvalues);
  }

  edit() {
    this.add();

    var data = {};
    data[this.options.key] = this.tree.cur == null || this.tree.cur.item == null ? null : this.tree.cur.item[this.options.key];
    if (data[this.options.key] != null) {
      var me = this;
      scil.Utils.ajax(this.page.url + this.options.object + '.load', function(ret) {
        if (me.options.onloaddata)
          me.options.onloaddata(ret);
        me.dlg.form.setData(ret);
      }, data);
    }
  }

  save() {
    var me = this;
    var data = this.dlg.form.getData();
    if (this.options.onbeforesave) {
      var sel = {};
      sel[this.options.key] = this.tree.cur == null || this.tree.cur.item == null ? null : this.tree.cur.item[this.options.key];
      if (this.options.onbeforesave(data, sel) == false)
        return false;
    }
    scil.Utils.ajax(this.page.url + this.options.object + '.save', function() {
      me.dlg.hide();
      if (me.options.onSaved != null)
        me.options.onSaved(me, data);
      else
        me.refresh(true);
    }, data);
  }

  del() {
    var me = this;
    var data = this.dlg.form.getData();
    scil.Utils.ajax(this.page.url + this.options.object + '.del', function() {
      me.dlg.hide();
      me.refresh();
    }, data);
  }

  create() {
    if (this.dlg != null)
      return;

    var me = this;
    var buttons = [{
      src: scil.App.imgSmall('submit.png'), label: 'Save', onclick: function() {
        me.save();
      },
    },
      {
        src: scil.App.imgSmall('del.png'), label: 'Delete', onclick: function() {
          me.del();
        },
      }];
    this.dlg = scil.Form.createDlgForm(this.options.formcaption, this.options.fields, buttons);
    if (this.options.oncreateform != null)
      this.options.oncreateform(this.dlg.form);
  }
}

scil.Page.Tree = PageTree;
