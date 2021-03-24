import { createGenericItem, modifyItems } from "./utils";

let temporaryObject: any;

// export function updateTemporaryObjectWithIncrementalChanges(a: any) {
//     if(a.id == "AddItem" && a.data.defaultInputId) {
//         let newElement = {
//             id: new Date().getTime().toString(),
//             status: false,
//             text: a.data.defaultInputId
//         };
//         temporaryObject.items.push(newElement);
//     } else if(a.id == "CompleteItem" && a.data.rows) {
//         let itemList =JSON.parse('[' + a.data.rows + ']')
//         for(let i =0; i< temporaryObject.items.length; i++) {
//             for(let j=0; j< itemList.length; j++) {
//                 if(temporaryObject.items[i].id == itemList[j].id) {
//                     temporaryObject.items[i].status = true;
//                 }
//             }
//         }

//     } else if(a.id == "DeleteItem") {
//         // do it later
//     }
//     return temporaryObject;
// }


//todo: fix this currently this function will not just add the input box elements but modified elements as well

export function create(a: any, cardTemplate: any) {
    if(a.id == "create" && a.data) {
        Object.keys(a.data).forEach(function(key) {
            let item = createGenericItem(key, a.data[key], cardTemplate);
            temporaryObject.items.push(item);
            });
    } 
    return temporaryObject;
}

//todo: fix it to work only for rows and not for the input box addTorows
//todo: check if update works better in case the id is already in the format a.b.c.d
//todo: combine create and update into 1 function later

export function update(a: any, cardTemplate: any) {
    if(a.id == "update" && a.data) {
        Object.keys(a.data).forEach(function(key) {
            modifyItems(key, a.data[key], temporaryObject, cardTemplate);     
    });
} 
    return temporaryObject;
}

export function createTemporaryObject(value: any) {
    temporaryObject = value;
    return temporaryObject;
}



