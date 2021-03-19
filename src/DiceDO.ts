import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { DataObjectFactory } from "@fluidframework/aqueduct";

export class DiceRollerDO extends KeyValueDataObject {
    public static readonly factory = new DataObjectFactory(
        "keyvalue-dataobject",
        DiceRollerDO,
        [],
        {},
    );

    public RollDice() {
        this.set("dice", Math.floor(Math.random() * 6) + 1);
    }

    getDiceValue(): number {
        return this.get("dice") || 1
    }
}