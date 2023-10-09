namespace Unittest {

  const OK_CHAR = '\u2713';
  const KO_CHAR = '\u2718';

  declare interface Input<T, V> { input: T, expected: V }

  export interface Output<T, V, W = undefined> { input: T | W, expected: V, i: number, output: V | undefined, result: Boolean, error: Error | undefined }
  // export interface Output { input: string, expected: string, i: number, output: string | undefined, result: Boolean, error: string | undefined }

  export interface Res<T, V, W = undefined> { message: string, results?: Array<Output<T, V, W>> }

  export function run<T, V, W = undefined>(label: string, data: Array<Input<T, V>>, fn: (input: T, i: number) => V, selector: ((input: T) => W) | undefined = undefined): Res<T, V, W> { //Array<Output> | undefined

    let ret;
    const l = data.length;
    if (l === 0) {
      ret = { message: "No test defined." }

    } else {

      const exec_tests = data.map(({ input, expected }, i) => {
        //test
        const input_view = selector ? selector(input) : input;
        try {
          const output = fn(input, i);
          const result = Cmp.cmp(expected, output);
          return { result: result, input: input_view, output: output, expected: expected, i: i, error: undefined };
        } catch (e: any) {
          console.log(e.stack)
          return { result: false, input: input_view, output: undefined, expected: expected, i: i, error: e };
        }
      });

      const results = exec_tests.filter(({ result }) => result === false);

      if (results.length > 0) {
        ret = {
          message: `${label}: ${KO_CHAR} ${results.length} out of ${l} tests failed:`,
          results: results
        };
      } else {
        ret = { message: `${label}: ${OK_CHAR} ${l} tests passed.` }
      }
    }

    // results.map(x => JSON.stringify(x,
    //   (key, value) => 
    //     key === 'error' && value !== undefined ? value.message : JSON.stringify(value)
    //   )
    // )

    // console.log(`${label}:\n${JSON.stringify(ret)}`);
    console.log(
      `${label}:\n${JSON.stringify(ret, (key, value) => key === 'error' && value !== undefined ? value.stack : value)}`
    );
    return ret;
  }

  export function run_all(funcNames: Array<string>) {

    return funcNames.map(funcName => {
      // @ts-ignore: no implicit any ignored with globalThis
      const f = globalThis[funcName];
      return f();
    });

  }
}

// .forEach(({ input, expected, i, output, error }) =>
//   console.error(
//     `${label}: test case #${i} failed: input:${input}
// - expected: ${expected}
// - output: ${output ? output : ""}
// ${error ? "(- Error: " + error + ")" : ""}`
//   )
// );
