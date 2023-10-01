namespace Obj{
  
    export function has_key(obj:Obj_t,key:Key_t){
      return Object.keys(obj).indexOf(key) !== -1;
    }
  
    export function get_key_value(obj:Obj_t,key:Key_t){
      if (has_key(obj,key))
      {
        return obj[key];
      }
      return;
    }
  
    export function pick_keys(obj:Obj_t,keys:Keys_t){
      return keys.reduce((acc:Obj_t,key) => {
        acc[key] = obj[key];
        return acc;
      },{});
    }
  
    export function transform_key(
      data:Obj_t[]|Unset_t,
      ts:Transform_t<TransformerKey_t>[]|Unset_t,
      keep_all=false)
    {
      return transform_(data,ts,keep_all,"key")
    }
  
    export function transform_value(
      data:Obj_t[]|Unset_t,
      ts:Transform_t<TransformerValue_t>[]|Unset_t,
      keep_all=false)
    {
      return transform_(data,ts,keep_all,"value")
    }
  
    export function exclude_keys(obj:Obj_t,exclude:Keys_t){
      return pick_keys(
        obj,
        Object.keys(obj).filter( key => exclude.indexOf(key) === -1)
      );
    }
  
    type TransformerKey_t   = (k:Key_t,v?:Value_t,obj?:Obj_t,data?:Obj_t[],i?:number) => Key_t;
    type TransformerValue_t = (v:Value_t,k?:Key_t,obj?:Obj_t,data?:Obj_t[],i?:number) => any;
    type Transformer_t      = TransformerKey_t | TransformerValue_t;
  
  
      export interface Transform_t<Transformer extends Transformer_t>{
      keys?: Keys_t,
      patterns?: RegExp[],
      transform: Transformer
    }
  
    function find_transform_<Transformer extends Transformer_t>(
      ts:Transform_t<Transformer>[]|Unset_t,
      k:Key_t)
    {
      if(!ts) return;
  
      const tmp = ts.find( ({keys,patterns}) => {
              let keys_b = false,patterns_b = false;
              if(keys)
                  keys_b = keys.indexOf(k) !== -1;
                  
              if(patterns)
                  patterns_b = patterns.some(pattern => pattern.test(k));
  
              return keys_b || patterns_b;
          });
  
      if(tmp)
          return tmp.transform;
      
      return tmp;
  
    }
  
    function transform_<Transformer extends Transformer_t>(
      data:Obj_t[]|Unset_t,
      ts:Transform_t<Transformer>[]|Unset_t,
      keep_all:Boolean,type:"key"|"value"
      )
    {
      
      if(!data || data.length === 0) return data;
      
      if(!ts) return data;
      
      const id = (x:any) => x;
  
      const keys_transforms = Object.keys(data[0]).reduce((acc,k) => {
          let transform = find_transform_(ts,k);
          if(transform)
              acc.set(k,transform);
          else if(keep_all)
              acc.set(k,id);
          return acc;
      },new Map<Key_t,any>());
      
      let init :[Key_t,Value_t][] = [];
      return data.map(
          (obj,i) =>  Object.fromEntries(
                          Object.entries(obj).reduce(
                              (acc,[k,v]) => {
                                const transform = keys_transforms.get(k);
                                if(transform){
                                    if(type === 'key')
                                      acc.push([transform(k,v,obj,data,i),v])
  
                                    if(type === 'value')
                                      acc.push([k,transform(v,k,obj,data,i)])
                                  }
                                  return acc;
                              },init)
                      )
      );
  }
  
  } // namespace Obj