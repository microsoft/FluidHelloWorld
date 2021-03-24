import { constants } from "./constants";



export function createGenericItem(key: string, value: string, cardTemplate: any) {
    let path: string = getPath(key);
    let modifiedPath = path + ".choices.0.value";
    let data = deepFind(cardTemplate, modifiedPath);
    console.log(data);
    return createNewItem(data, value, path, getField(key));
}

export function modifyItems(key: string, value: any, temporaryObject: any, cardTemplate: any) {
    let itemList = JSON.parse('[' + value + ']');

    for(let i =0; i< temporaryObject.items.length; i++) {
        for(let j=0; j< itemList.length; j++) {
            if(temporaryObject.items[i].id == itemList[j].id) {
                temporaryObject.items[i]= updateExistingItem(itemList[j], temporaryObject.items[i]);
            }
        }
    }
}

function getPath(key: string): string {
    let paths = key.split('.');
   let str: string = "";
   for(let i =3; i< paths.length; i++) {
       if(i==3) {
    str = str + paths[i];
       } else {
        str = str + "."+ paths[i];
       }
   }
   return str;
}

export function getField(key: string) {
    let paths = key.split('.');
    return paths[1];
}


export function generateTimeStamp() {
    return new Date().getTime().toString();
}

function deepFind(obj: any, path: any) {
    let paths=path.split('.')
    for (let i=0, len=paths.length; i<len; i++){
        obj = obj[paths[i]];
    };
    return obj;
  }

function createNewItem(rawData: any, value: string, path: string, field: string) {
    let jsonData = JSON.parse(rawData);
    let newElement = jsonData;
    Object.keys(newElement).forEach(function(key){ newElement[key] = createValuesBasedOnKey(key, newElement[key], path, field, value) });
    return newElement;
}

function updateExistingItem(item: any, originalItem:any) {
    let newElement = item;
    Object.keys(newElement).forEach(function(key){ newElement[key] = modifyValuesBasedOnKey(key, newElement[key], originalItem) });
    return newElement;
}

function createValuesBasedOnKey(key: string, value: string, path: string, field: string, input: string) {
    if(key == "userId" || value == "$UserId") {
        return constants.userID;
    }
    else if(key=="timestamp" || value == "${Timestamp}") {
        return generateTimeStamp();
    } else if(key == "id" || value == "${id}") {
        return generateTimeStamp() + "." + path;
    } else if(typeof value == "boolean") {
        return false;
    } else if(key == field) {
        return input;
    }
    return value;
}

function modifyValuesBasedOnKey(key: string, value: string, originalItem: any) {
    if(key == "userId" || value == "$UserId") {
        return constants.userID;
    }
    else if(key=="timestamp" || value == "${Timestamp}") {
        return generateTimeStamp();
    } else if(typeof value == "boolean") {
        return value;
    }
    //Returning original values for text fields
    return deepFind(originalItem, key);
}

