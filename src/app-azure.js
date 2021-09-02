/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SharedMap } from "fluid-framework";
import { AzureClient, InsecureTokenProvider } from "@fluidframework/azure-client";
import { jsRenderView as renderDiceRoller } from "./view";

// This configures the AzureClient to use a local in-memory service called Tinylicious.
// You can run Tinylicious locally using 'npx tinylicious'.
const localConfig = {
    tenantId: "local",
    tokenProvider: new InsecureTokenProvider("anyValue", { id: "userId" }),
    // if you're running Tinylicious on a non-default port, you'll need change these URLs
    orderer: "http://localhost:7070",
    storage: "http://localhost:7070",
};

// This configures the AzureClient to use a remote Azure Fluid Service instance.
// const azureUser = {
//     userId: "Test User",
//     userName: "test-user"
// }

// const prodConfig: AzureConnectionConfig = {
//     tenantId: "",
//     tokenProvider: new AzureFunctionTokenProvider("", azureUser),
//     orderer: "",
//     storage: "",
// };

const client = new AzureClient(localConfig);
const containerConfig = {
    initialObjects: { diceMap: SharedMap }
};
const root = document.getElementById("content");

const createNewDice = async () => {
    const { container } = await client.createContainer(containerConfig);
    container.initialObjects.diceMap.set("value", 1);
    const id = container.attach();
    renderDiceRoller(container.initialObjects.diceMap, root);
    return id;
}

const loadExistingDice = async (id) => {
    const { container } = await client.getContainer(id, containerConfig);
    renderDiceRoller(container.initialObjects.diceMap, root);
}

async function start() {
    if (location.hash) {
        await loadExistingDice(location.hash.substring(1))
    } else {
        const id = await createNewDice();
        location.hash = id;
    }
}

start().catch((error) => console.error(error));
