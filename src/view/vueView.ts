/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { createApp } from 'vue';
/**
 * Render Dice into a given HTMLElement as a text character, with a button to roll it.
 * @param data - The DDS to be rendered
 * @param elem - The HTMLElement to render into
 */
export const  vueRenderView = (data, elem) => {
    const app = createApp({
        template: `
        <div style="text-align: center" >
            <div v-bind:style="{ fontSize: '200px', color: diceColor }">
                {{diceCharacter}}
            </div>
            <button style="font-size: 50px;" v-on:click="rollDice">
                Roll
            </button>
        </div>`,
        data: () => ({ diceValue: 1 }),
        computed: {
            diceCharacter() {
                return String.fromCodePoint(0x267f + (this.diceValue as number));
            },
            diceColor() {
                return `hsl(${this.diceValue * 60}, 70%, 50%)`;
            },
        },
        methods: {
            rollDice() {
                data.set('dice', Math.floor(Math.random() * 6) + 1);
            },
            syncLocalAndFluidState() {
                this.diceValue = data.get('dice');
            },
        },
        mounted() {
            data.on('valueChanged', this.syncLocalAndFluidState);
        },
        unmounted() {
            data.off('valueChanged', this.syncLocalAndFluidState);
        },
    });

    app.mount(elem);
}
