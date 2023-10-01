import {test,expect} from 'vitest'
// @ts-ignore: use custom plugin to resolve this
import {Obj} from '../code/obj'

const data:Obj.Obj_t[] = [{'a':1,'b':2}];
const ts = [{keys:['a'],transform:(x:any)=>x}];

test("empty case - transforms",() => {
    expect(
        Obj.transform_key(data,[])
    ).toMatchObject([{}])
});
    
test("empty case - data",() => {
    const data:Obj.Obj_t[] = [];
    expect(
        Obj.transform_key(data,ts)
    ).toMatchObject(data)
});
        
test("null - transforms",() => {
    const ts = null;
    expect(
        Obj.transform_key(data,ts)
    ).toMatchObject(data)
});

test("undefined - transforms",() => {
    const ts = undefined;
    expect(
        Obj.transform_key(data,ts)
    ).toMatchObject(data)
});

test("null - data",() => {
    const data = null;
    expect(
        Obj.transform_key(data,ts)
    ).toStrictEqual(data)
});

test("undefined - data",() => {
    const data = undefined;
    expect(
        Obj.transform_key(data,ts)
    ).toStrictEqual(data)
});

test( "simple transform keys",() => {
    expect(
        Obj.transform_key(data,ts)
    ).toMatchObject([{'a':1}])
});

test( "simple transform keys - with regexp",() => {
    expect(
        Obj.transform_key(data,[{patterns:[/a/],transform:(x:string)=>x}])
    ).toMatchObject([{'a':1}])
});

test( "simple transform values",() => {
    expect(
        Obj.transform_value(data,[{keys:['a'],transform:(x:number)=>2*x}])
    ).toMatchObject([{'a':2}])
});

test( "transform values - with keys and patterns",() => {
    expect(
        Obj.transform_value(data,[{keys:['a'],transform:x=>2*x,patterns:[/b/]}])
    ).toMatchObject([{'a':2,'b':4}])
});
