/// <reference path="../properties.ts"/>

function properties_test_get_property(){

    return Unittest.run<string,string>(
        "get_property",
        [{input:"dataFolder",expected:"1KVB1TTCVf4OluHXcxdXrLqEkX0levVQJ"}],
        (input) => Properties.getProperty(input)
    )

}

// test_all
function properties_test_all(){
    return Unittest.run_all(['properties_test_get_property'])
}
