/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SharedMap, SharedNumberSequence } from "fluid-framework";
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
        diceSequence: SharedNumberSequence,
    },
};

// Log message as HTML to 'log' div element
const log = (message) => {
    if (!message) {
        message = "NULL";
    }
    const root = document.getElementById("content");
    const logElement = root.querySelector(".log");
    if (logElement) {
      const currentTime = (new Date()).toLocaleTimeString();
      logElement.innerHTML += `<br/>${currentTime}: ${message}`;
      logElement.scrollTop = logElement.scrollHeight; // scroll to bottom
    }
};

// Log message as HTML to 'log' div element
const clearLog = () => {
    const root = document.getElementById("content");
    const logElement = root.querySelector(".log");
    logElement.innerHTML = "";
};

// Record the dice value both as single latest value, and in the sequence of values
const recordDiceValue = (container, value) => {
    // The latest dice value
    container.initialObjects.diceMap.set(diceValueKey, value);

    // Update simplistic array of dice values
    let diceValues = container.initialObjects.diceMap.get(diceValuesKey);
    if (!diceValues) {
        diceValues = [value];
    } else {
        diceValues.push(value);
    }
    container.initialObjects.diceMap.set(diceValuesKey, diceValues);

    // Update sequence of dice values
    if (!container.initialObjects.diceSequence) {
        log("Initial creation of dice sequence");
        try {
          container.initialObjects.diceSequence = SharedNumberSequence.create(
              container.runtime,
              "dice-sequence"
          );
        } catch (e) {
            log(`Error creating dice sequence: ${e}`);
        }
    }
    const diceValuesCount = container.initialObjects.diceSequence.getItemCount();
    container.initialObjects.diceSequence.insert(diceValuesCount, [value]);
    //log(`Dice value ${value} recorded in sequence`);
};

// Clear the recorded sequence of dice values
const clearDiceValues = (container) => {
    // Clear the array of dice values
    container.initialObjects.diceMap.set(diceValuesKey, []);

    // Clear the dice sequence
    const diceValuesCount = container.initialObjects.diceSequence.getItemCount();
    container.initialObjects.diceSequence.remove(0, diceValuesCount);
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

const getDiceValuesSequenceAsText = (container) => {
  const diceSequence = container.initialObjects.diceSequence;
  if (!diceSequence) {
    return "diceSequence does not exist";
  }

  const diceValuesCount = container.initialObjects.diceSequence.getItemCount();
  if (diceValuesCount === 0) {
    return "0 dice values in sequence";
  }

  const diceValues = container.initialObjects.diceSequence.getItems(0, diceValuesCount);
  if (!diceValues) {
      return "dice values can't be retrieved";
  } else {
      const diceValuesAsText = diceValues.map((value) => value.toString()).join(" ");
      return diceValuesAsText;
  }
};

const root = document.getElementById("content");

const createNewDice = async () => {
    const { container } = await client.createContainer(containerSchema);
        log(`You initially rolled a 1`);
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
    .redraw { font-size: 50px;}
    .logContainer { font-size: 24px; border: 3px solid black; padding: 10px; margin: 10px; text-align: left; height: 400px; overflow: scroll; }
  </style>
  <div class="wrapper">
    <div class="dice"></div>
    <div class="dicevaluesContainer">
      <strong>DICE VALUES SIMPLISTIC</strong><hr/>
      <div class="dicevalues"></div>
    </div>
    <div class="dicevaluesContainer">
      <strong>DICE VALUES SEQUENCE</strong><hr/>
      <div class="dicevaluesSequence"></div>
    </div>
    <button class="roll"> Roll </button>
    <button class="clear"> Clear dice values </button>
    <button class="redraw"> Redraw UI </button>
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
    const redrawButton = elem.querySelector(".redraw");

    const dice = elem.querySelector(".dice");
    const dicevaluesElement = elem.querySelector(".dicevalues");
    const dicevaluesSequenceElement = elem.querySelector(".dicevaluesSequence");

    // Set the value at our dataKey with a random number between 1 and 6.
    rollButton.onclick = () => {
        const value = Math.floor(Math.random() * 6) + 1;
        log(`You rolled a ${value}`);
        recordDiceValue(container, value);
    };

    // Clear the recorded values
    clearButton.onclick = () => {
        clearDiceValues(container);
        clearLog();
    };

    redrawButton.onclick = () => {
      updateDice();
    };

    // Get the current value of the shared data to update the view whenever it changes.
    const updateDice = () => {
        const diceValue = getDiceValue(container);
        const diceValuesAsText = getDiceValuesAsText(container);
        const diceValuesSequenceAsText = getDiceValuesSequenceAsText(container);

        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        dice.textContent = String.fromCodePoint(0x267f + diceValue);
        dice.style.color = `hsl(${diceValue * 60}, 70%, 30%)`;

        dicevaluesElement.textContent = diceValuesAsText;
        dicevaluesSequenceElement.textContent = diceValuesSequenceAsText;
    };
    updateDice();

    // Use the changed event to trigger the rerender whenever the value changes.
    container.initialObjects.diceMap.on("valueChanged", () => {
      // log("diceMap: valueChanged");
      updateDice(); 
    });

    // valueChanged events occur on SharedMap
    container.initialObjects.diceSequence.on("valueChanged", (e) => {
      // log("diceSequence: valueChanged: " + JSON.stringify(e));
      updateDice();
    });

    // sequenceDelta events occur on SharedSequence
    container.initialObjects.diceSequence.on("sequenceDelta", (e) => {
      // log("diceSequence: sequenceDelta: " + JSON.stringify(e));
      updateDice();
    });

    // op event occurs on SharedSequence as well
    // container.initialObjects.diceSequence.on("op", (e) => {
    //   // log("diceSequence: op: " + JSON.stringify(e));
    //   updateDice();
    // });
};
