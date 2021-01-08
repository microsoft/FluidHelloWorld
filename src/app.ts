/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { getTinyliciousContainer } from '@fluidframework/get-tinylicious-container';

import { IKeyValueDataObject, ContainerRuntimeFactory } from './kvpair-dataobject';
import { jsRenderView as renderView } from './view';

let createNew = false;
if (location.hash.length === 0) {
    createNew = true;
    location.hash = Date.now().toString();
}
const documentId = location.hash.substring(1);

async function start(): Promise<void> {
    // Get Fluid Container (creates if new url)
    const container = await getTinyliciousContainer(documentId, ContainerRuntimeFactory, createNew);

    // The KeyValue DataObject can be requested from the root of the container
    const response = await container.request({ url: '/' });

    // Verify the response to make sure we got what we expected.
    if (response.status === 200) {
        renderView(
            response.value as IKeyValueDataObject,
            document.getElementById('content') as HTMLDivElement
        );
    } else {
        throw new Error(`Error Loading`);
    }
}

start().catch((error) => console.error(error));
