namespace Spreadsheet {

    // type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet
    export type Sheet = GoogleAppsScript.Spreadsheet.Sheet
    export type SheetLimits = { firstRow: number, firstColumn: number, lastRow: number, lastColumn: number }

    /**
     * Add a pivot table to {@link sheet} (starting at {@link init_pos}) with {@link srcData}.
     * Columns {@link columns} and rows {@link rows} of the pivot table are defined as headers of {@link srcData}.
     * Values {@link values} are defined as [header of {@link srcData},stat function]
     * @param sheet 
     * @param srcData 
     * @param columns 
     * @param rows 
     * @param values 
     * @param init_pos 
     */
    export function add_pivot_table(sheet:Sheet,srcData:Sheetrange.Range,columns: string[], rows: string[], values: Array<[string, Sheetrange.SummarizeFunction]>,init_pos: [number, number] = [2, 2]){
        //remove existing pivot 
        Spreadsheet.remove_pivot_table(sheet);
        // get anchor on current sheet
        const [firstRow, firstColumn] = init_pos;
        const anchor = sheet.getRange(firstRow,firstColumn);
        // add pivot table
        Sheetrange.add_pivot_table(anchor, srcData, columns,rows,values)
    }
    /**
     * 
     * @param property 
     * @returns 
     */
    export function get_sheet_by_property(property:string){
        const sheetName = Properties.getProperty(property);
        const sheet = Spreadsheet.get_sheet_by_name(sheetName);
        if(!sheet)
            console.log(`cannot find sheet with property: ${property}`)
        return sheet
    }
    /**
     * 
     * @param sheet 
     */
    export function remove_pivot_table(sheet: Sheet) {
        sheet.getPivotTables().forEach(t => t.remove())
    }
    /**
     * 
     * @param sheet 
     * @param limits 
     * @returns 
     */
    export function get_tabular_range(sheet: Sheet, limits: SheetLimits) {
        const { firstRow, firstColumn, lastRow, lastColumn } = limits;
        return sheet.getRange(firstRow, firstColumn, lastRow - firstRow + 1, lastColumn - firstColumn + 1);
    }
    /**
     * 
     * @param sheet 
     * @param banding 
     * @param limits 
     */
    export function set_banding(sheet: Sheet, banding: Sheetrange.Banding, limits: SheetLimits | null | undefined = null) {
        if (limits === null)
            limits = get_limits(sheet);
        if (limits) {
            const range = get_tabular_range(sheet, limits);
            Sheetrange.set_banding(range, banding)
        }
    }
    /**
     * 
     * @param name 
     * @returns 
     */
    export function get_sheet_by_name(name: string) {
        return SpreadsheetApp.getActive().getSheetByName(name)
    }
    /**
     * 
     * @param sheetIndex 
     * @returns 
     */
    export function get_sheet_by_index(sheetIndex: number) {
        return SpreadsheetApp.getActive().getSheets()[sheetIndex]
    }
    /**
     * 
     * @param sheet 
     * @param limits 
     */
    export function auto_size_columns(sheet: Sheet, limits: SheetLimits | null | undefined = null) {
        if (limits === null)
            limits = get_limits(sheet);
        if (limits) {
            const { firstColumn, lastColumn } = limits;
            sheet.autoResizeColumns(firstColumn, lastColumn - firstColumn + 1);
        }
    }
    /**
     * 
     * @param sheet 
     * @param limits 
     */
    export function set_filter(sheet: Sheet, limits: SheetLimits | null | undefined = null) {
        if (limits === null)
            limits = get_limits(sheet);
        if (limits) {
            remove_filter(sheet);
            const range = get_tabular_range(sheet, limits);
            range.createFilter();
        }
    }
    /**
     * 
     * @param sheet 
     */
    export function remove_filter(sheet: Sheet) {

        const filter = sheet.getFilter();
        if (filter)
            filter.remove();

    }
    /**
     * Returns the limits of a sheet corresponding to its tabular data (with headers)
     * @param sheet 
     * @returns 
     */
    export function get_limits(sheet: Sheet) {

        const lastRow = sheet.getLastRow() - 1;
        const lastColumn = sheet.getLastColumn() - 1;

        if (lastRow === -1 || lastColumn === -1) return undefined; // empty sheet

        const sheet_data = sheet.getDataRange().getValues();
        // find headers first to be sure to read correctly columns
        const firstRow = get_first(lastRow, (i) => sheet_data[i][lastColumn].toString());
        const firstColumn = get_first(lastColumn, (j) => sheet_data[firstRow][j].toString());

        return { firstRow: firstRow + 1, firstColumn: firstColumn + 1, lastRow: lastRow + 1, lastColumn: lastColumn + 1 };
    }
    /**
     * Explores one dimension of a sheet (from 1 up to {@link high_bound}) and returns the first non-empty cell.
     * @param high_bound {number}: upper bound to be explored
     * @param getter : data accessor to read data in one given dimension.
     * @returns 
     */
    function get_first(high_bound: number, getter: (i: number) => string) {
        return Utils.seq(high_bound).reverse() // array from 0 to high_bound: [0...high_bound[
            .reduce(
                (acc, i) => getter(i).trim() !== '' ? i : acc
            )
    }
    /**
     * Reads tabular data in {@link sheet}
     * @param sheet 
     * @param limits 
     * @returns 
     */
    export function read_tabular_data(sheet: Sheet, limits: SheetLimits | null | undefined = null) {
        // return sheet.getDataRange().getValues()
        if (limits === null)
            limits = get_limits(sheet);
        if (limits) {
            const range = get_tabular_range(sheet, limits)
            return range.getValues();
        }
        return [[]];
    }
    /**
     * Synchronises {@link sheet} with {@link json_data} only pieces of data that are not yet in {@link sheet} are added.
     * @param sheet {Sheet} Google sheet to be synchronized
     * @param json_data {Obj_t[]} json data to be added to {@link sheet}
     * @param identifiers sheet's headers used to uniquely identified row of data in {@link json_data}
     */
    const make_identifier = (o: Obj_t, identifiers: string[]) => identifiers.reduce((acc, k) => acc + o[k].toString(), "")
    export function synchronize(sheet: Sheet, json_data: Obj_t[], identifiers: string[], init_pos: [number, number] = [2, 2]) {

        const limits = get_limits(sheet);
        if (!limits) { // sheet is empty: no synchronization is needed and headers should be added.
            const [firstRow, firstColumn] = init_pos;
            const csv_data = Utils.csv_from_obj(json_data, true); // convert in csv and add headers
            write(csv_data, sheet, firstRow, firstColumn);
            //number of transactions added.
            return csv_data.length - 1;
        } else { // sheet is NOT empty: synchronization is needed and headers should NOT be added.
            const { firstColumn, lastRow } = limits;
            // filter rows that are already in sheet
            const sheet_data = read_tabular_data(sheet, limits);

            //convert date to string 
            sheet_data.forEach(row => row.forEach((v, i) => Typing.is_date(v) ? row[i] = Utils.format_date(v) : undefined))

            const sheet_identifiers = Utils.obj_from_csv(sheet_data).map(x => make_identifier(x, identifiers))
            const data = json_data.filter(x => {
                const id = make_identifier(x, identifiers);
                return sheet_identifiers.find(sid => sid === id) === undefined
            });
            // convert
            if (data.length > 0) {
                const csv_data = Utils.csv_from_obj(data);
                // write
                write(csv_data, sheet, lastRow + 1, firstColumn);
            }
            // number of transactions added.
            return data.length;

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