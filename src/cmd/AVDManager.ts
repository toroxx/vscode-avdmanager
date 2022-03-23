import { IConfig, Manager } from '../core';
import { ICommandProp, Executable, CommandType } from './Executable';




export interface AVDDevice {
    id: number;
    idName: string;
    name: string;
    oem: string;
    tag?: string;
}

export interface AVDTarget {
    id: number;
    idName: string;
    name: string;
    type: string;
    apiLevel: string;
    revision: string;
}

export interface AVD {
    basedOn: string;
    device: string;
    name: string;
    path: string;
    sdCard: string;
    skin: string;
    tagAbi: string;
    target: string;
}

export enum Command {
    create = "create",
    rename = "rename",
    delete = "delete",
    listTarget = "listTarget",
    listDevice = "listDevice",
    listAvd = "listAvd",
    none = "none"
}

let commands: { [key in Command]?: ICommandProp } = {
    //create avd -n name -k "sdk_id" [-c {path|size}] [-f] [-p path]
    //avdmanager create avd -n test -k "system-images;android-25;google_apis;x86"
    [Command.create]: {
        log: true,
        command: `echo no | {{exe}} create avd -n "{{0}}" -k "{{1}}"`,
        msg: `{{0}} is creating...`,
        successMsg: `{{0}} created successfully.`,
        failureMsg: `Failed to create {{0}}.`,

    },
    //move avd -n name [-p path] [-r new-name]
    [Command.rename]: {
        log: true,
        command: `{{exe}} move avd -n "{{0}}" -r "{{1}}"`,
        msg: `{{0}} is renaming to {{1}}...`,
        successMsg: `{{0}} rename to {{1}} successfully.`,
        failureMsg: `Failed to rename {{0}} to {{1}}.`
    },
    //delete avd -n name
    [Command.delete]: {
        log: true,
        command: `{{exe}} delete avd -n "{{0}}"`,
        msg: `{{0}} is deleting...`,
        successMsg: `{{0}} deleted successfully.`,
        failureMsg: `Failed to delete {{0}}.`
    },

    //list [target|device|avd] [-c]
    [Command.listTarget]: {
        command: `{{exe}} list target`,
        parser: function (out: string) {
            if (!out) {
                return [];
            }
            out = out.replace(/or "/g, "\n id_name: ");
            let targets = out.split("\n");
            let list = listParser(targets, ": ", 1, "id: ", function (current: any, row: string) {
                let params = row.split(": ");
                let k = params[0].trim(), v = params[1].trim();
                current[k] = v;
            });

            return list.map((v) => {
                return {
                    id: v["id"], idName: v["idName"], name: v["Name"], type: v["Type"],
                    apiLevel: v["API level"], revision: v["Revision"]
                };
            });

        }
    },
    [Command.listDevice]: {
        command: `{{exe}} list device`,
        parser: function (out: string) {
            if (!out) {
                return [];
            }
            out = out.replace(/or "/g, "\n id_name: ");
            let targets = out.split("\n");
            let list = listParser(targets, ": ", 1, "id: ", function (current: any, row: string) {
                let params = row.split(": ");
                let k = params[0].trim(), v = params[1].trim();
                current[k] = v;
            });
            return list.map((v) => {
                return { id: v["id"], idName: v["idName"], name: v["Name"], oem: v["OEM"], tag: v["Tag"] };
            });
        }
    },
    [Command.listAvd]: {
        command: `{{exe}} list avd`,
        parser: function (out: string) {
            if (!out) {
                return [];
            }
            out = out.replace(/Tag\/ABI/g, "\nTag/ABI");
            let targets = out.split("\n");
            let list = listParser(targets, ": ", 1, "Name: ");

            return list.map((v) => {
                return {
                    basedOn: v["Based on"], device: v["Device"], name: v["Name"], path: v["Path"],
                    sdCard: v["Sdcard"], skin: v["Skin"], tagAbi: v["Tag/ABI"], target: v["Target"]
                };
            });

        }
    },
};


export class AVDManager extends Executable {
    constructor(manager: Manager) {
        super(manager, manager.android.getAVDManager() ?? "", commands);
    }
}

function listParser(rows: string[], splitter: string, startFrom: number, firstField: string, others?: Function) {
    let data = [];
    let count = -1;
    let current: { [key: string]: string } = {};
    for (let i = startFrom; i < rows.length; i++) {
        let row = rows[i];
        if (row.indexOf(splitter) === -1) {
            continue;
        }

        if (row.indexOf(firstField) > -1) {
            if (count > -1) { data.push(current); }
            count++;
            current = {};
        }

        if (others) {
            others(current, row);
        } else {
            let params = row.split(splitter);
            let k = params[0].trim(), v = params[1].trim();
            current[k] = v;
        }

    }
    //push last one
    data.push(current);

    return data;
}