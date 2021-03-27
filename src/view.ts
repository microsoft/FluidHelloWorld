/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDiceRoller } from "./dataObject";
import * as ACData from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";

/* AC-TODO:
    formatString like function.
    Localization of static strings.
*/

let cardTemplate = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [{
                "id": "expiry",
                "type": "TextBlock",
                "$when": "${not(equals(checklistActive, true))}",
                "_$when.comment": "When Checklist is closed show this message",
                "text": "${strings.ChecklistClosed}",
                "color": "attention",
                "size": "small",
                "wrap": true
            },
            {
                "id": "Title",
                "type": "TextBlock",
                "text": "${title}",
                "_$text.comment": "Show Checklist title",
                "size": "large",
                "maxLines": 3,
                "wrap": true,
                "weight": "bolder",
                "spacing": "small"
            },
            /*
            {
                "id": "Count",
                "type": "TextBlock",
                "$when": "${greater(count(items),0)}",
                "_$when.comment": "Show when any ACTIVE or COMPLETED items are present in the checklist",
                "text": "${formatString(strings.ManyItemsCompleted,count(where(items,x,x.status == true)),count(items))}",
                "_$text.comment": "Show how many items are open or ACTIVE out of total items on checklist",
                "size": "small",
                "maxLines": 3,
                "wrap": true,
                "weight": "bolder",
                "spacing": "small"
            },
            */
            {
                "id": "NoItem",
                "type": "TextBlock",
                "$when": "${equals(count(items),0)}",
                "_$when.comment":"When Checklist has no item in ACTIVE or COMPLETED state, or when checklist is empty",
                "text": "${strings.NoItem}",
                "size": "small",
                "maxLines": 3,
                "wrap": true,
                "weight": "bolder",
                "spacing": "small"
            },
            {
                "id": "OpenItems",
                "type": "TextBlock",
                "$when": "${and(equals(checklistActive, true),greater(count(where(items, x,x.status == false)),0))}",
                "_$when.comment":"When checklist is active and count of open or ACTIVE elements is greater than 0, show 'Open Items' message",
                "text": "${strings.OpenItems}",
                "size": "small",
                "maxLines": 3,
                "wrap": true,
                "spacing": "small"
            },
            {
                "id": "NoOpenItems",
                "type": "TextBlock",
                "$when": "${and(and(equals(checklistActive, true),equals(count(where(items, x,x.status == false)),0)),greater(count(where(items, x,x.status == true)),0))}",
                "_$when.comment":"When checklist is active and there is no ACTIVE item also all items have status as COMPLETED, show 'No Open Items' message",
                "text": "${strings.NoOpenItems}",
                "size": "small",
                "maxLines": 3,
                "wrap": true,
                "spacing": "small"
            },
            {
                "type": "Container",
                "style": "emphasis",
                "$when": "${and(equals(checklistActive, true),greater(count(where(items, x,x.status == false)),0))}",
                "_$when.comment":"When Checklist is active and count of open or ACTIVE items is greater than 0 then, show this container.",
                "items": [{
                    "id": "rows",
                    "type": "Input.ChoiceSet",
                    "style": "expanded",
                    "isMultiSelect": true,
                    "choices": [{
                        "$data": "${subArray(sortBy(where(items, x, x.status == false), 'createTime'), 0, min(10, count(where(items, x, x.status == false))))}",
                        "$when": "${equals(status, false)}",
                        "title": "${text}",
                        "value": '{"id":"${id}","columnValues":{"status":true,"completionTime":"${Timestamp}","completionUser":"$UserId","latestEditTime":"$Timestamp","latestEditUser":"$UserId"}}'
                    }]
                }]
            },
            /*{
                "id": "LastModified",
                "type": "TextBlock",
                "$when": "${and(equals(checklistActive, true),greater(count(items),0))}",
                "_$when.comment": "When Checklist is active and there are greater than 0 items",
                "text": "${if(and(equals(count(where(items, x, x.columnValues['latestEditUser'] == '')),count(items)),equals(count(where(items, x,x.columnValues['status'] == 'ACTIVE')),count(items))),strings.BeTheFirstOneToRespond,formatString(strings.LastUpdatedBy, lastResponder[0].displayName))}",
                "_text.comment": "If no items have latestEditUser set and all the items' status are ACTIVE show 'BeTheFirstOneToRespond', else show 'LastUpdatedBy' message",
                "size": "small",
                "weight": "bolder",
                "maxLines": 2,
                "wrap": true,
                "spacing": "small"
            }*/
        ],
        "actions": [{
                "id": "RespondButton",
                "$when": "${and(equals(checklistActive, true),greater(count(where(items, x,x.status == false)),0))}",
                "_$when.comment": "When Checklist is active and count of ACTIVE or open items is greater than 0 in that case, show the 'Save Changes' button.",
                "title": "${strings.Submit}",
                //"command": "SubmitCustomActionitems"
                type: 'Action.Submit'
            },
            
            {
                "id": "EditButton",
                "title": "${if(equals(checklistActive, true),if(greater(count(items),0),strings.EditChecklist,strings.AddItem),strings.Edit)}",
                "_$title.comment": "If Checklist is active and there are items in it show 'Edit Checklist' button, else show 'Add Item' button if checklist is empty.If checklist is closed, show 'View Checklist' button.",
                //"command": "LaunchActionPackageView",
                type: 'Action.Submit',
                "parameters": {
                    "viewName": "UpdateView"
                }

            }
        ]
    };

let editCardTemplate = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [{
            "id": "expiry",
            "type": "TextBlock",
            "$when": "${not(equals(checklistActive, true))}",
            "_$when.comment": "When Checklist is closed show this message",
            "text": "${strings.ChecklistClosed}",
            "color": "attention",
            "size": "small",
            "wrap": true
        },
        {
            "id": "Title",
            "label" : "Checklist Title:",
            "type": "Input.Text",
            "style": "text",
            "value": "${title}",
            "_$text.comment": "${title}",
        },
        /*
        {
            "id": "Count",
            "type": "TextBlock",
            "$when": "${greater(count(items),0)}",
            "_$when.comment": "Show when any ACTIVE or COMPLETED items are present in the checklist",
            "text": "${formatString(strings.ManyItemsCompleted,count(where(items,x,x.status == true)),count(items))}",
            "_$text.comment": "Show how many items are open or ACTIVE out of total items on checklist",
            "size": "small",
            "maxLines": 3,
            "wrap": true,
            "weight": "bolder",
            "spacing": "small"
        },
        */
        {
            "id": "NoItem",
            "type": "TextBlock",
            "$when": "${equals(count(items),0)}",
            "_$when.comment":"When Checklist has no item in ACTIVE or COMPLETED state, or when checklist is empty",
            "text": "${strings.NoItem}",
            "size": "small",
            "maxLines": 3,
            "wrap": true,
            "weight": "bolder",
            "spacing": "small"
        },
        {
            "id": "OpenItems",
            "type": "TextBlock",
            "$when": "${and(equals(checklistActive, true),greater(count(where(items, x,x.status == false)),0))}",
            "_$when.comment":"When checklist is active and count of open or ACTIVE elements is greater than 0, show 'Open Items' message",
            "text": "${strings.OpenItems}",
            "size": "small",
            "maxLines": 3,
            "wrap": true,
            "spacing": "small"
        },
        {
            "id": "NoOpenItems",
            "type": "TextBlock",
            "$when": "${and(and(equals(checklistActive, true),equals(count(where(items, x,x.status == false)),0)),greater(count(where(items, x,x.status == true)),0))}",
            "_$when.comment":"When checklist is active and there is no ACTIVE item also all items have status as COMPLETED, show 'No Open Items' message",
            "text": "${strings.NoOpenItems}",
            "size": "small",
            "maxLines": 3,
            "wrap": true,
            "spacing": "small"
        },
        {
            "type": "Container",
            "style": "emphasis",
            "$when": "${and(equals(checklistActive, true),greater(count(where(items, x,x.status == false)),0))}",
            "_$when.comment":"When Checklist is active and count of open or ACTIVE items is greater than 0 then, show this container.",
            "items": [{
                "id": "rows",
                "type": "Input.ChoiceSet",
                "style": "expanded",
                "isMultiSelect": true,
                "choices": [{
                    "$data": "${subArray(sortBy(where(items, x, x.status == false), 'createTime'), 0, min(10, count(where(items, x, x.status == false))))}",
                    "$when": "${equals(status, false)}",
                    "title": "${text}",
                    "value": '{"id":"${id}","columnValues":{"status":true,"completionTime":"${Timestamp}","completionUser":"$UserId","latestEditTime":"$Timestamp","latestEditUser":"$UserId"}}'
                }]
            }]
        },
        /*{
            "id": "LastModified",
            "type": "TextBlock",
            "$when": "${and(equals(checklistActive, true),greater(count(items),0))}",
            "_$when.comment": "When Checklist is active and there are greater than 0 items",
            "text": "${if(and(equals(count(where(items, x, x.columnValues['latestEditUser'] == '')),count(items)),equals(count(where(items, x,x.columnValues['status'] == 'ACTIVE')),count(items))),strings.BeTheFirstOneToRespond,formatString(strings.LastUpdatedBy, lastResponder[0].displayName))}",
            "_text.comment": "If no items have latestEditUser set and all the items' status are ACTIVE show 'BeTheFirstOneToRespond', else show 'LastUpdatedBy' message",
            "size": "small",
            "weight": "bolder",
            "maxLines": 2,
            "wrap": true,
            "spacing": "small"
        }*/
    ],
    "actions": [{
            "id": "RespondButton",
            "$when": "${and(equals(checklistActive, true),greater(count(where(items, x,x.status == false)),0))}",
            "_$when.comment": "When Checklist is active and count of ACTIVE or open items is greater than 0 in that case, show the 'Save Changes' button.",
            "title": "${strings.Submit}",
            //"command": "SubmitCustomActionitems"
            type: 'Action.Submit'
        },
        
        {
            "id": "EditButton",
            "title": "${if(equals(checklistActive, true),if(greater(count(items),0),strings.EditChecklist,strings.AddItem),strings.Edit)}",
            "_$title.comment": "If Checklist is active and there are items in it show 'Edit Checklist' button, else show 'Add Item' button if checklist is empty.If checklist is closed, show 'View Checklist' button.",
            //"command": "LaunchActionPackageView",
            type: 'Action.Submit',
            "parameters": {
                "viewName": "UpdateView"
            }

        }
    ]
};

let om = {
    checklistActive: true,
    title: 'Checklist c1',
    items: [ 
        {
            id: 0,
            Timestamp: 'abc',
            status: false,
            text: 'c1 item 0'            
        }, 
        {
            id: 1,
            status: false,
            text: 'c1 item 2'
        }
    ],
    "strings" : {
        "NameYourChecklist": "Name your checklist",
        "AddRow": "Add Item",
        "DeleteRow": "Mark for delete",
        "UndoDeleteRow": "Unmark",
        "SendChecklist": "Send Checklist",
        "SaveChanges": "Save Changes",
        "DownloadReport": "Download Report",
        "CompletedBy": "Completed by {0} on {1}",
        "ChangeDate": "Change Date",
        "CloseChecklist": "Close Checklist",
        "DeleteChecklist": "Delete Checklist",
        "Open": "Open items ({0})",
        "Completed": "Completed items ({0})",
        "Deleted": "Deleted",
        "Cancel": "Cancel",
        "Confirm": "Confirm",
        "Change": "Change",
        "CloseAlertDialogMessage": "Are you sure you want to close this checklist?",
        "CloseAndSaveAlertDialogMessage": "Are you sure you want to save changes and close this checklist?",
        "DeleteAlertDialogMessage": "Are you sure you want to delete this checklist?",
        "BlankTitleError": "Title cannot be left blank",
        "ChecklistClosed": "Checklist Closed",
        "ChecklistExpired": "Checklist Expired",
        "SelectADate": "Select a Date...",
        "SelectATime": "Select a Time...",
        "notifyMeOnceADay": "Notify me once a day",
        "notifyMeNever": "Notify me never",
        "notifyMeOnEveryUpdate": "Notify me on each update",
        "multipleResponses": "Allow multiple responses",
        "notifications": "Notify me",
        "notificationsNever": "Never",
        "notificationsAsResponsesAsReceived": "On each update",
        "notificationsEverydayAt": "Once a day",
        "responseOptions": "Response Options",
        "resultsVisibleTo": "Results visible to",
        "resultsVisibleToAll": "Everyone",
        "resultsVisibleToSender": "Only Me",
        "datePickerPlaceholder": "Select a Date...",
        "timePickerPlaceholder": "Select a Time...",
        "Back": "Back",
        "Settings": "Settings",
        "SomethingWentWrong": "Something went wrong",
        "MoreOptions": "More Options",
        "GotIt": "Got it",
        "ChatLieErrorText": "Send a message to get this conversation started, and then come back to Checklist",
        "DismissMenu": "Dismiss Menu",
        "Next": "Next",
        "SavingChanges": "Saving Changes",
        "Saved": "Saved",
        "Failed": "Failed",
        "GenericError": "There was a problem reaching this app. Please try after sometime.",
        "ChecklistDeletedError": "This checklist has been deleted.",
        "ChecklistDeletedErrorDescription": "This checklist is no more relevant and deleted by the creator.",
        "ChecklistResult": "Checklist Result - {0}",
        "Close": "Close",
        "EmptyRowAriaPlaceHolder": "Blank item",
        "DeleteItem": "Delete Item",
        "DialogTalkback": "{0} dialogue. {1}",
        "MeetingErrorText": "Sorry, Checklist is not available in a meeting conversation yet",
        "Meeting_X_ErrorText": "Sorry, Checklist is not available in a meeting that has more than {0} participants",
        "Creator": "Creator",
        "ChecklistDeleted": "This checklist has been deleted",
        "ChecklistSent": "**{0}** sent a Checklist",
        "OneResponse": "1 response",
        "Responses": "{0} responses",
        "OneItemCompleted": "{0} of 1 item completed",
        "ManyItemsCompleted": "{0} of {1} items completed",
        "NoOpenItems": "No open items",
        "OpenItems": "Open items",
        "MoreItems": "and {0} more items",
        "MoreItem": "and 1 more item",
        "Submit": "Save Changes",
        "Edit": "View Checklist",
        "EditChecklist": "Edit Checklist",
        "AddItem": "Add Item",
        "LastUpdatedBy": "Last updated by {0}",
        "NoItem": "No item in checklist",
        "BeTheFirstOneToRespond": "Be the first one to complete an item",
        "CreateNewChecklist": "Create a new checklist",
        "ResultsTitle": "View Checklist",
        "ResponseNotificationWithName": "{0} updated your checklist",
        "ResponseNotificationWithCount": "{0} +{1} updated your checklist",
        "ResultNotificationAllCompleted": "All items completed",
        "ResultNotificationPendingItems": "{0}/{1} items completed",
        "ResultNotificationPendingItem": "{0}/1 item completed",
        "AdaptiveCardFallbackTextForMW": "Go back to the main window to view this checklist",
        "$manifest.description": "Create a shared checklist",
        "$manifest.name": "Checklist",
        "$manifest.activities.activityTypes[0].description": "Someone updates your checklist",
        "$manifest.activities.activityTypes[1].description": "Daily digest of item completion status",
        "$manifest.activities.activityTypes[2].description": "On checklist completion",
        "$manifest.msTeamsProps.name.full": "Checklist",
        "$manifest.msTeamsProps.name.short": "Checklist",
        "$manifest.msTeamsProps.description.full": "Collaborate with your team by creating a shared checklist in a chat or channel.​ Find the app in \"…\" under the message compose box​. Name your checklist, enter items, and you're good to go. Keep track of open items right from chat​. Add/delete/edit/complete items and manage checklist through an immersive experience",
        "$manifest.msTeamsProps.description.short": "Create a shared checklist",
        "$manifest.views.LaunchView.header": "Create Checklist"
    }
};

let ddsDefinition = 
{
	"type": "SharedMap",
	"keys": {
		"title": {
            type : "string",
            default : "<< Checklist Title >>"
        },
		"items": {
			type: "SharedObjectSequence",
			itemType: {
				"type": "SharedMap",
				"keys" : {
					"status" : { 
                        type: "boolean",
                        default: false
                    },
					"text" : { 
                        type: "string",
                        default: "<< Checklist Item >>"
                    }
				}
			}
		}		
	}
};

let checklistStrings =  {
    "NameYourChecklist": "Name your checklist",
    "AddRow": "Add Item",
    "DeleteRow": "Mark for delete",
    "UndoDeleteRow": "Unmark",
    "SendChecklist": "Send Checklist",
    "SaveChanges": "Save Changes",
    "DownloadReport": "Download Report",
    "CompletedBy": "Completed by {0} on {1}",
    "ChangeDate": "Change Date",
    "CloseChecklist": "Close Checklist",
    "DeleteChecklist": "Delete Checklist",
    "Open": "Open items ({0})",
    "Completed": "Completed items ({0})",
    "Deleted": "Deleted",
    "Cancel": "Cancel",
    "Confirm": "Confirm",
    "Change": "Change",
    "CloseAlertDialogMessage": "Are you sure you want to close this checklist?",
    "CloseAndSaveAlertDialogMessage": "Are you sure you want to save changes and close this checklist?",
    "DeleteAlertDialogMessage": "Are you sure you want to delete this checklist?",
    "BlankTitleError": "Title cannot be left blank",
    "ChecklistClosed": "Checklist Closed",
    "ChecklistExpired": "Checklist Expired",
    "SelectADate": "Select a Date...",
    "SelectATime": "Select a Time...",
    "notifyMeOnceADay": "Notify me once a day",
    "notifyMeNever": "Notify me never",
    "notifyMeOnEveryUpdate": "Notify me on each update",
    "multipleResponses": "Allow multiple responses",
    "notifications": "Notify me",
    "notificationsNever": "Never",
    "notificationsAsResponsesAsReceived": "On each update",
    "notificationsEverydayAt": "Once a day",
    "responseOptions": "Response Options",
    "resultsVisibleTo": "Results visible to",
    "resultsVisibleToAll": "Everyone",
    "resultsVisibleToSender": "Only Me",
    "datePickerPlaceholder": "Select a Date...",
    "timePickerPlaceholder": "Select a Time...",
    "Back": "Back",
    "Settings": "Settings",
    "SomethingWentWrong": "Something went wrong",
    "MoreOptions": "More Options",
    "GotIt": "Got it",
    "ChatLieErrorText": "Send a message to get this conversation started, and then come back to Checklist",
    "DismissMenu": "Dismiss Menu",
    "Next": "Next",
    "SavingChanges": "Saving Changes",
    "Saved": "Saved",
    "Failed": "Failed",
    "GenericError": "There was a problem reaching this app. Please try after sometime.",
    "ChecklistDeletedError": "This checklist has been deleted.",
    "ChecklistDeletedErrorDescription": "This checklist is no more relevant and deleted by the creator.",
    "ChecklistResult": "Checklist Result - {0}",
    "Close": "Close",
    "EmptyRowAriaPlaceHolder": "Blank item",
    "DeleteItem": "Delete Item",
    "DialogTalkback": "{0} dialogue. {1}",
    "MeetingErrorText": "Sorry, Checklist is not available in a meeting conversation yet",
    "Meeting_X_ErrorText": "Sorry, Checklist is not available in a meeting that has more than {0} participants",
    "Creator": "Creator",
    "ChecklistDeleted": "This checklist has been deleted",
    "ChecklistSent": "**{0}** sent a Checklist",
    "OneResponse": "1 response",
    "Responses": "{0} responses",
    "OneItemCompleted": "{0} of 1 item completed",
    "ManyItemsCompleted": "{0} of {1} items completed",
    "NoOpenItems": "No open items",
    "OpenItems": "Open items",
    "MoreItems": "and {0} more items",
    "MoreItem": "and 1 more item",
    "Submit": "Save Changes",
    "Edit": "View Checklist",
    "EditChecklist": "Edit Checklist",
    "AddItem": "Add Item",
    "LastUpdatedBy": "Last updated by {0}",
    "NoItem": "No item in checklist",
    "BeTheFirstOneToRespond": "Be the first one to complete an item",
    "CreateNewChecklist": "Create a new checklist",
    "ResultsTitle": "View Checklist",
    "ResponseNotificationWithName": "{0} updated your checklist",
    "ResponseNotificationWithCount": "{0} +{1} updated your checklist",
    "ResultNotificationAllCompleted": "All items completed",
    "ResultNotificationPendingItems": "{0}/{1} items completed",
    "ResultNotificationPendingItem": "{0}/1 item completed",
    "AdaptiveCardFallbackTextForMW": "Go back to the main window to view this checklist",
    "$manifest.description": "Create a shared checklist",
    "$manifest.name": "Checklist",
    "$manifest.activities.activityTypes[0].description": "Someone updates your checklist",
    "$manifest.activities.activityTypes[1].description": "Daily digest of item completion status",
    "$manifest.activities.activityTypes[2].description": "On checklist completion",
    "$manifest.msTeamsProps.name.full": "Checklist",
    "$manifest.msTeamsProps.name.short": "Checklist",
    "$manifest.msTeamsProps.description.full": "Collaborate with your team by creating a shared checklist in a chat or channel.​ Find the app in \"…\" under the message compose box​. Name your checklist, enter items, and you're good to go. Keep track of open items right from chat​. Add/delete/edit/complete items and manage checklist through an immersive experience",
    "$manifest.msTeamsProps.description.short": "Create a shared checklist",
    "$manifest.views.LaunchView.header": "Create Checklist"
};

export let ACFluid = {
    "DDS" : ddsDefinition,
    "templates" : {
        "default" : "view",
        "view": cardTemplate,
        "edit": editCardTemplate,
    },
    "strings" : checklistStrings
};

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
        o.strings = om.strings;
        cardDiv.innerHTML = '';

        let template = new ACData.Template(cardTemplate);
        //template = new ACData.Template(editCardTemplate);
        let card = template.expand({ $root : o });
        let ac = new AdaptiveCards.AdaptiveCard();
        ac.onExecuteAction = (a: any) => { 
            console.log(JSON.stringify(a.data.rows, null, "\t")); 
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
