import * as AdaptiveExpressions from "adaptive-expressions"
import { Expression } from "adaptive-expressions";

function myT(args: any[]) : any {
    return `MyT ${args[0]}`;
}

interface Aggregator {
    aggregateFunction: string;
    aggregateColumn: string;
}

export function fx_pivot(...args: any[]) : any {

    let table: any[] = args[0][0];
    let pivotColumn : string = args[1];
    let agg: Aggregator = args[2];

    pivotColumn = "displayName";
    agg = {
        "aggregateFunction" : "count",
        "aggregateColumn" : "userId"
    };

    let o : any = {};
    
    for (let i = 0; i < table.length; ++i) {
        let row = table[i];
        if (pivotColumn in row) {
            let v = (row[pivotColumn]).toString();
            if (!(v in o)) { o[v] = 0 }
            
            if (!(agg.aggregateColumn in row)) continue;
            switch (agg.aggregateFunction) {
                case "count" : o[v]++; break;
                case "sum"   : o[v] += row[agg.aggregateColumn]; break;
                default: break;
            }
        }
    }

    let result: any[] = [];
    for (let k in o) {
        result.push({ k: k, v: o[k]});
    }

    let result2 = null;
    result2 = result.sort((a, b) => { return b.v - a.v; } );

    return result2;
}

function addCustomFunction(name: string, fn : any) {
    let w : any = window;
    if (!(fn in w.g)) { w.g.fn = {}; }
    w.g.fn[name] = fn;

    AdaptiveExpressions.Expression.functions.add(name, fn);
}

export function addCustomFunctions()
{
    addCustomFunction(myT.name, myT);
    addCustomFunction(fx_pivot.name, fx_pivot);
}

export function executeDDSExpr(ddsExpr: string) {
    let expr = Expression.parse(ddsExpr);
    expr.tryEvaluate({name : "Amrut"});
}


