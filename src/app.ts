/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TinyliciousService } from "@fluid-experimental/get-container";
import { Fluid } from '@fluid-experimental/fluid-static';
import { getContainerId } from './utils/getContainerId';
import { DiceApp } from "./DiceApp";
import { AdaptiveCardAction } from "./card";
import { SubmitAction } from "adaptivecards";

const { containerId, isNew } = getContainerId();

async function start(): Promise<any> {
    // create fluid service reference
    const service = new TinyliciousService();

    // create or get the dice app
    const fluidContainer = isNew ? await Fluid.createContainer(service, containerId, [DiceApp]) : await Fluid.getContainer(service, containerId, [DiceApp]);
    const diceApp: DiceApp = isNew ? await fluidContainer.createDataObject(DiceApp, 'kvpairId') : await fluidContainer.getDataObject('kvpairId');

    // get the div we are going to render the card to
    let content = document.getElementById('content');

    // render the intial card for diceApp
    updateDiv(diceApp, <HTMLElement>content);

    // when diceApp changes, render the updated card.
    diceApp.on('changed', () => updateDiv(diceApp, <HTMLElement>content));
}

async function updateDiv(diceApp: DiceApp, container: HTMLElement) {
    // get the current card for the app
    let adaptiveCard = await diceApp.GetCard();

    // hook up action handler 
    adaptiveCard.onExecuteAction = async (action) => await diceApp.onAction(<AdaptiveCardAction>(<SubmitAction>action).data);

    // convert the card to an htmlelement, and update the content of the container div 
    let element = adaptiveCard.render() ?? new HTMLElement();
    container.firstChild?.remove();
    container.appendChild(element);
}

start().catch((error) => console.error(error));
