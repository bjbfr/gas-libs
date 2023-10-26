
/// <reference path="../spreadsheet.ts"/>


const test_helper_get_sheet = (id: string, i: number) => SpreadsheetApp.openById(id).getSheets()[i]

const test_sheet_id = '11pC0jmMTYsyN9cDlBOkQjE4mH_ZEp_M8j3XgGEtodFg'

function spreadsheet_test_get_limits() {


    return Unittest.run<[string, number], Spreadsheet.SheetLimits | undefined>(
        "get_limits",
        [
            {
                input: [test_sheet_id, 0],
                expected: { firstRow: 5, firstColumn: 2, lastRow: 16, lastColumn: 5 }
            },
            {
                input: [test_sheet_id, 1],
                expected: { firstRow: 8, firstColumn: 6, lastRow: 19, lastColumn: 9 }
            },
            {
                input: [test_sheet_id, 2],
                expected: undefined
            }
        ],
        ([id, i]) => Spreadsheet.get_limits(test_helper_get_sheet(id, i))
    );

}

function spreadsheet_test_read_tabular_data() {

    return Unittest.run<[string, number], any[][]>(
        "read_tabular_data",
        [
            {
                input: [test_sheet_id, 0],
                expected: ([['a', 'b', 'c', 'd']] as any[][]).concat(Utils.seq(11).map(_ => [1, 2, 3, 4]))
            },
            {
                input: [test_sheet_id, 2],
                expected: [[]]
            },
            {
                input: [test_sheet_id, 3],
                expected: [['data']]
            },
            {
                input: [test_sheet_id, 4],
                expected: [['a', 'b', 'c']]
            },
            {
                input: [test_sheet_id, 5],
                expected: [['a'], [1], [2], [3], [4], [5]]
            }
        ],
        ([id, i]) => Spreadsheet.read_tabular_data(test_helper_get_sheet(id, i))
    );
}

function spreadsheet_test_synchronize() {
    const identifiers = ['a', 'b'];
    return Unittest.run<[string, number], any[][]>(
        "synchronize",
        [
            { input: [test_sheet_id, 6], expected: [['a', 'b', 'c', 'd'], [1, "x", 2, 3], [1, "y", 4, 5]] },
            // { input: [test_sheet_id, 6], expected: [['alpha', 'beta', 'gamma', 'delta'], [1, "x", 2, 3], [1, "y", 4, 5]] },
            { input: [test_sheet_id, 6], expected: [['a', 'b', 'c', 'd'], [1, "x", 2, 3], [1, "z", 4, 5], [1, "y", 4, 5]] }
        ],
        ([id, i], j) => {
            const sheet = test_helper_get_sheet(id, i);
            const json_data = [{ a: 1, b: "x", c: 2, d: 3 }, { a: 1, b: "y", c: 4, d: 5 }];
            if (j === 0) {
                sheet.clear()
                Spreadsheet.synchronize(sheet, json_data, identifiers);
            }
            // else if (j === 1) {
            //     Spreadsheet.write([['alpha', 'beta', 'gamma', 'delta']], sheet, 1, 1);
            //     Spreadsheet.synchronize(sheet, json_data, identifiers, { 'alpha': 'a', 'beta': 'b', 'gamma': 'c', 'delta': 'd' });
            // } 
            else if (j === 1) {
                Spreadsheet.write([['a', 'b', 'c', 'd'], [1, "x", 2, 3], [1, "z", 4, 5]], sheet, 1, 1);
                Spreadsheet.synchronize(sheet, json_data, identifiers);
            }
            const ret = Spreadsheet.read_tabular_data(sheet);
            sheet.clear();
            return ret;
        }
    );
}

// test_all
function spreadsheet_test_all() {
    return Unittest.run_all(['spreadsheet_test_get_limits', 'spreadsheet_test_read_tabular_data','spreadsheet_test_synchronize'])
}
