import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { DataObjectFactory } from "@fluidframework/aqueduct";
import { AdaptiveCard, Image, HorizontalAlignment, TextBlock, TextSize, TextWeight, Size, SubmitAction} from 'adaptivecards';
import { ActionContentType, AdaptiveCardAction } from './card';

export class DiceApp extends KeyValueDataObject {
    public static readonly factory = new DataObjectFactory("keyvalue-dataobject", DiceApp, [], {},);

    // roll the dice
    public RollDice() {
        this.set("diceValue", Math.floor(Math.random() * 6) + 1);
    }

    // get the current dice value
    public get DiceValue(): number {
        return this.get("diceValue") || 1
    }

    // get current diceApp as an adaptive card
    public async GetCard(): Promise<AdaptiveCard> {
        let ac = new AdaptiveCard();
        let tb = new TextBlock("Super Deluxe Dice Roller");
        tb.size = TextSize.ExtraLarge;
        tb.weight = TextWeight.Bolder;
        tb.horizontalAlignment = HorizontalAlignment.Center;
        ac.addItem(tb);
        let img = new Image();
        // img.id = model.id;
        switch (this.DiceValue) {
            case 1:
                img.url = "https://upload.wikimedia.org/wikipedia/commons/1/1b/Dice-1-b.svg";
                break;
            case 2:
                img.url = "https://upload.wikimedia.org/wikipedia/commons/5/5f/Dice-2-b.svg";
                break;
            case 3:
                img.url = "https://upload.wikimedia.org/wikipedia/commons/b/b1/Dice-3-b.svg";
                break;
            case 4:
                img.url = "https://upload.wikimedia.org/wikipedia/commons/f/fd/Dice-4-b.svg";
                break;
            case 5:
                img.url = "https://upload.wikimedia.org/wikipedia/commons/0/08/Dice-5-b.svg";
                break;
            case 6:
                img.url = "https://upload.wikimedia.org/wikipedia/commons/2/26/Dice-6-b.svg";
                break;
        }
        img.size = Size.Large;
        img.backgroundColor = "white";
        img.horizontalAlignment = HorizontalAlignment.Center;
        ac.addItem(img);

        let action = new SubmitAction();
        action.title = "Roll";
        action.data = {
            type: ActionContentType,
            id: this.runtime.documentId,
            verb: "roll",
            // data: model
        };
        ac.addAction(action);
        let json = JSON.stringify(ac);
        console.log(json);
        return ac;
    }

    // handle onAction callbacks
    public async onAction(action: AdaptiveCardAction): Promise<AdaptiveCard> {
        switch (action.verb) {
            case "show":
                return await this.GetCard();

            case "roll":
                this.RollDice();
                return await this.GetCard();
        }
        throw Error(`Unknown action ${action.verb}`);
        // return null;
    }
}