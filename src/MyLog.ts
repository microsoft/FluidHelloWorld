function myargs(...args: any[]) {
    if (args[0] === false) return args;
    return JSON.stringify(args, null, "\t");
}

export function aklog(arg:any) {
    // console.log("aklog", JSON.stringify(args, null, "\t"));
    console.log(`aklog: ${arg}`);
}

export function akwarn(...args: any[]) {
    // console.warn("akwarn", JSON.stringify(args, null, "\t"));
    console.warn("akwarn", myargs(args));
}

export function akerr(...args: any[]) {
    //console.error("akerr", JSON.stringify(args, null, "\t"));
    console.error("akerr", args);
}

export function akdebug(...args: any[]) {
    // console.debug("akdebug", JSON.stringify(args, null, "\t"));
    console.debug("akdebug", myargs(args));
}

export function akinfo(...args: any[]) {
    console.info("akinfo", myargs(args));
    //console.info("akinfo:%o", args);

}

export function aklogj(tag: string, ...o : any[]) {
    console.log("aklogj:%s:%s", tag, o && o.length ? JSON.stringify(o, null, "\t") : "");
    //console.log("aklog:%s:%s", tag, o);
}