import { test, expect } from 'vitest'

// @ts-ignore: use custom plugin to resolve this
import { Utils } from '../code/utils'

// @ts-ignore: use custom plugin to resolve this
import { Utils as UtilsEnums} from '../code/enums'


test("gswapp - undefined", () => {
    expect(
        Utils.gwapp()
    ).toStrictEqual(undefined)
});

test("fromString - enum", () => {
    
    enum SoundMode {
        S = "Silent",
        N = "Normal",
        L = "Loud"
    }
    expect(UtilsEnums.fromString(SoundMode,"Silent")).toBe(SoundMode.S);
    expect(UtilsEnums.fromString(SoundMode,"unknown")).toBe(undefined);
    
});

// function log_soundMode(x:SoundMode|undefined){
//     console.log(`here:${x}`);
// }
// ko:
// log_soundMode("Silent")
// ok:
// const y:SoundMode|undefined = fromString(SoundMode,"Silent");
// log_soundMode(y)
