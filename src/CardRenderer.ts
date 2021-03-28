import { IGenericDDS } from "./GenericDDS";
import { checklistDdsDefinition, checklistOm, checklistCardTemplate, editCardTemplate, checklistStrings } from "./checklist";
import * as ACData from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";
import { createTemporaryObject, create, update } from "./model";
import { aklogj } from "./MyLog";

/* AC-TODO:
    formatString like function.
    Localization of static strings.
*/

// @ts-ignore
export let ACFluid = {
    "DDS" : checklistDdsDefinition,
    "templates" : {
        "default" : "view",
        "view": checklistCardTemplate,
        "edit": editCardTemplate,
    },
    "strings" : checklistStrings
};

export function renderAdaptiveCard(dds: IGenericDDS, div: HTMLDivElement) {
    const wrapperDiv = document.createElement("div");
    // wrapperDiv.style.textAlign = "left";
    // wrapperDiv.style.verticalAlign = "middle";

    div.append(wrapperDiv);

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
    const updateAdaptiveCardView = async () => {
        let o = await dds.getValueObject();
        aklogj("modelChanged", o);
        textArea.textContent = JSON.stringify(o, null, "\t");

        o.checklistActive = true;
        o.strings = checklistOm.strings;

        cardDiv.innerHTML = '';
        let objectModel = o;

        let template = new ACData.Template(checklistCardTemplate);
        //template = new ACData.Template(editCardTemplate);
        // createTemporaryObject(o);
        //  let card = template.expand({ $root : o });
        createTemporaryObject(objectModel);
        let card = template.expand({ $root : objectModel });
        let ac = new AdaptiveCards.AdaptiveCard();
        ac.onExecuteAction = (a: any) => { 
            let newObj = null;
            if(a.id.startsWith("create")) {
                newObj = create(a);
                //card = template.expand({ $root : newObj });
                //updateAdaptiveCardView();
            } else if(a.id.startsWith("update")) {
                newObj = update(a);
                // card = template.expand({ $root : update(a) });
                // updateAdaptiveCardView();
            }
            let shallowCopy = Object.assign({}, newObj);
            delete shallowCopy.strings;
            aklogj("calling setValueObject: newObject", shallowCopy);
            dds.setValueObject(newObj);
        }
        ac.parse(card);
        let rc = ac.render();

        if (rc)
            cardDiv.appendChild(rc);
    };

    updateAdaptiveCardView();

    // Use the diceRolled event to trigger the rerender whenever the value changes.
    // diceRoller.on("diceRolled", updateDiceChar);
    dds.on("modelChanged", updateAdaptiveCardView);
}
