/// <reference path="../utils.ts"/>

function utils_test_gwapp() {
    if (Utils.currentApp) {
        const { appName } = Utils.currentApp;
        console.log(`appName: ${appName}`)
        return appName;
    }
    return;
}

enum SoundMode {
    S = "Silent",
    N = "Normal",
    L = "Loud"
}

function utils_test_fromString(){

    const test_data = [
        {input:"Silent",expected:SoundMode.S},
        {input:"unknown",expected:undefined}
    ];

    return Unittest.run<string,SoundMode|undefined>(
        "fromString - enum",
        test_data,
        (input) => Utils.fromString(SoundMode,input)
    )
}

function utils_test_json_from_csv() {
    return Unittest.run<any[][], Obj_t[]>(
      "json_from_csv",
      [
        {
          input: [['a', 'b', 'c'], [1, 2, 3], [4, 5, 6]],
          expected: [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]
        }
      ],
      (input) => Utils.json_from_csv(input)
    );
  }

// test_all
function utils_test_all(){
    return Unittest.run_all(['utils_test_fromString','utils_test_json_from_csv'])
}