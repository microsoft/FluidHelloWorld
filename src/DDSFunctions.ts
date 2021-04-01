import * as AdaptiveExpressions from "adaptive-expressions"
import { Expression } from "adaptive-expressions";

function myT(args: any[]) : any {
    return `MyT ${args[0]}`;
}

export function addCustomFunctions()
{
    AdaptiveExpressions.Expression.functions.add(myT.name, myT);
}

export function executeDDSExpr(ddsExpr: string) {
    let expr = Expression.parse(ddsExpr);
    expr.tryEvaluate({name : "Amrut"});
}
