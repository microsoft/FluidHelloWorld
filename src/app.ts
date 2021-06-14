/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISharedMap, SharedMap } from "@fluid-experimental/fluid-framework";
import type { ContainerSchema } from '@fluid-experimental/fluid-static';
import TinyliciousClient from '@fluid-experimental/tinylicious-client';
import { getContainerId } from './utils';
import { vueRenderView as renderView } from './view';

TinyliciousClient.init();

const { id, isNew } = getContainerId();

async function start() {
    const serviceConfig = { id };

    const containerSchema: ContainerSchema = {
        name: 'hello-world-demo-container',
        initialObjects: { dice: SharedMap }
    };

    const [fluidContainer] = isNew
        ? await TinyliciousClient.createContainer(serviceConfig, containerSchema)
        : await TinyliciousClient.getContainer(serviceConfig, containerSchema);

    renderView(
        fluidContainer.initialObjects.dice as ISharedMap,
        document.getElementById('content') as HTMLDivElement
    );

    // returned initialObjects are live Fluid data structures
    return fluidContainer.initialObjects;
}

start().catch((error) => console.error(error));
