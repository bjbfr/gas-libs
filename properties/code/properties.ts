namespace Properties {

    export enum PropertyType {
        Script,
        User,
        Document
    }

    function get_properties(propType: PropertyType) {

        if (propType === PropertyType.Script)
            return PropertiesService.getScriptProperties()
        if (propType === PropertyType.User)
            return PropertiesService.getUserProperties()
        if (propType === PropertyType.Document)
            return PropertiesService.getDocumentProperties()

        return null;
    }

    export function deleteAllProperties(propType: PropertyType = PropertyType.Script) {

        const props = get_properties(propType);
        if (props) {
            props.deleteAllProperties()
        }
    }

    export function deleteProperty(key: string, propType: PropertyType = PropertyType.Script) {

        const props = get_properties(propType);
        if (props) {
            props.deleteProperty(key);
        }
    }

    export function getKeys(propType: PropertyType = PropertyType.Script) {

        const props = get_properties(propType);
        if (props) {
            return props.getKeys();
        }
        return;
    }

    export function getProperties(propType: PropertyType = PropertyType.Script) {

        const props = get_properties(propType);
        if (props) {
            const raw_props = props.getProperties();
            return Object.entries(raw_props).reduce(
                (acc, [k, v]) => {
                    acc[k] = JSON.parse(v);
                    return acc;
                },
                {} as Obj_t
            )
        }
        return;
    }

    export function getProperty(key: string, propType: PropertyType = PropertyType.Script) {

        const props = get_properties(propType);
        if (props) {
            const raw_prop = props.getProperty(key);
            if (raw_prop)
                return JSON.parse(raw_prop);
        }
        return;
    }

    export function setProperties(properties: Obj_t, propType: PropertyType = PropertyType.Script) {

        const props = get_properties(propType);
        if(props){
            const str_props = Object.entries(properties).reduce(
                (acc,[k,v]) => {
                    acc[k] = JSON.stringify(v);
                    return acc;
                },
                {} as Obj_t
            );
            props.setProperties(str_props)
        }
    }
}