///<reference path="./utils.ts">

namespace Utils {

  export function assert(condition: Boolean, message: string) {
    if (!condition) {
      console.log("Assertion failed: " + message);
    }
  }
  /**
   * 
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
   * 
   * @param csv_data 
   */
  export function json_from_csv(csv_data: any[][]) {
    const headers = csv_data[0];
    let entries = csv_data.map((row, i) => {
      if (i === 0) return row;
      else return Utils.zip(headers, row)
    })
    entries.shift();
    return entries.map(entry => Object.fromEntries(entry)) //as Obj_t[]
  }

  /**
   * 
   * @param json_data 
   * @param keys 
   * @param add_headers 
   */
  export function csv_from_json(json_data: Obj_t[], keys: string[] | undefined = undefined, add_headers: boolean = false) {

    const json_data_keys = Object.keys(json_data[0]);
    // headers: keys to be extracted, nb_keys: number of keys that are actually part of the json_data
    const [headers, nb_keys] = keys ?
      [keys, keys.filter(k => json_data_keys.indexOf(k) !== -1).length]
      :
      [json_data_keys, json_data_keys.length];


    const csv_data = () => nb_keys === 0 ?
      [[]]
      :
      json_data.map(x => headers.map(h => x[h]));

    return (
      add_headers ? [headers].concat(csv_data()) : csv_data()
    )
  }

}