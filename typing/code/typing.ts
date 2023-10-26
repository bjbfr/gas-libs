namespace Typing {

    export function is_data_type(v:any){
        return ['number','string','boolean','bigint','symbol','undefined'].indexOf(typeof v) !== -1
    }
    //
    export function is_array(v:any) {
        // return (!!v) && (v.constructor === Array);
        return Array.isArray(v)
    }
    //
    export function is_object(v:any){
        return (!!v) && (`${v.constructor}` === 'function Object() { [native code] }');
    }
    
    export function is_date(v:any){
        return (!!v && (Object.prototype.toString.call(v) === '[object Date]'))
    }
}