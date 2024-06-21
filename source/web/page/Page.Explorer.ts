//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw
// Copyright (C) 2014 Scilligence Corporation
// http://www.scilligence.com/
//
//////////////////////////////////////////////////////////////////////////////////

// @ts-nocheck

import type {ScilModuleType} from "../src/types/scil";

declare const scil: ScilModuleType;

export class PageExplorer {
  private readonly T: string;
  private options: any;
  private readonly resizing: any;
  public left: HTMLElement;
  public right: HTMLElement;
  public middle: HTMLElement;


  constructor(parent: HTMLElement | string, options?: any) {
    this.T = 'PAGE.EXPLORER';
    if (typeof (parent) == 'string')
      parent = scil.byId(parent);

    this.options = options;

    this.resizing = null;
    if (options.resizable == null)
      options.resizable = true;

    const tbody = scil.Utils.createTable(parent, 0, 0, {width: '100%'});
    const tr = scil.Utils.createElement(tbody, 'tr');

    if (options.left == false) {
      this.left = null;
      this.middle = null;
    } else {
      const w = options.leftwidth > 0 ? options.leftwidth : 200;
      const td = scil.Utils.createElement(tr, 'td', null, {width: '1%', paddingRight: '1px'}, {vAlign: 'top'});
      const tbody2 = scil.Utils.createTable(td, 0, 0, options.resizable ? null : {width: w});
      const tr2 = scil.Utils.createElement(tbody2, 'tr');
      const td2 = scil.Utils.createElement(tr2, 'td');
      this.left = scil.Utils.createElement(td2, 'div', null, options.resizable ? {width: w, overflow: 'hidden'} : null);

      if (options.middle != false) {
        this.middle = scil.Utils.createElement(tr, 'td');
        const div = scil.Utils.createElement(this.middle, 'div', null, {width: `${scil.Page.kHandleWidth}px`});
        scil.Utils.unselectable(this.middle);
        scil.Utils.unselectable(div);
      }

      if (options.resizable) {
        const me = this;
        new scil.Resizable(this.middle, {
          direction: 'x', mouseovercolor: scil.Page.kHandleColor, onresize: function(delta) {
            return me.onresize(delta);
          },
        });
      }
    }

    this.right = options.right == false ? null : scil.Utils.createElement(tr, 'td', null, {width: '99%', paddingLeft: options.left == false ? null : '1px'}, {vAlign: 'top'});
  }

  onresize(delta) {
    const w = scil.Utils.parsePixel(this.left.style.width) + delta;
    if (w > 20) {
      this.left.style.width = w + 'px';
      if (this.options.onresize != null)
        this.options.onresize(w, this);
      return true;
    }
    return false;
  }
}

scil.Page.Explorer = PageExplorer;
