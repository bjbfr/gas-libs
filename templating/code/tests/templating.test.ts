/// <reference path="../templating.ts"/>

function templating_test_get_template_vars() {
    const test_data = [
        {
            input: { file: DocumentApp.openById('1aMFie7uNtpsDUZ1gTw7Q8GwnqfW6vjOuXe82ey4VOxQ'), type: Fs.MineType.DOC },// test_template_doc
            expected: [{ name: 'toto' }, { name: 'compte_resultat' }, { name: 'var_templating' }, { name: 'resultat_value' }] 
        },
        {
            input: { file: SpreadsheetApp.openById('1Hu4QkFD5UfbWPdfNdLEqCZDfw2o4se4py9FYheLXhG8'), type: Fs.MineType.SHEET }, // test_template_sheet
            expected: [
                { name: 'date_debut', sheet: 2, row: 3, column: 2 },
                { name: 'date_fin', sheet: 2, row: 3, column: 2 },
                { name: 'date_fin', sheet: 2, row: 4, column: 3 },
                { name: 'date_n_1', sheet: 2, row: 4, column: 7 },
                { name: 'autres_titres', sheet: 2, row: 54, column: 3 },
                { name: 'autres_titres', sheet: 2, row: 54, column: 5 }
            ]
        }
    ];
    Unittest.run<{ file: Templating.FileType, type: Fs.MineType }, Templating.VarDesc[]>(
        "get_template_vars",
        test_data,
        ({ file, type }) => Templating.get_template_vars(file, type),
    );
}

function templating_test_get_template_vars_values() {
    let test_data = [
        {
            input: { vars: [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }], values: { 'a': 123, 'b': "foo", 'c': ['alpha', 2, 3] } },
            expected: [{ name: 'a', value: 123 }, { name: 'b', value: "foo" }, { name: 'c', value: ['alpha', 2, 3] }, { name: 'd', value: undefined }]
        }
    ];
    Unittest.run(
        "get_template_vars_values",
        test_data,
        ({ vars, values }) => Templating.get_template_vars_values(vars, values),
    )
}

// test_all
function templating_test_all() {
    return Unittest.run_all(['templating_test_get_template_vars','templating_test_get_template_vars_values'])
}
