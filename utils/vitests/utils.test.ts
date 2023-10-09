import { test, expect } from 'vitest'

// @ts-ignore: use custom plugin to resolve this
import { Utils } from '../code/utils'

// @ts-ignore: use custom plugin to resolve this
import { Utils as UtilsEnums } from '../code/enums'

// @ts-ignore: use custom plugin to resolve this
import { Utils as UtilsArray } from '../code/array'


test("gswapp - undefined", () => {
    expect(
        Utils.gwapp()
    ).toStrictEqual(undefined)
});

// function log_soundMode(x:SoundMode|undefined){
//     console.log(`here:${x}`);
// }
// ko:
// log_soundMode("Silent")
// ok:
// const y:SoundMode|undefined = fromString(SoundMode,"Silent");
// log_soundMode(y)

test("fromString - enum", () => {

    enum SoundMode {
        S = "Silent",
        N = "Normal",
        L = "Loud"
    }
    expect(UtilsEnums.fromString(SoundMode, "Silent")).toBe(SoundMode.S);
    expect(UtilsEnums.fromString(SoundMode, "unknown")).toBe(undefined);

});

test("seq - nominal case", () => {
    expect(Utils.seq(7)).toStrictEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(Utils.seq(7, 1)).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
});

test("csv_from_json - nominal cases", () => {
    expect(Utils.csv_from_json([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }])).toStrictEqual([[1, 2, "foo", "delta1"]]);
    expect(Utils.csv_from_json([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }], ['a', 'b', 'd'])).toStrictEqual([[1, 2, "delta1"]]);
    expect(Utils.csv_from_json([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }], ['a', 'b', 'd'], true)).toStrictEqual([['a', 'b', 'd'], [1, 2, "delta1"]]);
    expect(Utils.csv_from_json([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }], undefined, true)).toStrictEqual([['a', 'b', 'c', 'd'], [1, 2, "foo", "delta1"]]);
});

test("csv_from_json - edge cases",() => {

    expect(Utils.csv_from_json([[]])).toStrictEqual([[]]);
    expect(Utils.csv_from_json([[{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }]],['e','f','g'])).toStrictEqual([[]]);
    expect(Utils.csv_from_json([[{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }]],['e','f','g'],true)).toStrictEqual([['e','f','g'],[]]);

})