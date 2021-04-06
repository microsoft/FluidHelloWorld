import { IGenericDDS } from "./GenericDDS";
import { checklistDdsDefinition, checklistOm, checklistCardTemplate, editCardTemplate, checklistStrings } from "./checklist";
import * as ACData from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";
import { createTemporaryObject, create, update } from "./model";
import { aklogj } from "./MyLog";
import { executeDDSExpr } from "./DDSFunctions";
import { getToBeAddedPath, deepFind, getField } from "./utils";
import { pollCardTemplate, pollDdsDefinition, pollInitData, pollStrings } from "./poll";

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

export let ACFluidPoll = {
    "DDS" : pollDdsDefinition,
    "templates" : {
        "default" : "view",
        "view" : pollCardTemplate,        
    },
    "strings" : pollStrings,
    initData : pollInitData
}

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

        cardDiv.innerHTML = '';
        let objectModel = o;

        let appTemplate = dds.getAppTemplate();

        o.strings = appTemplate.strings;
        let templateJson = appTemplate.templates[ appTemplate.templates.default ];
        let template = new ACData.Template(templateJson);
        //template = new ACData.Template(editCardTemplate);
        // createTemporaryObject(o);
        //  let card = template.expand({ $root : o });
        createTemporaryObject(objectModel);
        let card = template.expand({ $root : objectModel });
        let ac = new AdaptiveCards.AdaptiveCard();
        ac.onExecuteAction = (a: any) => { 
            let newObj = null;
            if(a.id.startsWith("create")) {
                if ('command' in a.data) {
                    executeDDSExpr(a.data.command);
                    return;
                }
                else {
                    newObj = create(a, deepFind(ACFluid.DDS.keys, getToBeAddedPath(a.id)));
                }
                //card = template.expand({ $root : newObj });
                //updateAdaptiveCardView();
            } else if(a.id.startsWith("update")) {
                if ('command' in a.data) {
                    executeDDSExpr(a.data.command);
                    return;
                }
                newObj = update(a, deepFind(ACFluid.DDS.keys, getToBeAddedPath(a.id)));
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
