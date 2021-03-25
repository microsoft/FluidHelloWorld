import { createGenericItem, getField, modifyItems } from "./utils";

let temporaryObject: any;

export function create(a: any) {
    if(a.data) {
        Object.keys(a.data).forEach(function(key) {
            let item = createGenericItem(a.data[key], temporaryObject, getField(a.id, 1), getField(a.id, 3));
            temporaryObject[getField(a.id, 1)].push(item);
            });
    } 
    return temporaryObject;
}


export function update(a: any) {
    if(a.data) {
        Object.keys(a.data).forEach(function(key) {
            modifyItems(a.data[key], temporaryObject, getField(a.id, 1), getField(a.id, 3));     
    });
} 
    return temporaryObject;
}

export function createTemporaryObject(value: any) {
    temporaryObject = value;
    return temporaryObject;
}



