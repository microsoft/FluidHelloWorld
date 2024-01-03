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

const root = document.getElementById("content");

const createNewDice = async () => {
	const { container } = await client.createContainer(containerSchema);
	// Initialize the SharedTree Data Structure
	const diceTree = container.initialObjects.diceTree.schematize(treeConfiguration);
	const id = await container.attach();
	renderDiceRoller(diceTree, root);
	return id;
};

const loadExistingDice = async (id) => {
	const { container } = await client.getContainer(id, containerSchema);
	// Initialize the SharedTree Data Structure
	const diceTree = container.initialObjects.diceTree.schematize(treeConfiguration);
	renderDiceRoller(diceTree, root);
};

async function start() {
	if (location.hash) {
		await loadExistingDice(location.hash.substring(1));
	} else {
		const id = await createNewDice();
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

const renderDiceRoller = (diceTree, elem) => {
	elem.appendChild(template.content.cloneNode(true));

	const rollButton = elem.querySelector(".roll");
	const dice = elem.querySelector(".dice");

	// Set the value at our dataKey with a random number between 1 and 6.
	rollButton.onclick = () => {
		diceTree.root.value = (diceValueKey, Math.floor(Math.random() * 6) + 1);
	};

	// Get the current value of the shared data to update the view whenever it changes.
	const updateDice = () => {
		// Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
		dice.textContent = String.fromCodePoint(0x267f + diceTree.root.value);
		dice.style.color = `hsl(${diceTree.root.value * 60}, 70%, 30%)`;
	};
	updateDice();

	// Use the changed event to trigger the rerender whenever the value changes.
	Tree.on(diceTree.root, "afterChange", () => updateDice());
	// Setting "fluidStarted" is just for our test automation
	window["fluidStarted"] = true;
};
