import { constants } from "./constants";



export function createGenericItem(value: any, temporaryObject: any, toBeAddedField: string, basedOnField: string) {
    return createNewItem(value, temporaryObject[toBeAddedField], basedOnField);
}

export function modifyItems(value: any, temporaryObject: any, toBeModifiedField: string, basedOnField: string, structure: any) {
    let itemList = JSON.parse('[' + value + ']');
    for(let i =0; i< itemList.length; i++) {
        //replace if exists, create otherwise
        let element = createOrUpdateItem(itemList[i], temporaryObject[basedOnField], structure);
        let valChanged = false;
        if(deepFind(temporaryObject, toBeModifiedField)) {
            Object.keys(temporaryObject[toBeModifiedField]).forEach(function(key) { 
                let currentElement = temporaryObject[toBeModifiedField][key];
                if(currentElement.id == element.id) {
                        temporaryObject[toBeModifiedField][key] = element;
                        valChanged = true;
                }
            });

            if(!valChanged) {
                temporaryObject[toBeModifiedField].push(element);
            }
        }
    }
}

export function isEmpty(obj: any) {
   return obj // 👈 null and undefined check
&& Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function getField(key: string, index: number) {
    let paths = key.split('.');
    return paths[index];
}

// export function getToBeAddedPath(key: string) {
//     return key.substring("create.items.basedOn.".length);
// }

export function getToBeAddedPath(key: string) {
    let paths = key.split('.');
    let result = paths[1];
    for(let i =2; i< 4; i++) {
    result = result + "." + paths[i];
    }
    return result;
}

export function generateTimeStamp() {
    return new Date().getTime().toString();
}

export function deepFind(obj: any, path: any) {
    let paths=path.split('.')
    for (let i=0, len=paths.length; i<len; i++){
        obj = obj[paths[i]];
    };
    return obj;
  }

function createNewItem(value: any, toBeAddedField: any, basedOnField: any) {
    if(toBeAddedField[0]) {
        toBeAddedField = toBeAddedField[0];
    }
    let newElement = Object.assign({}, basedOnField);
    Object.keys(basedOnField).forEach(function(key){ newElement[key] = createValuesBasedOnKey(key, basedOnField[key], value) });
    return newElement;
}

function createOrUpdateItem(item: any, originalItem:any, toBeChangedItem: any) {
    if(toBeChangedItem[0]) {
        toBeChangedItem = toBeChangedItem[0];
    }
    let newElement = Object.assign({}, toBeChangedItem);
    Object.keys(toBeChangedItem).forEach(function(key){ newElement[key] = modifyValuesBasedOnKey(key, toBeChangedItem[key], item, originalItem) });
    return newElement;
}

function createValuesBasedOnKey(key: string, oldValue: any, value: any) {
    if(key == "userId" || value == "$UserId") {
        return constants.userID;
    }
    else if(key=="timestamp" || value == "${Timestamp}") {
        return generateTimeStamp();
    } else if(key == "id" || value == "${id}") {
        return generateTimeStamp();
    } else if(oldValue.type == "boolean" ) {
        return oldValue.default;
    }
    return value;
}

function modifyValuesBasedOnKey(key: string, value: string, changedItem: any, originalItem: any) {
    if(key == "userId" || value == "$UserId") {
        return constants.userID;
    }
    else if(key=="timestamp" || value == "${timestamp}") {
        return generateTimeStamp();
    } else if(key=="displayName" || value == "${displayName}") {
        return constants.displayName;
    } else if(deepFind(changedItem, key)) {
        return deepFind(changedItem, key);
    }
    //Returning original values for text fields
    return deepFind(originalItem, key);
}

