/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ContainerSchema, ISharedMap, SharedMap } from "@fluid-experimental/fluid-framework";
import { FrsClient, FrsConnectionConfig, FrsContainerConfig, InsecureTokenProvider } from "@fluid-experimental/frs-client";
import { getContainerId } from "./utils";
import { vueRenderView as renderView } from "./view";

async function start() {

    const { id, isNew } = getContainerId();

    // This configures the FrsClient to use a local in-memory service called Tinylicious.
    // You can run Tinylicious locally using 'npx tinylicious'.
    const localConfig: FrsConnectionConfig = {
        tenantId: "local",
        tokenProvider: new InsecureTokenProvider("anyValue", { id: "userId" }),
        // if you're running Tinylicious on a non-default port, you'll need change these URLs
        orderer: "http://localhost:7070",
        storage: "http://localhost:7070",
    };

    // const frsAzUser = {
    //     userId: "Test User",
    //     userName: "test-user"
    // }

    // const prodConfig: FrsConnectionConfig = {
    //     tenantId: "",
	//     tokenProvider: new FrsAzFunctionTokenProvider("", frsAzUser),
	//     orderer: "",
    //     storage: "",
    // };

    const client = new FrsClient(localConfig);

    const containerConfig: FrsContainerConfig = { id };
    const containerSchema: ContainerSchema = {
        name: "hello-world-demo-container",
        initialObjects: { dice: SharedMap }
    };

    const { fluidContainer } = isNew
        ? await client.createContainer(containerConfig, containerSchema)
        : await client.getContainer(containerConfig, containerSchema)

    renderView(
        fluidContainer.initialObjects.dice as ISharedMap,
        document.getElementById("content") as HTMLDivElement
    );
}

start().catch((error) => console.error(error));
