/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { TinyliciousService } from "@fluid-experimental/get-container";
import { Fluid } from '@fluid-experimental/fluid-static';
import { DiceApp } from "./DiceApp";
import * as restify from 'restify';
// require('dotenv').config();
import { ActivityTypes, BotFrameworkAdapter, StatusCodes, WebRequest, WebResponse } from 'botbuilder';
import { ActionContentType, AdaptiveCardAction, AdaptiveCardContentType } from './card';

// Create HTTP server.
const adapter = new BotFrameworkAdapter({ appId: process.env.MicrosoftAppId, appPassword: process.env.MicrosoftAppPassword });
const service = new TinyliciousService();
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => console.log(`\n${server.name} listening to ${server.url}`));
// Listen for incoming requests.
server.post('/api/messages', (req: WebRequest, res: WebResponse) => {
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type == ActivityTypes.Invoke && context.activity.name == ActionContentType) {
            let action = <AdaptiveCardAction>context.activity.value.action;
            var fluidContainer = await Fluid.getContainer(service, <string>action.id, [DiceApp]);
            let diceApp = await fluidContainer.getDataObject('kvpairId');
            let card = await diceApp.onAction(action);
            await context.sendActivity({ type: "invokeResponse", value: { status: StatusCodes.OK, body: { statusCode: StatusCodes.OK, type: AdaptiveCardContentType, data: card } } });
        }
    });
});
