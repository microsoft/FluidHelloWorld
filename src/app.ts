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
    const service = new TinyliciousService();
    const fluidContainer = isNew ? await Fluid.createContainer(service, containerId, [DiceApp]) : await Fluid.getContainer(service, containerId, [DiceApp]);
    const diceApp: DiceApp = isNew ? await fluidContainer.createDataObject(DiceApp, 'kvpairId') : await fluidContainer.getDataObject('kvpairId');
    let content = document.getElementById('content');
    renderCard(diceApp, <HTMLElement>content);
    diceApp.on('changed', () => renderCard(diceApp, <HTMLElement>content));
}

async function renderCard(diceApp: DiceApp, container: HTMLElement) {
    let adaptiveCard = await diceApp.GetCard();
    adaptiveCard.onExecuteAction = async (action) => await diceApp.onAction(<AdaptiveCardAction>(<SubmitAction>action).data);
    container.firstChild?.remove();
    container.appendChild(adaptiveCard.render() ?? new HTMLElement());
}

start().catch((error) => console.error(error));
