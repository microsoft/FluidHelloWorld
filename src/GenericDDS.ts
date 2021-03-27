import { EventEmitter } from "events";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { MergeTreeDeltaType } from "@fluidframework/merge-tree";
import { IValueChanged, SharedMap } from "@fluidframework/map";
import { SequenceDeltaEvent, SequenceMaintenanceEvent, SharedObjectSequence, SubSequence } from "@fluidframework/sequence";
import { IEvent } from "@fluidframework/common-definitions";

//--- container imports
import { IRuntimeFactory } from "@fluidframework/container-definitions";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import { getTinyliciousContainer } from "@fluidframework/get-tinylicious-container";
import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { akinfo, aklog, aklogj } from "./MyLog";
//--- end

export interface IGenericDDS extends EventEmitter {
    on(event: "modelChanged", listener: () => void): this;
    getValueObject() : Promise<any>;
    setValueObject(v: any) : Promise<void>;
}

const appDefnKey = "_appDefn";
const docIdKey = "_docId";
const rootKey = "_root";


//function createGenericDDS(appDefn: string) {
class GenericDDS extends DataObject implements IGenericDDS {
    getAppDefnTemplate() { 
        return (window as any).appDefnStr; 
    }

    private _ddsTemplate : any = null;
    private _appTemplate : any = null;

    protected async initializingFirstTime() {
        let templateStr = this.getAppDefnTemplate();
        let template = JSON.parse(templateStr);
        this._appTemplate = template
        this._ddsTemplate = template["DDS"];

        let r : any = new DDSBuilder(this.runtime).build(this._ddsTemplate);

        this.root.set(appDefnKey, templateStr);
        this.root.set(rootKey, r);
    }

    protected async hasInitialized() {
        if (!this._appTemplate) {
            let templateStr = this.root.get(appDefnKey);
            this._appTemplate = JSON.parse(templateStr);
            this._ddsTemplate = this._appTemplate["DDS"];
        }

        var eventHandler = this.raiseModelChanged.bind(this);

        this.root.on("valueChanged", eventHandler);
        let r : any = await new DDSLoader(eventHandler).load(this._ddsTemplate, this.root.get(rootKey));
    }

    public async getValueObject() {
        let p = new DDSValueGetter().getValue(this._ddsTemplate, this.root.get(rootKey));
        return p;
    }

    public async setValueObject(v: any) {
        return new DDSValueSetter(this.runtime).setValue(this._ddsTemplate, this.root.get(rootKey), v);
    }

    protected raiseModelChanged() {
        this.emit("modelChanged");
    }
}

//return GenericDDS;

//}

//-------- Vistor

interface IVisitor {
    visitSharedMap(r: any, h?: any, v?: any) : any;
    visitShareObjectSequence(r: any, h?: any, v?: any): any;

    visitString(r: any, h?: any, v?: any) : any;
    visitBoolean(r: any, h?: any, v?: any) : any;
}

function generateId() {
    return Date.now().toString();
}

class DDSBuilder implements IVisitor {

    private runtime: any;

    constructor(runtime: any) {
        this.runtime = runtime;
    }
    
    visitString(r: any): any {
        //akinfo("builder::visitString");
        return ("default" in r) ? r["default"] : "<< string >>";
    }

    visitBoolean(r: any) {
        //akinfo("builder::visitBoolean");
        return ("default" in r) ? r["default"] : false;
    }

    visitSharedMap(r: any) {
        //akinfo("builder::visitSharedMap");

        let map = SharedMap.create(this.runtime);

        // iterate over keys
        let sharedMapKeys = r["keys"];

        for (let k in sharedMapKeys) {
            let v = sharedMapKeys[k];
            let result;
            if (k == "_id") {
                result = generateId();
            } else {
                result = this.build(v);
            }
            map.set(k, result); 
        }

        return map.handle;
    }

    visitShareObjectSequence(r: any) {
        //akinfo("builder::visitShareObjectSequence");

        let sos = SharedObjectSequence.create(this.runtime);

        // create one item type
        let item = r["itemType"];
        let result = this.build(item);
        sos.insert(0, [result]);

        return sos.handle;
    }

    public build(root : any) {
        let type = root['type'];

        if (!type) throw new Error("type not defined in template");

        let r : any = null;

        switch (type) {
            case "SharedMap" : r = this.visitSharedMap(root); break;
            case "SharedObjectSequence" : r = this.visitShareObjectSequence(root); break;
            case "string" : r = this.visitString(root); break;
            case "boolean" : r = this.visitBoolean(root); break;
            default: throw new Error("Unsupported type in template: " + type); break;
        }

        return r;
    }
}

class DDSLoader implements IVisitor {

    private eventHandler: any;

    constructor(eH: any) {
        this.eventHandler = eH;
    }
    
    visitString(r: any, v: any) {
        //akinfo("DDSLoader::visitString");
        //return v;
    }

    visitBoolean(r: any, v: any) {
        //akinfo("DDSLoader::visitBoolean");
        //return v;
    }

    async visitSharedMap(r: any, handle: any) {
        //akinfo("DDSLoader::visitSharedMap");

        let map : SharedMap = await handle.get();
        map.on("valueChanged", this.eventHandler);

        // iterate over keys
        let sharedMapKeys = r["keys"];

        for (let k in sharedMapKeys) {
            let v = sharedMapKeys[k];
            this.load(v, map.get(k));
        }

        return map;
    }

    async visitShareObjectSequence(r: any, handle: any) {
        //akinfo("DDSLoader::visitShareObjectSequence");

        let sos : SharedObjectSequence<any> = await handle.get();
        let eh = this.eventHandler;
        sos.on("sequenceDelta", async (a: SequenceDeltaEvent) => {
            if (a.deltaOperation == MergeTreeDeltaType.INSERT) {
                let newItems = (a.ranges[0].segment as SubSequence<any>).items;
                for (let i = 0; i < newItems.length; ++i) {
                    await this.load(itemType, newItems[i]);
                }
            }
            eh();
        });

        let n = sos.getItemCount();
        let items = sos.getRange(0, n);
        let itemType = r["itemType"];

        for (let i = 0; i < items.length; ++i) {
            await this.load(itemType, items[i]);
        }

        return sos;
    }

    public async load(root : any, handle: any) {
        let type = root['type'];

        if (!type) throw new Error("type not defined in template");

        let r : any = null;

        switch (type) {
            case "SharedMap" : r = this.visitSharedMap(root, handle); break;
            case "SharedObjectSequence" : r = this.visitShareObjectSequence(root, handle); break;
            case "string" : r = this.visitString(root, handle); break;
            case "boolean" : r = this.visitBoolean(root, handle); break;
            default: throw new Error("Unsupported type in template: " + type); break;
        }

        return;
    }
}
class DDSValueGetter implements IVisitor {
    
    visitString(r: any, v: any) {
        //aklogj("DDSValueGetter::visitString end", v);
        return v;
        
    }

    visitBoolean(r: any, v: any) {
        //aklogj("DDSValueGetter::visitBoolean", v);
        return v;
    }

    async visitSharedMap(r: any, handle: any) {
        //akinfo("DDSValueGetter::visitSharedMap start");

        let map : SharedMap = await handle.get();
        let result: any = { };

        // iterate over keys
        let sharedMapKeys = r["keys"];

        for (let k in sharedMapKeys) {
            let defn = sharedMapKeys[k];
            let v = await this.getValue(defn, map.get(k));
            result[k] = v;
        }

        //aklogj("DDSValueGetter::visitSharedMap end", result);
        return result;
    }

    async visitShareObjectSequence(r: any, handle: any) {
        //akinfo("DDSValueGetter::visitShareObjectSequence start");

        let sos : SharedObjectSequence<any> = await handle.get();
        let result: any[] = [];

        let n = sos.getItemCount();
        let items = sos.getRange(0, n);
        let defn = r["itemType"];

        for (let i = 0; i < items.length; ++i) {
            let v =  await this.getValue(defn, items[i]);
            //aklogj("get::vSOS for loop", v);
            result.push(v);
        }

        //aklogj("DDSValueGetter::visitShareObjectSequence end", result);
        return result;
    }

    public async getValue(root : any, handle: any) {
        let type = root['type'];
        //aklogj("DDSValueGetter::getValue start", type);

        if (!type) throw new Error("type not defined in template");

        let r : any = null;

        switch (type) {
            case "SharedMap" : r = await this.visitSharedMap(root, handle); break;
            case "SharedObjectSequence" : r = await this.visitShareObjectSequence(root, handle); break;
            case "string" : r = this.visitString(root, handle); break;
            case "boolean" : r = this.visitBoolean(root, handle); break;
            default: throw new Error("Unsupported type in template: " + type); break;
        }

        //aklogj("DDSValueGetter::getValue end", r);
        return r;
    }
}

class DDSValueSetter implements IVisitor {
    
    private runtime: any;

    constructor(runtime: any) {
        this.runtime = runtime;
    }

    visitString(r: any, h: any, v: any) {
        //akinfo("DDSValueSetter::visitString");
        return Promise.resolve(v);
    }

    visitBoolean(r: any, h: any, v: any) {
        //akinfo("DDSValueSetter::visitBoolean");
        return Promise.resolve(v);
    }

    async visitSharedMap(r: any, handle: any, v: any) {
        //akinfo("DDSValueSetter::visitSharedMap");

        let map : SharedMap = await handle.get();

        // iterate over keys
        let sharedMapKeys = r["keys"];

        for (let k in sharedMapKeys) {
            if (k in v) {
                let defn = sharedMapKeys[k];
                let curretValue = map.get(k);
                let res = await this.setValue(defn, curretValue, v[k]);
                if (res !== undefined && res != curretValue) {
                    map.set(k, res);
                }
            }
        }

        return undefined;
    }

    async visitShareObjectSequence(r: any, handle: any, v: any) {
        //akinfo("DDSValueSetter::visitShareObjectSequence");

        let sos : SharedObjectSequence<any> = await handle.get();

        let vA: any[] = v;
        let nExisting = sos.getItemCount();
        let nNew = vA.length;

        if (nExisting > nNew) {
            sos.remove(0, nExisting - nNew);
        }

        if (nExisting < nNew) {
            let newCount = nNew - nExisting;
            let newItems = [];            
            let defn = r["itemType"];

            for (let i = 0; i < newCount; ++i) {
                let ni = new DDSBuilder(this.runtime).build(defn);
                newItems.push(ni);
            }

            sos.insert(nExisting, newItems);
        }

        let n = sos.getItemCount();
        let items = sos.getRange(0, n);
        let defn = r["itemType"];

        for (let i = 0; i < n; ++i) {
            this.setValue(defn, items[i], vA[i]);
        }

        return undefined;
    }

    public async setValue(root : any, handle: any, v: any) {
        let type = root['type'];

        if (!type) throw new Error("type not defined in template");

        let r : any = null;

        switch (type) {
            case "SharedMap" : r = await this.visitSharedMap(root, handle, v); break;
            case "SharedObjectSequence" : r = await this.visitShareObjectSequence(root, handle, v); break;
            case "string" : r = await this.visitString(root, handle, v); break;
            case "boolean" : r = await this.visitBoolean(root, handle, v); break;
            default: throw new Error("Unsupported type in template: " + type); break;
        }

        return r;
    }
}

//#region Container logic

export async function getGenericDDS_TLC(docId: string) : Promise<IGenericDDS>
{
    let container = await getTinyliciousContainer(docId, getGenericDDSContainerRuntimeFactory(), false);
    const genericDDS: IGenericDDS = await getDefaultObjectFromContainer<IGenericDDS>(container);
    return genericDDS;
}

export async function createGenericDDS_TLC(docId: string, appDefinition: string) : Promise<IGenericDDS>
{
    const container = await getTinyliciousContainer(docId, getGenericDDSContainerRuntimeFactory(appDefinition), true);
    const genericDDS: IGenericDDS = await getDefaultObjectFromContainer<IGenericDDS>(container);

    return genericDDS;
}

function getGenericDDSContainerRuntimeFactory(appDefn?: string)
{
    //appDefn = appDefn || "";
 

    const genericDDSInstantiationFactory = new DataObjectFactory(
        "generic-dds",
        //createGenericDDS(appDefn),
        GenericDDS,
        [ 
            SharedObjectSequence.getFactory(),
            SharedMap.getFactory()
        ],
        {},
    ); 

    const genericDDSContainerRuntimeFactory = new ContainerRuntimeFactoryWithDefaultDataStore(
        genericDDSInstantiationFactory,
        new Map([
            genericDDSInstantiationFactory.registryEntry,
        ]),
    );
    
    return genericDDSContainerRuntimeFactory;
}

//#endregion 

