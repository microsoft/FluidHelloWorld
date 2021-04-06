import { createGenericItem, getField, modifyItems, isEmpty } from "./utils";

let temporaryObject: any;

export function create(a: any, keysToAdd: any) {
    if(!isEmpty(a.data)) {
        Object.keys(a.data).forEach(function(key) {
            let whereToAdd = getField(a.id, 1);
            let item = createGenericItem(a.data[key], temporaryObject, whereToAdd, keysToAdd);
            temporaryObject[whereToAdd].push(item);
            });
    } 
    return temporaryObject;
}


export function update(a: any, keysToAdd: any) {
    if(!isEmpty(a.data)) {
        Object.keys(a.data).forEach(function(key) {
            modifyItems(a.data[key], temporaryObject, getField(a.id, 1), getField(a.id, 5), keysToAdd);     
    });
} 
    return temporaryObject;
}

export function createTemporaryObject(value: any) {
    temporaryObject = value;
    return temporaryObject;
}


