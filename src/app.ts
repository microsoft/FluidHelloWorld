/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Fluid, IKeyValueDataObject, KeyValueInstantiationFactory } from './kvpair-dataobject';
import { getDocId } from './utils';
import { jsRenderView as renderView } from './view';

const { docId, isNew } = getDocId();

async function start(): Promise<void> {
    let keyValueDataObject: IKeyValueDataObject;

    if (isNew) {
        const fluidDocument = await Fluid.createDocument(docId);
        keyValueDataObject = await fluidDocument.createDataObject(
            KeyValueInstantiationFactory.type,
            'dice'
        );
    } else {
        const fluidDocument = await Fluid.getDocument(docId);
        keyValueDataObject = await fluidDocument.getDataObject('dice');
    }

    renderView(keyValueDataObject, document.getElementById('content') as HTMLDivElement);
}

start().catch((error) => console.error(error));
