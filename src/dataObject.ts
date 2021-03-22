/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { MergeTreeDeltaType } from "@fluidframework/merge-tree";
// @ts-ignore
import { IValueChanged, SharedMap } from "@fluidframework/map";
import { SequenceDeltaEvent, SequenceMaintenanceEvent, SharedObjectSequence, SubSequence } from "@fluidframework/sequence";
import { IEvent } from "@fluidframework/common-definitions";

/**
 * IDiceRoller describes the public API surface for our dice roller data object.
 */
export interface IDiceRoller extends EventEmitter {
    /**
     * Get the dice value as a number.
     */
    readonly value: number;
    

    /**
     * Roll the dice.  Will cause a "diceRolled" event to be emitted.
     */
    roll: () => void;

    /**
     * The diceRolled event will fire whenever someone rolls the device, either locally or remotely.
     */
    on(event: "diceRolled", listener: () => void): this;


    on(event: "modelChanged", listener: () => void): this;
    valueObject: () => any;
    updateTitle: (title:string) => void;
    updateItem: (i:number, key: string, value: any) => void;
    addItem: (i:number) => void;
    removeItem: (i:number) => void;
    
}

// The root is map-like, so we'll use this key for storing the value.
const diceValueKey = "diceValue";

/**
 * The DiceRoller is our data object that implements the IDiceRoller interface.
 */
export class DiceRoller extends DataObject implements IDiceRoller {

    protected get docId() : string { return (window as any).docId; }
    /**
     * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
     * initialize the state of the DataObject.
     */
    protected async initializingFirstTime() {
        this.root.set(diceValueKey, 1);
        
        
        let docId = this.docId;
        if (docId.startsWith('c'))
            this.populateChecklistModel(docId);
    }

    protected createItem(docId: string, i: number) : SharedMap {
        let ci = SharedMap.create(this.runtime);

        const itemText = `${docId} item ${i}`;
        ci.set('status', false);
        ci.set('text', itemText);

        return ci;
    }

    protected populateChecklistModel(docId: string) {
        const title = `${docId} checklist title`;
        this.root.set('title', title);

        const items = SharedObjectSequence.create(this.runtime);
        this.root.set('items', items.handle);
        
        const itemCount = Number(docId.substring(1));
        for (let i = 0; i < itemCount; ++i) {
            let ci = this.createItem(docId, i);
            items.insert(i, [ci.handle]);
        }
    }

    protected raiseModelChanged() {
        this.emit("modelChanged");
    }

    protected async sequenceDelta(a: SequenceDeltaEvent, b: any) {
        if (a.deltaOperation == MergeTreeDeltaType.INSERT) {

            let items = (a.ranges[0].segment as SubSequence<any>).items;

            for (let i = 0; i < items.length; ++i)
            {
                let so : SharedMap = await items[i].get();
                so.on("valueChanged", this.raiseModelChanged.bind(this))
            }
        }

        this.emit("modelChanged");  
    }

    protected sequenceMaint = (a: SequenceMaintenanceEvent, b: any) => {
        console.log('maintEvent:', b.getItemCount());
        console.log('maintEvent:', a);
        console.log('target', b);
        this.emit("modelChanged");    
    }

    /**
     * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
     * DataObject, by registering an event listener for dice rolls.
     */
    protected async hasInitialized() {

           
        this.root.on("valueChanged", this.raiseModelChanged.bind(this));

        let items  = await this.getItems();
        if (items) {
            items.on("sequenceDelta", this.sequenceDelta.bind(this));

            let n = items.getItemCount();
            for (let i = 0; i < n; ++i) {
                let item = await this.getItem(i);
                if (item)
                    item.on("valueChanged", this.raiseModelChanged.bind(this));
            }
        }

        for (let key of this.root.keys())
        {
            //console.log(key); 
            // @ts-ignore
            let v = this.root.get(key);
            //console.log(v);
        } 
    }

    public get value() {
        return this.root.get(diceValueKey);
    }

    public async getItems() : Promise<SharedObjectSequence<any> | undefined>
    {
        let iH = this.root.get('items');
        if (!iH) return undefined;
        let items = await iH.get();
        return items;
    }

    public async getItem(i: number) : Promise<SharedMap | undefined>
    {
        let items = await this.getItems();

        if (!items) return undefined;
        let n = items.getItemCount();

        if (i >= n) return undefined;
        let item = items.getRange(i, i+1);
        let so = await item[0].get();
        return so;
    }

    public async valueObject() : Promise<any> {
        let o: any = {};
        let items: any[] = [];

        o.title = this.root.get('title');
        o.items = items;

        let rItems = await this.getItems();

        if (rItems) {
            let iHA = rItems.getItems(0);
            for (let i = 0; i < iHA.length; ++i) {
                let soH = iHA[i];
                let sO = await soH.get();
                let o: any = {};
                o.status = sO.get('status');
                o.text = sO.get('text');
                items.push(o);
            }
        }

        return o;
    }

    public updateTitle(title: string) {
        this.root.set('title', title);
    }

    public async updateItem(i:number, key: string, value: any) {
        let ci = await this.getItem(i);
        if (ci)
            ci.set(key, value);
    }

    public async addItem(i:number) {
        let items = await this.getItems();
        
        if (items) {
            let n = items.getItemCount();
            let item = this.createItem(this.docId, n);
            items.insert(i, [item.handle]);
        }
    }

    public async removeItem(i:number) {
        let items = await this.getItems();

        items?.remove(i, i+1);
    }

    public readonly roll = () => {
        const rollValue = Math.floor(Math.random() * 6) + 1;
        this.root.set(diceValueKey, rollValue);
    };
}

/**
 * The DataObjectFactory is used by Fluid Framework to instantiate our DataObject.  We provide it with a unique name
 * and the constructor it will call.  In this scenario, the third and fourth arguments are not used.
 * 
 */

class DiceRollerFactory extends DataObjectFactory<DiceRoller,undefined,IEvent> {
    public constructor(a:any, b:any, c:any ,d:any) {
        super(a, b, c, d)
    }
}
export const DiceRollerInstantiationFactory = new DiceRollerFactory(
    "dice-roller",
    DiceRoller,
    [ 
        SharedObjectSequence.getFactory(),
        SharedMap.getFactory()
    ],
    {},
);
