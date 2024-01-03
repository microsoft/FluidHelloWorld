/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SharedTree, TreeConfiguration, SchemaFactory, Tree } from "fluid-framework";
import { AzureClient } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-runtime-utils";

export const diceValueKey = "dice-value-key";

// Load container and render the app

const localConnectionConfig = {
	type: "local",
	tokenProvider: new InsecureTokenProvider("VALUE_NOT_USED", { name: "test user" }),
	endpoint: "http://localhost:7070",
};

const client = new AzureClient({ connection: localConnectionConfig });

const containerSchema = {
	initialObjects: { diceTree: SharedTree },
};

const sf = new SchemaFactory("fluidHelloWorldSample"); // The string passed to the Schema factory should be unique

export class Dice extends sf.object("Dice", {
	value: sf.number,
}) {}

export const treeConfiguration = new TreeConfiguration(
	Dice,
	() =>
		new Dice({
			value: 1,
		}),
);

const content = document.getElementById("content");

export const loadFluidData = async (containerId, containerSchema) => {
	// Get or create the document depending if we are running through the create new flow
	if (containerId.length === 0) {
		// The client will create a new detached container using the schema
		// A detached container will enable the app to modify the container before attaching it to the client
		return await client.createContainer(containerSchema);
	} else {
		// Use the unique container ID to fetch the container created earlier. It will already be connected to the
		// collaboration session.
		return await client.getContainer(containerId, containerSchema);
	}
};

async function start() {
	const { container } = await loadFluidData(location.hash.substring(1), containerSchema);
	const diceTree = container.initialObjects.diceTree.schematize(treeConfiguration);
	renderDiceRoller(diceTree.root, content);
	if (!location.hash) {
		const id = await container.attach();
		location.hash = id;
	}
}

start().catch((error) => console.error(error));

// Define the view
const template = document.createElement("template");

template.innerHTML = `
  <style>
    .wrapper { text-align: center }
    .dice { font-size: 200px }
    .roll { font-size: 50px;}
  </style>
  <div class="wrapper">
    <div class="dice"></div>
    <button class="roll"> Roll </button>
  </div>
`;

const renderDiceRoller = (diceRoot, elem) => {
	elem.appendChild(template.content.cloneNode(true));

	const rollButton = elem.querySelector(".roll");
	const dice = elem.querySelector(".dice");

	// Set the value at our dataKey with a random number between 1 and 6.
	rollButton.onclick = () => {
		diceRoot.value = (diceValueKey, Math.floor(Math.random() * 6) + 1);
	};

	// Get the current value of the shared data to update the view whenever it changes.
	const updateDice = () => {
		// Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
		dice.textContent = String.fromCodePoint(0x267f + diceRoot.value);
		dice.style.color = `hsl(${diceRoot.value * 60}, 70%, 30%)`;
	};
	updateDice();

	// Use the changed event to trigger the rerender whenever the value changes.
	Tree.on(diceRoot, "afterChange", () => updateDice());
	// Setting "fluidStarted" is just for our test automation
	window["fluidStarted"] = true;
};
