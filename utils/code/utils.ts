///<reference path="./utils.ts">

namespace Utils {

  export type JsonData = Array<JsonType>
  export type CsvData = any[][]
  export type CsvTextData = string[][]

  /**
   * Simple assert utilities.It logs {@link message} if {@link condition} is not fulfilled.
   * @param condition 
   * @param message 
   */
  export function assert(condition: Boolean, message: string) {
    if (!condition) {
      console.log("Assertion failed: " + message);
    }
  }
  /**
   * Tries to determine the current Google Workspace App. If it succeeds it returns 
   * {appName:string,app: () => activeDoc}
   * @returns 
   */
  export function gwapp() {
    const currentApp_ = [
      { appName: "DocumentApp", getActiveName: "getActiveDocument" },
      { appName: "SpreadsheetApp", getActiveName: "getActive" },
      { appName: "SlidesApp", getActiveName: "getActivePresentation" },
      { appName: "FormApp", getActiveName: "getActiveForm" },
    ].find(({ appName, getActiveName }) => {
      try {
        // @ts-ignore: no implicit any ignored with globalThis
        let app = globalThis[appName];
        if (app) {
          const getActive = app[getActiveName];
          return !(getActive() === null);
        }
      } catch { }
      return false;
    })

    if (currentApp_)
      // @ts-ignore: no implicit any ignored with globalThis
      return { appName: currentApp_.appName, app: globalThis[currentApp_.appName] };

    return;
  }

  export const currentApp = gwapp();

  /**
   * Generates a sequence (an array) of {@link num} elements (number) starting from {@link first} 
   * @param num   : number of elements in the sequence
   * @param first : first index in the sequence
   */
  export function seq(num: number, first: number = 0) {
    return Array.from(Array(num).keys()).map(i => i + first)
  }
  /**
   * Transforms {@link csv_data} (array of array) into array of obj.
   * Objects' keys are read from the first row.
   * @param csv_data 
   */
  export function obj_from_csv(csv_data: any[][]) {
    const headers = csv_data[0];
    let entries = csv_data.map((row, i) => {
      if (i === 0) return row;
      else return Utils.zip(headers, row)
    })
    entries.shift();
    return entries.map(entry => Object.fromEntries(entry)) //as Obj_t[]
  }
  /**
   * Transforms {@link obj_data} (array of objects) into tabular data.
   * Whether or not headers (i.e objects' keys) are added as first row is driven by {@link add_headers}.
   * Filtering can also be performed by specifying which keys to add {@link keys}
   * @param obj_data 
   * @param keys 
   * @param add_headers 
   */
  export function csv_from_obj(obj_data: Obj_t[], add_headers: boolean = false, keys: string[] | undefined = undefined) {

    const obj_data_keys = Object.keys(obj_data[0]);
    // headers: keys to be extracted, nb_keys: number of keys that are actually part of the obj_data
    const [headers, nb_keys] = keys ?
      [keys, keys.filter(k => obj_data_keys.indexOf(k) !== -1).length]
      :
      [obj_data_keys, obj_data_keys.length];


    const csv_data = () => nb_keys === 0 ?
      [[]]
      :
      obj_data.map(x => headers.map(h => {
        const v = x[h];
        return v === null || v === undefined ? "" : v
      })
      );

    return (
      add_headers ? [headers].concat(csv_data()) : csv_data()
    )
  }
  /**
   * It checks if all rows have the same number of columns than the first row (headers).
   * @param data 
   * @returns {res:boolean,errors:Array<[line#,#ofcolumns]>}
   */
  export function check_tabular_data(data: any[][]) {
    const errors = data.map(x => x.length)
      .reduce(
        (acc, count, i, counts) => {
          if (count != counts[0]) acc.push([i, count])
          return acc
        },
        [] as Array<[number, number]>
      );
    return { res: errors.length === 0, errors: errors }
  }

  // helper for format_date_str
  const fmt_date_part = (x: number) => x < 10 ? `0${x}` : `${x}`
  const TIME_ZONE = "GMT"
  /**
   * Formats a date string {@link date_str} into a string with format dd/mm/yyyy. 
   * {@link fmt} is the format of the input string
   * @param date_str 
   * @param fmt 
   * @returns 
   */
  export function format_date_str(date_str: string, fmt: string = "yyyy-MM-dd HH:mm:ss") {
    const d_o = Utilities.parseDate(date_str, TIME_ZONE, fmt); // date object
    return `${fmt_date_part(d_o.getDate())}/${fmt_date_part(d_o.getMonth() + 1)}/${d_o.getUTCFullYear()}`
  }
  /**
   * Formats a date object {@link date} into string with {@link fmt}
   * @param date 
   * @param fmt 
   * @returns 
   */
  export function format_date(date: Date, fmt: string = "dd/MM/yyyy") {
    return Utilities.formatDate(date, TIME_ZONE, fmt)
  }
  /***
   * Converts {@link x} as string into float (javascript type number)
   */
  export const convertFloat = (x: string) => parseFloat(x.replace(',', '.'))
}