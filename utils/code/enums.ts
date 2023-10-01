///<reference path="./utils.ts">

namespace Utils {

    type EnumTypeString<TEnum extends string> = { [key in string]: TEnum | string; }

    type EnumTypeNumber<TEnum extends number> = { [key in string]: TEnum | number; } | { [key in number]: string; }

    type EnumType<TEnum extends string | number> = (TEnum extends string ? EnumTypeString<TEnum> : never) | (TEnum extends number ? EnumTypeNumber<TEnum> : never)

    type EnumOf<TEnumType> = TEnumType extends EnumType<infer U> ? U : never

    /**
     * Converts string to enum value
     * @param e 
     * @param x 
     * @returns 
     */
    export function fromString<TEnumType extends { [k: string]: string }>(e: TEnumType, x: string) {
        const entry = Object.entries(e).find(([_, v]) => x === v);
        if (entry)
            return entry[1] as EnumOf<TEnumType>;
        return;
    }
}