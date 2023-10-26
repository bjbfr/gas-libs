namespace Sheetrange {

    export type Range = GoogleAppsScript.Spreadsheet.Range
    export type Banding = GoogleAppsScript.Spreadsheet.BandingTheme

    export type SummarizeFunction = GoogleAppsScript.Spreadsheet.PivotTableSummarizeFunction

    /**
     * Creates a pivot table on {@link dataSrc} positionned at {@link anchor}.
     * {@link columns}, {@link rows} and {@link values} are defined in term of headers (i.e columns labels)
     * For {@link values}, one should also give `SummarizeFunction`.
     * @param anchor 
     * @param dataSrc 
     * @param columns 
     * @param rows 
     * @param values 
     */
    export function add_pivot_table(anchor: Range, dataSrc: Range, columns: string[], rows: string[], values: Array<[string, SummarizeFunction]>) {
        // create pivot table
        const pivotTabble = anchor.createPivotTable(dataSrc);
        // create generic helper to define columns, rows and values
        const headers = dataSrc.getValues()[0];
        const start = dataSrc.getColumn();
        const add_column_row_values = (inputs: string[] | Array<[string, SummarizeFunction]>, f: (index: number, statF: SummarizeFunction | undefined) => void) => {
            inputs.forEach(
                input => {
                    let name = "";
                    let statF: SummarizeFunction | undefined = undefined;
                    // either column or row: no SummarizeFunction
                    if (typeof input === 'string')
                        name = input
                    // case of value
                    else
                        [name, statF] = input
                    // map label to index
                    const offset = headers.indexOf(name);
                    if (offset === -1)
                        console.log(`Cannot find column: ${name}`)
                    else
                        f(start + offset, statF)
                }
            )
        }
        // columns
        add_column_row_values(columns, (i, _) => pivotTabble.addColumnGroup(i));
        // rows
        add_column_row_values(rows, (i, _) => pivotTabble.addRowGroup(i));
        // values
        add_column_row_values(values, (i, statF) => pivotTabble.addPivotValue(i, statF as SummarizeFunction));

    }
    /**
     * Sets {@link banding} on {@link range}. Starts by removing all existing banding
     * @param range 
     * @param banding 
     */
    export function set_banding(range: Range, banding: Banding) {
        range.getBandings().forEach(b => b.remove());
        apply_banding(range, banding)
    }
    /**
     * Applies banding
     * @param range 
     * @param banding 
     * @param showHeader 
     * @param showFooter 
     */
    export function apply_banding(range: Range, banding: Banding, showHeader: boolean = true, showFooter: boolean = false) {
        range.applyRowBanding(banding, showHeader, showFooter)
    }
    /**
     * Creates a filter on {@link range}
     * @param range 
     */
    export function set_filter(range: Range) {
        range.createFilter()
    }
}