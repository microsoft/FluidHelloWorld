/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SharedMap } from "fluid-framework";
import { AzureClient, LOCAL_MODE_TENANT_ID } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";

// The config is set to run against a local service by default. Run `npx tinylicious` to run locally
// Update the corresponding properties below with your tenant specific information to run against your tenant.
const serviceConfig = {
    connection: {
        tenantId: LOCAL_MODE_TENANT_ID, // REPLACE WITH YOUR TENANT ID
        tokenProvider: new InsecureTokenProvider("" /* REPLACE WITH YOUR PRIMARY KEY */, {
            id: "userId",
        }),
        orderer: "http://localhost:7070", // REPLACE WITH YOUR ORDERER ENDPOINT
        storage: "http://localhost:7070", // REPLACE WITH YOUR STORAGE ENDPOINT
    },
};

const client = new AzureClient(serviceConfig);

const diceValueKey = "dice-value-key";
const diceValuesKey = "dice-values-key";

const containerSchema = {
    initialObjects: {
        diceMap: SharedMap,
    },
};

// Log message as HTML to 'log' div element
const log = (message) => {
    const root = document.getElementById("content");
    const logElement = root.querySelector(".log");
    logElement.innerHTML += "<br/>" + message;
};

// Log message as HTML to 'log' div element
const clearLog = () => {
    const root = document.getElementById("content");
    const logElement = root.querySelector(".log");
    logElement.innerHTML = "";
};

// Record the dice value both as single latest value, and in the sequence of values
const recordDiceValue = (container, value) => {
    container.initialObjects.diceMap.set(diceValueKey, value);
    let diceValues = container.initialObjects.diceMap.get(diceValuesKey);
    if (!diceValues) {
        diceValues = [value];
    } else {
        diceValues.push(value);
    }
    container.initialObjects.diceMap.set(diceValuesKey, diceValues);
};

// Clear the recorded sequence of dice values
const clearDiceValues = (container) => {
    container.initialObjects.diceMap.set(diceValuesKey, []);
};

const getDiceValue = (container) => {
    return container.initialObjects.diceMap.get(diceValueKey);
};

const getDiceValuesAsText = (container) => {
    const diceValues = container.initialObjects.diceMap.get(diceValuesKey);
    if (!diceValues) {
        return "<no values yet>";
    } else {
        const diceValuesAsText = diceValues.map((value) => value.toString()).join(" ");
        return diceValuesAsText;
    }
};

const root = document.getElementById("content");

const createNewDice = async () => {
    const { container } = await client.createContainer(containerSchema);
    recordDiceValue(container, 1);
    const id = await container.attach();
    renderDiceRoller(container, root);

    return id;
};

const loadExistingDice = async (id) => {
    const { container } = await client.getContainer(id, containerSchema);
    renderDiceRoller(container, root);
};

async function start() {
    if (location.hash) {
        await loadExistingDice(location.hash.substring(1));
    } else {
        const id = await createNewDice();
        location.hash = id;
        log(`New dice created with id ${id}`);
    }
}

start().catch((error) => console.error(error));

// Define the view

const template = document.createElement("template");

template.innerHTML = `
  <style>
    .wrapper { text-align: center }
    .dice { font-size: 200px }
    .dicevaluesContainer { font-size: 24px; border: 3px solid black; padding: 10px; margin: 10px; }
    .roll { font-size: 50px;}
    .clear { font-size: 50px;}
    .logContainer { font-size: 24px; border: 3px solid black; padding: 10px; margin: 10px }
  </style>
  <div class="wrapper">
    <div class="dice"></div>
    <div class="dicevaluesContainer">
      <strong>DICE VALUES</strong><hr/>
      <div class="dicevalues"></div>
    </div>
    <button class="roll"> Roll </button>
    <button class="clear"> Clear dice values </button>
    <div class="logContainer">
      <strong>LOCAL LOG OUTPUT</strong><hr/>
      <div class="log"></div>
    </div>
  </div>
`;

const renderDiceRoller = (container, elem) => {
    elem.appendChild(template.content.cloneNode(true));

    const rollButton = elem.querySelector(".roll");
    const clearButton = elem.querySelector(".clear");
    const dice = elem.querySelector(".dice");
    const dicevaluesElement = elem.querySelector(".dicevalues");

    // Set the value at our dataKey with a random number between 1 and 6.
    rollButton.onclick = () => {
        const value = Math.floor(Math.random() * 6) + 1;
        recordDiceValue(container, value);
        log(`You rolled a ${value}`);
    };

    // Clear the recorded values
    clearButton.onclick = () => {
        clearDiceValues(container);
        clearLog();
    };

    // Get the current value of the shared data to update the view whenever it changes.
    const updateDice = () => {
        const diceValue = getDiceValue(container);
        const diceValuesAsText = getDiceValuesAsText(container);

        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        dice.textContent = String.fromCodePoint(0x267f + diceValue);
        dice.style.color = `hsl(${diceValue * 60}, 70%, 30%)`;

        dicevaluesElement.textContent = diceValuesAsText;
    };
    updateDice();

    // Use the changed event to trigger the rerender whenever the value changes.
    container.initialObjects.diceMap.on("valueChanged", updateDice);
};
