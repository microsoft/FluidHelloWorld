/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { TinyliciousService } from "@fluid-experimental/get-container";

import { Fluid } from '@fluid-experimental/fluid-static';
import { getContainerId } from './utils';
import { jsRenderView as renderView } from './view';

const { containerId, isNew } = getContainerId();

async function start(): Promise<void> {
    const service = new TinyliciousService();
    
    const fluidContainer = isNew
        ? await Fluid.createContainer(service, containerId, [KeyValueDataObject])
        : await Fluid.getContainer(service, containerId, [KeyValueDataObject]);

    const keyValueDataObject: KeyValueDataObject = isNew
        ? await fluidContainer.createDataObject(KeyValueDataObject, 'kvpairId')
        : await fluidContainer.getDataObject('kvpairId');

    renderView(keyValueDataObject, document.getElementById('content') as HTMLDivElement);
}

start().catch((error) => console.error(error));
