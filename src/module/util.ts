import * as fs from "fs";
export function checkPathExists(filepath: string) {
    return fs.existsSync(filepath);
}

export function checkExecutable(filepath: string) {
    try {
        fs.accessSync(filepath, fs.constants.X_OK);
        return true;
    } catch (e) {
        return false;
    }
}


export function strformat(str: string, ...params: string[]): string {
    let out = str;
    if (!params) {
        return out;
    }

    //console.log("strformat", str, params);
    for (let index = 0; index < params.length; index++) {
        out = out.replace("{{" + index + "}}", params[index] ?? "");
    }
    return out;
}
export function strformatNamed(str: string, params?: { [key: string | number]: string }): string {
    let out = str;
    if (!params) {
        return out;
    }

    //console.log("strformatNamed", str, params);
    let p = params as { [key: string]: string };
    for (let index in p) {
        out = out.replace("{{" + index + "}}", p[index] ?? "");
    }

    return out;
}

export function keyBy<T, K extends keyof T>(items: T[], key: K): { [key: string]: T } {
    let out: { [key: string]: T } = {};
    for (const item of items) {
        let keyVal: string = String(item[key]);
        out[keyVal] = item;
    }

    return out;
}

export function groupBy<T, K extends keyof T>(items: T[], key: K): { [key: string]: T[] } {
    let out: { [key: string]: T[] } = {};
    for (const item of items) {
        let keyVal: string = String(item[key]);

        if (!out[keyVal]) {
            out[keyVal] = [];
        }
        out[keyVal].push(item);
    }
    return out;
}

import * as langApiLevel from "../lang/api_level.json";
interface LangApiLevel {
    level: string;
    code?: string;
    version: string;
}

export function getApiLevelInfo(apiLevel: string) {
    const levels: LangApiLevel[] = langApiLevel;
    for (const info of levels) {
        if (info.level === apiLevel) {
            return info;
        }
    }
    return false;
}



export const isInteger = (num: string): boolean => /^-?[0-9]+$/.test(num + '');
export const isNumeric = (num: string): boolean => /^-?[0-9]+(?:\.[0-9]+)?$/.test(num + '');

function sortNumber(a: number, b: number, descOrder: boolean = false) {
    if (a === b) { return 0; }
    let order = (a > b) ? 1 : -1;
    return descOrder ? -1 * order : order;
}

function sortString(a: string, b: string, descOrder: boolean = false) {
    let order = a.localeCompare(b);
    return descOrder ? -1 * order : order;
}

export function sort(a: string, b: string, descOrder: boolean = false) {
    if (isNumeric(a) && isNumeric(b)) {
        return sortNumber(parseInt(a), parseInt(b), descOrder);
    }
    return sortString(a, b, descOrder);
}

