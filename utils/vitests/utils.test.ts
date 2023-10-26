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

test("csv_from_obj - nominal cases", () => {
    expect(Utils.csv_from_obj([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }])).toStrictEqual([[1, 2, "foo", "delta1"]]);
    expect(Utils.csv_from_obj([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }], false,['a', 'b', 'd'])).toStrictEqual([[1, 2, "delta1"]]);
    expect(Utils.csv_from_obj([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }], true, ['a', 'b', 'd'])).toStrictEqual([['a', 'b', 'd'], [1, 2, "delta1"]]);
    expect(Utils.csv_from_obj([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }],true)).toStrictEqual([['a', 'b', 'c', 'd'], [1, 2, "foo", "delta1"]]);
});

test("csv_from_obj - edge cases",() => {

    expect(Utils.csv_from_obj([{}])).toStrictEqual([[]]);
    expect(Utils.csv_from_obj([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }], false,['e','f','g'])).toStrictEqual([[]]);
    expect(Utils.csv_from_obj([{ 'a': 1, 'b': undefined, 'c': "foo", 'd': "delta1" }], false,['a','b','c'])).toStrictEqual([[1,"","foo"]]);
    expect(Utils.csv_from_obj([{ 'a': 1, 'b': null, 'c': "foo", 'd': "delta1" }], false,['a','b','c'])).toStrictEqual([[1,"","foo"]]);
    expect(Utils.csv_from_obj([{ 'a': 1, 'b': 2, 'c': "foo", 'd': "delta1" }], true,['e','f','g'])).toStrictEqual([['e','f','g'],[]]);

})