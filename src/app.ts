/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Fluid, IKeyValueDataObject, KeyValueInstantiationFactory } from './kvpair-dataobject';
import { jsRenderView as renderView } from './view';

let createNew = false;
if (location.hash.length === 0) {
    createNew = true;
    location.hash = Date.now().toString();
}
const documentId = location.hash.substring(1);

async function start(): Promise<void> {
    let keyValueDataObject: IKeyValueDataObject;

    if (createNew) {
        const fluidDocument = await Fluid.createDocument(documentId);
        keyValueDataObject = await fluidDocument.createDataObject(
            KeyValueInstantiationFactory.type,
            'dice'
        );
    } else {
        const fluidDocument = await Fluid.getDocument(documentId);
        keyValueDataObject = await fluidDocument.getDataObject('dice');
    }

    renderView(keyValueDataObject, document.getElementById('content') as HTMLDivElement);
}

start().catch((error) => console.error(error));
