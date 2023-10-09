namespace Spreadsheet {

    // type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet
    export type Sheet = GoogleAppsScript.Spreadsheet.Sheet
    type Range = GoogleAppsScript.Spreadsheet.Range
    export type SheetLimits = { firstRow: number, firstColumn: number, lastRow: number, lastColumn: number }

    /**
     * Returns the limits of a sheet corresponding to its tabular data (with headers)
     * @param sheet 
     * @returns 
     */
    export function get_limits(sheet: Sheet) {

        const lastRow = sheet.getLastRow();
        const lastColumn = sheet.getLastColumn();

        if (lastRow === 0 || lastColumn === 0) return undefined; // empty sheet

        // find headers first to be sure to read correctly columns
        const firstRow = get_first(lastRow, (i) => sheet.getRange(i, lastColumn));
        const firstColumn = get_first(lastColumn, (j) => sheet.getRange(firstRow, j));

        return { firstRow: firstRow, firstColumn: firstColumn, lastRow: lastRow, lastColumn: lastColumn };
    }
    /**
     * Explores one dimension of a sheet (from 1 up to {@link high_bound}) and returns the first non-empty cell.
     * @param high_bound {number}: upper bound to be explored
     * @param getter : data accessor to read data in one given dimension.
     * @returns 
     */
    function get_first(high_bound: number, getter: (i: number) => Range) {
        return Utils.seq(high_bound, 1).reverse() // array from 1 to high_bound: [1...high_bound]
            .reduce(
                (acc, i) => getter(i).getValue().toString().trim() !== '' ? i : acc
            )
    }
    /**
     * Reads tabular data in {@link sheet}
     * @param sheet 
     * @param limits 
     * @returns 
     */
    export function read_tabular_data(sheet: Sheet, limits: SheetLimits | undefined | null = null) {
        if (limits === null)
            limits = get_limits(sheet);
        if (limits) {
            const { firstRow, firstColumn, lastRow, lastColumn } = limits;
            const range = sheet.getRange(firstRow, firstColumn, lastRow - firstRow + 1, lastColumn - firstColumn + 1);
            return range.getValues();
        }
        return [[]];
    }

    /**
     * Synchronises {@link sheet} with {@link json_data} only pieces of data that are not yet in {@link sheet} are added.
     * @param sheet {Sheet} Google sheet to be synchronized
     * @param json_data {Obj_t[]} json data to be added to {@link sheet}
     * @param identifiers sheet's headers used to uniquely identified row of data in {@link json_data}
     * @param headers_keys .mapping between sheet's headers and {@link json_data} keys.
     * @param headers sheet's headers to be used if {@link sheet} is empty, otherwise headers are read directly from {@sheet}
     */
    export function synchronize(sheet: Sheet, json_data: Obj_t[], identifiers: string[], headers_keys: { [index: string]: string } | undefined = undefined, headers: string[] | undefined = undefined) {

        const get_keys = (headers: string[], headers_keys: { [index: string]: string } | undefined) =>
            headers_keys ? headers.map(h => headers_keys[h]) : undefined;

        const limits = get_limits(sheet);
        if (!limits) { // sheet is empty: no synchronization is needed and headers should be added.
            const firstRow = 1;
            const firstColumn = 1;
            headers = headers ? headers : Object.keys(json_data[0])
            const csv_data = [headers].concat(Utils.csv_from_json(json_data, get_keys(headers, headers_keys)));
            write(csv_data, sheet, firstRow, firstColumn);
        } else { // sheet is NOT empty: synchronization is needed and headers are read from sheet and should NOT be added.
            const { firstColumn, lastRow } = limits;
            const sheet_data = read_tabular_data(sheet, limits);
            headers = sheet_data[0];
            const sheet_identifiers = Utils.json_from_csv(sheet_data).map(x => Obj.pick_keys(x, identifiers))
            const data = json_data.filter(x => {
                const id = Obj.pick_keys(x, identifiers);
                return sheet_identifiers.find(sid => Cmp.cmp(sid, id)) === undefined
            });
            const csv_data = Utils.csv_from_json(data, get_keys(headers, headers_keys));
            write(csv_data, sheet, lastRow + 1, firstColumn);
        }
    }

    /**
     * Writes tabular data {@link csv_data} to {@link sheet} starting at row {@row} and column {@column}
     * @param csv_data 
     * @param sheet 
     * @param row 
     * @param column 
     */
    export function write(csv_data: any[][], sheet: Sheet, row: number, column: number) {
        const range = sheet.getRange(row, column, csv_data.length, csv_data[0].length);
        range.setValues(csv_data);
    }

}