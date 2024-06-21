interface IFormOptions {
  viewonly: boolean;
  lang: string;
  alternativeforms: any;
  onchange: Function;
}

export type IFormDialog = any;

export type DialogButtonType = {
  label: string;
  onclick: Function;
}

export type ITabs = any;

// export interface IForm {
//   Dialog: IFormDialog;
//
//   new(options?: Partial<IFormOptions> | boolean): IForm;
//
//   createTabDlgForm(caption: string, options?: any): IFormDialog;
//   createDlgForm(caption: string, items?: { [fName: string]: any }, buttons?: DialogButtonType[] | DialogButtonType | null, options?: any): IFormDialog;
//   [pName: string]: any;
// }
