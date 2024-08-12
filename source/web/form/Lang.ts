//////////////////////////////////////////////////////////////////////////////////
//
// JSDraw.Lite
// Copyright (C) 2018 Scilligence Corporation
// http://www.scilligence.com/
//
// (Released under LGPL 3.0: https://opensource.org/licenses/LGPL-3.0)
//
//////////////////////////////////////////////////////////////////////////////////

// @ts-nocheck

import type {ScilModuleType} from '../src/types';

declare const scil: ScilModuleType;

/**
 * Lang class - translate web page into other lanagues
 * @class scilligence.Lang
 * <pre>
 * <b>Example:</b>
 *    scil.Lang.use('cn');
 *    var s = scil.Lang.res("Print");
 * </pre>
 */
export class Lang {
  static token: string = "translate";
  static key: string = "scil_lang";
  static current: {} | null = null;
  static language: {} | null = null;
  static en: {} = {};
  static cn: {} = {};

  private static lang: Lang;

  static add(dict, lang) {
    if (dict == null)
      return;

    var dest = lang == null ? this.en : scil.Lang[lang];
    if (dest == null)
      scil.Lang[lang] = {};

    scil.apply(dest, dict);
  }

  static setLang(lang, reload) {
    if (lang == null || lang == "")
      scil.Utils.createCookie(this.key, "", -1, true);
    else
      scil.Utils.createCookie(this.key, lang, 180, true);
    if (reload)
      window.location.reload();
  }

  static use(lang) {
    if (lang == null)
      return;
    lang = lang.toLowerCase();
    if (lang == "zh")
      lang = "cn";

    this.language = lang;
    this.current = this[lang];
    if (this.current == null) {
      this.current = this.en;
      this.language = null;
    }

    JSDraw2.Language.use(lang);
  }

  static res(s, lang?) {
    if (scil.Utils.isNullOrEmpty(s) || typeof (s) != "string")
      return s;

    if (lang != null) {
      var dict = this[lang];
      return dict == null || dict[s] == null ? s : dict[s];
    }

    if (this.current == null) {
      let lang = scil.Utils.readCookie(this.key, true);
      if (lang != null && lang != "")
        this.use(lang);

      if (this.current == null && this.lang != null)
        this.use(this.lang);

      if (this.current == null) {
        // @ts-ignore
        lang = window.navigator.userLanguage;
        if (lang != null && lang.length > 2)
          this.use(lang.substr(0, 2));
        if (this.current == null)
          this.current = this.en;
      }
    }

    var ret = this.current == null ? null : this.current[s];
    if (ret == null || ret == "")
      ret = JSDraw2.Language.res(s);
    return ret;
  }

  static translate(parent, tags) {
    if (tags == null || tags == "") {
      this.translate(parent, "span");
    } else {
      var ss = tags.split(',');
      for (var i = 0; i < ss.length; ++i)
        this.translate(parent, ss[i]);
    }
  }

  static translate2(parent, tag) {
    if (tag == null || tag == "")
      return;

    var list = (parent == null ? document : parent).getElementsByTagName(tag);
    if (list == null)
      return;

    for (var i = 0; i < list.length; ++i) {
      var e = list[i];
      if (e.getAttribute(this.token) == null)
        continue;

      // @ts-ignore
      var s = this.reg(e.innerHTML);
      if (scil.Utils.isNullOrEmpty(s))
        continue;

      e.innerHTML = s;
    }
  }
}

scil.Lang = Lang;
