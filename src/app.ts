/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ContainerSchema, ISharedMap, SharedMap } from "@fluid-experimental/fluid-framework";
import { FrsClient, FrsConnectionConfig, FrsContainerConfig, InsecureTokenProvider } from "@fluid-experimental/frs-client";
import { getContainerId } from "./utils";
import { vueRenderView as renderView } from "./view";

const { id, isNew } = getContainerId();

const config: FrsConnectionConfig = {
    tenantId: "local",
    tokenProvider: new InsecureTokenProvider("tenantId", { id: "userId" }),
    orderer: "http://localhost:7070",
    storage: "http://localhost:7070",
};

const client = new FrsClient(config);

async function start() {

    const containerConfig: FrsContainerConfig = { id };

    const containerSchema: ContainerSchema = {
        name: "hello-world-demo-container",
        initialObjects: { dice: SharedMap }
    };

    const { fluidContainer } = isNew
        ? await client.createContainer(containerConfig, containerSchema)
        : await client.getContainer(containerConfig, containerSchema);

    renderView(
        fluidContainer.initialObjects.dice as ISharedMap,
        document.getElementById("content") as HTMLDivElement
    );
}

start().catch((error) => console.error(error));
