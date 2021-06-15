/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import TinyliciousClient from '@fluid-experimental/tinylicious-client';
import { ISharedMap, SharedMap } from "@fluidframework/map";
import { getContainerId } from './utils';
import { vueRenderView as renderView } from './view';

TinyliciousClient.init();

const { id, isNew } = getContainerId();

async function start(): Promise<void> {

    const containerSchema = {
        name: 'hello-world-demo-container',
        initialObjects: { dice: SharedMap }
    };

    const [fluidContainer] = isNew
        ? await TinyliciousClient.createContainer({ id }, containerSchema)
        : await TinyliciousClient.getContainer({ id }, containerSchema);

    renderView(
        fluidContainer.initialObjects.dice as ISharedMap, 
        document.getElementById('content') as HTMLDivElement
    );
}

start().catch((error) => console.error(error));
