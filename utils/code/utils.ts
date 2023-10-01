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

  // type EnumTypeString<TEnum extends string> = { [key in string]: TEnum | string; }

  // type EnumTypeNumber<TEnum extends number> = { [key in string]: TEnum | number; } | { [key in number]: string; }

  // type EnumType<TEnum extends string | number> = (TEnum extends string ? EnumTypeString<TEnum> : never) | (TEnum extends number ? EnumTypeNumber<TEnum> : never)

  // type EnumOf<TEnumType> = TEnumType extends EnumType<infer U> ? U : never

  // /**
  //  * Converts string to enum value
  //  * @param e 
  //  * @param x 
  //  * @returns 
  //  */
  // export function fromString<TEnumType extends { [k: string]: string }>(e: TEnumType, x: string) {
  //   const entry = Object.entries(e).find(([_, v]) => x === v);
  //   if (entry)
  //     return entry[1] as EnumOf<TEnumType>;
  //   return;
  // }
  // enum SoundMode{
  //     S = "Silent",
  //     N = "Normal",
  //     L = "Loud"
  // }
  // function log_soundMode(x:SoundMode|undefined){
  //     console.log(`here:${x}`);
  // }
  // const y:SoundMode|undefined = fromString(SoundMode,"Silent");
  // log_soundMode(y)
  // // log_soundMode("Silent") // ko
  // if(y === SoundMode.S)
  //     console.log("this is true")
}