// checking for the options passed to the babel parse method
type babylonOptions = {
  sourceType: 'script' | 'module',
  allowReturnOutsideFunction: boolean,
  allowImportExportEverywhere: boolean,
  plugins: Array<string>,
  strictMode: ?boolean,

  allowHashBang: boolean,
  ecmaVersion: number
};

declare module 'babylon' {
    declare function parse(code: string, opts: babylonOptions): Object;
    declare var tokTypes: Object;
}
