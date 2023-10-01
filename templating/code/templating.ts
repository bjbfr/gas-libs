namespace Templating {

  const VAR_TEMPLATE_RE = /\{(\w+)\}/g;
  // type VarDescDoc = { name: string }
  // type VarDescSheet = { name: string, sheet?: number, row?: number, column?: number }
  export interface VarDesc { name: string, sheet?: number, row?: number, column?: number }
  interface VarValuesDesc extends VarDesc {value:number | string}
  export type FileType = ReturnType<typeof Fs.openById>
  type VarValuesT = ReturnType<typeof get_template_vars_values>

  /**
   * 
   * @param fileDescs 
   * @param values 
   * @returns 
   */
  export function do_templating(fileDescs: Array<Fs.FileDesc>, values: Obj_t) {

    let messages = [] as Array<string>;
    // fileDescs = fs.list_dir(dirId)
    fileDescs.map((file_desc) => ({ ...file_desc, file: Fs.openById(file_desc) })
      /*{
        if (type === Fs.SPREADSHEET_TYPE) {
          return { file: SpreadsheetApp.openById(id), type: type, name: name }
        } else if (type === Fs.DOCUMENT_TYPE) {
          return { file: DocumentApp.openById(id), type: type, name: name }
        }
        return {}
      }*/
    )
      .forEach(({ file, type, name }) => {
        if (file && type && name) {

          // retrieve variables defined in the template
          let vars = get_template_vars(file, type);
          if(vars.length !== 0)
          {
            // associate variables with their values
            let vars_values = get_template_vars_values(vars, values);
            // check that all needed variables are defined if not push a message
            const message = check_values(vars_values, name);
            if (message) messages.push(message);
            // filter undefined variables
            vars_values = vars_values.filter(({value}) => value !== undefined);
            // insert values in template
            set_template_vars(file, type,vars_values)

          }else{
            messages.push(`No variables found in template: '${name}'`);
          }
        } else{
          messages.push(`No file named: '${name}' found.`);
        }
      });

    return messages;
  }

  function check_values(vars_values:VarValuesT, template_name:string) {
    let message;
    let undefined_template_vars = vars_values.filter(({value }) => value === undefined);
    if (undefined_template_vars.length !== 0)
      message = `The variables: ${JSON.stringify(undefined_template_vars)} found in template: '${template_name}' are not defined.`;
    return message;
  }

  export function get_template_vars(file: FileType, type: Fs.MineType): VarDesc[] {
    if (file) {

      if (type === Fs.MineType.DOC) {

        return extract_vars((file as GoogleAppsScript.Document.Document).getBody().getText()).map(
          (name) => ({ name: name })
        );

      } else if (type === Fs.MineType.SHEET) {

        return get_template_vars_spreadSheet(file as GoogleAppsScript.Spreadsheet.Spreadsheet);

      }
    }
    return[];
  }

  function get_template_vars_spreadSheet(spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    return spreadSheet.getSheets()
      .reduce((acc, sheet) => {
        let lastRow = sheet.getLastRow();
        let lastColumn = sheet.getLastColumn();
        let sheetIndex = sheet.getIndex();
        for (let i = 1; i <= lastRow; i++) {
          for (let j = 1; j <= lastColumn; j++) {
            extract_vars(sheet.getRange(i, j).getValue().toString())
              .forEach(
                (name) => acc.push({ name: name, sheet: sheetIndex, row: i, column: j })
              );
          }
        }
        return acc;
      }, [] as Array<VarDesc>);
  }

  function extract_vars(text: string) {
    try {
      return [...text.matchAll(VAR_TEMPLATE_RE)].reduce((acc, x) => {
        let y = x[1];
        if (acc.indexOf(y) === -1)
          acc.push(y);
        return acc
      }, [] as Array<string>);
    } catch {
      Logger.log(`Exception in extract_vars with text: ${text}`);
      return [];
    }
  }

  export function get_template_vars_values(vars: Array<VarDesc>, values: Obj_t) {
    return vars.map((var_) => {
      let { name } = var_;
      return {
        ...var_, ...{ value: Obj.get_key_value(values, name) }
      };
    });// to be modified
  }

  function set_template_vars(file:FileType, type:Fs.MineType, vars_values:VarValuesDesc[]) {
    if (type === Fs.MineType.DOC) {
      let body = (file as GoogleAppsScript.Document.Document).getBody();
      vars_values.forEach(({ name, value }) => body.replaceText('{' + name + '}', value.toString()));
    } else if (type === Fs.MineType.SHEET) {
      let sheets = (file as GoogleAppsScript.Spreadsheet.Spreadsheet).getSheets();
      (vars_values).forEach(
        ({ name, value, sheet, row, column }) => {
          if(sheet && row && column){
            const feuille = sheets[sheet - 1];
            const cell = feuille.getRange(row, column);
            if (typeof value === 'string') {
              let tmp = cell.getValue().toString();
              let reg = new RegExp('\{' + name + '\}', "g");
              tmp = tmp.replace(reg, value);
              cell.setValue(tmp);
            } else if (typeof value === 'number') {
              cell.setValue(value);
            }
          }
        }
      );
    }
  }

  // function get_named_ranged_value(name,spreadsheet){
  //   let range = spreadsheet.getRangeByName(name);
  //   if(range != null){
  //     return range.getValue()
  //   }else {
  //     return;
  //   }
  // }
}