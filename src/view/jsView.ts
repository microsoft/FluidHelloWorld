/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { DiceRollerDO } from "../DiceDO";

/**
 * Render Dice into a given HTMLElement as a text character, with a button to roll it.
 * @param dataObject - The Data Object to be rendered
 * @param div - The HTMLElement to render into
 */
export function jsRenderView(dataObject: DiceRollerDO, div: HTMLDivElement) {

    const wrapperDiv = document.createElement('div');
    wrapperDiv.style.textAlign = 'center';
    div.append(wrapperDiv);

    const diceCharDiv = document.createElement('div');
    diceCharDiv.style.fontSize = '200px';

    const rollButton = document.createElement('button');
    rollButton.style.fontSize = '50px';
    rollButton.textContent = 'Roll';
    // Set the value at our dataKey with a random number between 1 and 6.
    rollButton.addEventListener('click', () =>
        dataObject.RollDice()
    );

    wrapperDiv.append(diceCharDiv, rollButton);

    // Get the current value of the shared data to update the view whenever it changes.
    const updateDiceChar = () => {
        const diceValue = dataObject.getDiceValue();
        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        diceCharDiv.textContent = String.fromCodePoint(0x267f + (diceValue as number));
        diceCharDiv.style.color = `hsl(${diceValue * 60}, 70%, 50%)`;
    };
    updateDiceChar();

    // Use the changed event to trigger the rerender whenever the value changes.
    dataObject.on('changed', updateDiceChar);
}
