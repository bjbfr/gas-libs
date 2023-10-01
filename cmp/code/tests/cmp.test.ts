/// <reference path="../cmp.ts"/>

interface CmpTestInput  {x:any,y:any,expected:boolean}
interface CmpTestOutput {input:{x:any,y:any},output:boolean,expected:boolean,result:boolean,i:number}

// Tests for Cmp
const test_data = [
    {x:1,y:1,expected:true},
    {x:1,y:2,expected:false},
    {x:true,y:true,expected:true},
    {x:true,y:false,expected:false},
    {x:[1,2,3],y:[1,2,3],expected:true},
    {x:['a','b','c'],y:['a','b','c'],expected:true},
    {x:[1,2,3,4],y:[1,2,3],expected:false},
    {x:[1,2,3],y:[1,3,2],expected:false},
    {x:[],y:[],expected:true},
    {x:"abc",y:"abc",expected:true},
    {x:"abc",y:"aBc",expected:false},
    {x:"  ",y:"",expected:false},
    {x:"",y:"",expected:true},
    {x:{a:1,b:2,c:3},y:{a:1,b:2,c:3},expected:true},
    {x:{a:1,b:2,c:3},y:{a:1,c:3,b:2},expected:true},
    {x:{a:1,b:2,c:3},y:{a:1,c:3},expected:false},
    {x:{a:1,c:3},y:{a:1,b:2,c:3},expected:false},
    {x:{a:1,b:2,c:3},y:{a:1,b:2,c:5},expected:false},
    {x:undefined,y:undefined,expected:true},
    {x:null,y:null,expected:true}
];

const OK_CHAR = '\u2713';
const KO_CHAR = '\u2718';
// tests execution here (default value for param)
function cmp_test(inputs: Array<CmpTestInput>=test_data){
  const l = inputs.length;
  let ret;
  if(l>0)
  {
    const exec_tests = inputs.map( ({x,y,expected},i) => {
      const output = Cmp.cmp(x,y);
      // const result = cmp === expected;
      // if(!result){
      //   console.error(`Cmp.cmp(${JSON.stringify(x)},${JSON.stringify(y)}) = ${cmp} Vs expected ${expected}.`)
      // }
      return {input:{x:x,y:y},output:output,expected:expected,result:output === expected,i:i};
    }) as Array<CmpTestOutput>;
  
    const results = exec_tests.filter(({result}) => !result);

    if(results.length === 0){
      const message = `${OK_CHAR} All ${l} tests passed.`;
      ret =  {message:message}
    }else{
      const message = `${KO_CHAR} ${results.length} tests out of ${l} failed:`;
      ret = {message:message,results:results.map(x => JSON.stringify(x))}
    }

  }else{
    ret =  {message:"No test defined."}
  }

  console.log(ret);
  return ret;
}

function cmp_test_all(){
  return cmp_test();
}
