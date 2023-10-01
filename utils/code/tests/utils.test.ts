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

// test_all
function utils_test_all(){
    return Unittest.run_all(['utils_test_fromString'])
}