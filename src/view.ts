/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDiceRoller } from "./dataObject";
import * as ACData from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";
import { createTemporaryObject, create, update } from "./model";
//import { pollDdsDefinition, pollOm, pollCardTemplate } from "./poll";
import { checklistDdsDefinition, checklistOm, checklistCardTemplate, editCardTemplate, checklistStrings } from "./checklist";
import { getToBeAddedPath, deepFind } from "./utils";
import { ACFluid } from "./CardRenderer";



/**
 * Render an IDiceRoller into a given div as a text character, with a button to roll it.
 * @param diceRoller - The Data Object to be rendered
 * @param div - The div to render into
 */
export function renderDiceRoller(diceRoller: IDiceRoller, div: HTMLDivElement) {
    const wrapperDiv = document.createElement("div");
    // wrapperDiv.style.textAlign = "left";
    // wrapperDiv.style.verticalAlign = "middle";

    div.append(wrapperDiv);

    const diceCharDiv = document.createElement("div");
    diceCharDiv.style.fontSize = "100px";
    diceCharDiv.style.textAlign = "left";
    diceCharDiv.style.verticalAlign = "middle";
    diceCharDiv.style.display = "inline";

    const rollButton = document.createElement("button");
    rollButton.style.fontSize = "25 px";
    rollButton.textContent = "Roll";
    // Call the roll method to modify the shared data when the button is clicked.
    rollButton.addEventListener("click", diceRoller.roll);

    wrapperDiv.append(diceCharDiv, rollButton);

    const cardDiv = document.createElement("div");
    cardDiv.style.width = "450px";
    cardDiv.style.display = "inline-block";
    cardDiv.style.verticalAlign = "middle";
    cardDiv.style.border = "black";
    cardDiv.style.borderStyle = "solid";
    cardDiv.style.borderWidth = "1px";
    wrapperDiv.append(cardDiv);

    const textArea = document.createElement("textarea");
    textArea.rows = 20;
    textArea.cols = 80;
    textArea.textContent = "Hello";
    textArea.style.verticalAlign = "middle";
    wrapperDiv.append(textArea);



    // Get the current value of the shared data to update the view whenever it changes.
    const updateDiceChar = async () => {
        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        diceCharDiv.textContent = String.fromCodePoint(0x267F + diceRoller.value);
        diceCharDiv.style.color = `hsl(${diceRoller.value * 60}, 70%, 50%)`;
        let o = await diceRoller.valueObject();
        o.checklistActive = true;
        o.strings = checklistOm.strings;
        cardDiv.innerHTML = '';

        let template = new ACData.Template(checklistCardTemplate);
        //template = new ACData.Template(editCardTemplate);
        // createTemporaryObject(o);
        //  let card = template.expand({ $root : o });
        createTemporaryObject(checklistOm);
        let card = template.expand({ $root : checklistOm });
        let ac = new AdaptiveCards.AdaptiveCard();
        ac.onExecuteAction = (a: any) => { 
            if(a.id.startsWith("create")) {
                card = template.expand({ $root : create(a, deepFind(ACFluid.DDS.keys, getToBeAddedPath(a.id))) });
                updateDiceChar();
            } else if(a.id.startsWith("update")) {
                card = template.expand({ $root : update(a) });
                updateDiceChar();
            }
        }
        ac.parse(card);
        let rc = ac.render();

        if (rc)
            cardDiv.appendChild(rc);

        let model = JSON.stringify(o, null, "\t");
        textArea.textContent = model;
        console.log("Model updated:");
    };

    updateDiceChar();

    // Use the diceRolled event to trigger the rerender whenever the value changes.
    // diceRoller.on("diceRolled", updateDiceChar);
    diceRoller.on("modelChanged", updateDiceChar);
}
