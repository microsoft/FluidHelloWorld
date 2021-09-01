/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export const jsRenderView = (diceMap, elem) => {
    const dataKey = 'value';

    const wrapperDiv = document.createElement('div');
    wrapperDiv.style.textAlign = 'center';
    elem.append(wrapperDiv);

    const dice = document.createElement('div');
    dice.style.fontSize = '200px';

    const rollButton = document.createElement('button');
    rollButton.style.fontSize = '50px';
    rollButton.textContent = 'Roll';
    // Set the value at our dataKey with a random number between 1 and 6.
    rollButton.onclick = () => diceMap.set("value", Math.floor(Math.random() * 6)+1);

    wrapperDiv.append(dice, rollButton);

    // Get the current value of the shared data to update the view whenever it changes.
    const updateDice = () => {
        const diceValue = diceMap.get(dataKey);
        console.log(diceValue)
        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        dice.textContent = String.fromCodePoint(0x267f + diceValue);
        dice.style.color = `hsl(${diceValue * 60}, 70%, 50%)`;
    };
    updateDice();

    // Use the changed event to trigger the rerender whenever the value changes.
    diceMap.on('valueChanged', updateDice);
}
