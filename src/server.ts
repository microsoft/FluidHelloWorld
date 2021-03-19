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

// create fluid service reference
const service = new TinyliciousService();

// create http server
const server = restify.createServer();

// listen on port
server.listen(process.env.port || process.env.PORT || 3978, () => console.log(`\n${server.name} listening to ${server.url}`));

// adapter to use for validating requests.
const adapter = new BotFrameworkAdapter({ appId: process.env.MicrosoftAppId, appPassword: process.env.MicrosoftAppPassword });

// endpoint for invoke activity POST back for card actions
server.post('/api/messages', (req: WebRequest, res: WebResponse) => {

    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type == ActivityTypes.Invoke && context.activity.name == ActionContentType) {
            // action payload from the card
            let action = <AdaptiveCardAction>context.activity.value.action;

            // get the app
            var fluidContainer = await Fluid.getContainer(service, <string>action.id, [DiceApp]);
            let diceApp = await fluidContainer.getDataObject('kvpairId');
            
            // invoke the action logic
            let updatedCard = await diceApp.onAction(action);

            // send updated card
            await context.sendActivity({ type: "invokeResponse", value: { status: StatusCodes.OK, body: { statusCode: StatusCodes.OK, type: AdaptiveCardContentType, data: updatedCard } } });
        }
    });
});
