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
import { ActionContentType, AdaptiveCardAction } from './card';

// Create HTTP server.
const server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

async function start(): Promise<any> {
    const service = new TinyliciousService();

    // Listen for incoming requests.
    server.post('/api/messages', (req: WebRequest, res: WebResponse) => {
        adapter.processActivity(req, res, async (context) => {

            console.log(context.activity.type);
            let diceApp: DiceApp;

            if (context.activity.type == ActivityTypes.Message) {
                const fluidContainer = await Fluid.createContainer(service, '' + Math.floor(Math.random() * 65535), [DiceApp]);
                diceApp = await fluidContainer.createDataObject(DiceApp, 'kvpairId');
                let card = diceApp.GetCard();
                await context.sendActivity({
                    type: ActivityTypes.Message,
                    attachments: [{ contentType: "application/vnd.microsoft.card.adaptive", content: card }]
                });
            }
            else if (context.activity.type == ActivityTypes.Invoke && context.activity.name == ActionContentType) {
                let action = <AdaptiveCardAction>context.activity.value.action;
                var fluidContainer = await Fluid.getContainer(service, <string>action.id, [DiceApp]);
                diceApp = await fluidContainer.getDataObject('kvpairId');
                let card = await diceApp.onAction(action);
                await context.sendActivity({
                    type: "invokeResponse",
                    value: {
                        status: StatusCodes.OK,
                        body: {
                            statusCode: StatusCodes.OK,
                            type: "application/vnd.microsoft.card.adaptive",
                            data: card
                        }
                    }
                });
            }
        });
    });
}

start().catch((error) => console.error(error));
