/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import ReactDOM from "react-dom";

export const reactRenderView = (data, elem) => {
    ReactDOM.render(<ReactView data={data} />, elem);
}

const ReactView = (props) => {
    const { data } = props;
    const [diceValue, setDiceValue] = React.useState(1);

    const diceCharacter = String.fromCodePoint(0x267F + diceValue);
    const rollDice = () => data.set("dice", Math.floor(Math.random() * 6) + 1);

    React.useEffect(() => {
        const syncLocalAndFluidState = () => setDiceValue(data.get("dice") || 1);
        syncLocalAndFluidState();
        data.on("valueChanged", syncLocalAndFluidState);
        return () => {
            data.off("valueChanged", syncLocalAndFluidState);
        };
    });
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 200, color: `hsl(${diceValue * 60}, 70%, 50%)` }}>
                {diceCharacter}
            </div>
            <button style={{ fontSize: 50 }} onClick={rollDice}>
                Roll
            </button>
        </div>
    );
};
