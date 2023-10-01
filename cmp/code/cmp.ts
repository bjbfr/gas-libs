namespace Cmp{

    export function cmp(x:any,y:any){

        if(Typing.is_data_type(x) && Typing.is_data_type(y))
        {  
          // Logger.log('data type');
          return Object.is(x,y);
        }
        
        if(Typing.is_array(x) && Typing.is_array(y))
        {
          // Logger.log('array');
          return cmp_array(x,y);
        }
    
        if(Typing.is_object(x) && Typing.is_object(y))
        {
          // Logger.log('object');
          return cmp_object(x,y);
        }
    
        if(x === null && y === null)
        {
          // Logger.log('null');
          return true;
        }
    
        return false;
    }
    //'cmp_array' implicitly has return type 'any' because it does not have a return type annotation and 
    //is referenced directly or indirectly in one of its return expressions.ts(7023)
    // ==> annotation is needed
    function cmp_array(xs:unknown[],ys:unknown[]):boolean{
    
        // Logger.log(`xs:${JSON.stringify(xs)} ys:${JSON.stringify(ys)}`);
        if(xs.length !== ys.length)
            return false;
    
        return xs.every((x:unknown,i:number) => cmp(x,ys[i]));
    }
    //'cmp_object' implicitly has return type 'any' because it does not have a return type annotation 
    //and is referenced directly or indirectly in one of its return expressions.ts(7023)
    // ==> annotation is needed
    function cmp_object(x:Obj_t,y:Obj_t):boolean{
    
        const x_keys = Object.keys(x).sort();
        if( cmp_array(x_keys,Object.keys(y).sort()) === false )
            return false;
    
        return x_keys.every(k => cmp(x[k],y[k]));
    }

}