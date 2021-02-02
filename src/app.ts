/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    IKeyValueDataObject,
    KeyValueInstantiationFactory,
} from '@fluid-experimental/data-objects';
import { Fluid, getContainerId } from './utils';
import { jsRenderView as renderView } from './view';

const { containerId, isNew } = getContainerId();

async function start(): Promise<void> {
    let keyValueDataObject: IKeyValueDataObject;

    if (isNew) {
        const fluidDocument = await Fluid.createContainer(containerId, [
            KeyValueInstantiationFactory,
        ]);
        keyValueDataObject = await fluidDocument.createDataObject(
            KeyValueInstantiationFactory.type,
            'dice'
        );
    } else {
        const fluidDocument = await Fluid.getContainer(containerId, [KeyValueInstantiationFactory]);
        keyValueDataObject = await fluidDocument.getDataObject('dice');
    }

    renderView(keyValueDataObject, document.getElementById('content') as HTMLDivElement);
}

start().catch((error) => console.error(error));
