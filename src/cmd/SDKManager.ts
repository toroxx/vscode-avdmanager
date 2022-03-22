import { Manager } from '../core';
import { ICommandProp, Executable, CommandType } from './Executable';




export enum Command {
    listPkg = "listPkg",
    listInstalled = "listInstalled",
    uninstallPkg = "unInstallPkg",
    acceptLicenses = "acceptLicenses",
    installPkg = "installPkg",
    updatePkg = "updatePkg",
    updateAllPkg = "updateAllPkg",
}

export interface PKG {
    pathRaw: string,
    path: string[],
    version: string,
    description: string,
    location?: string,
    pkgname: string,
    category: string,
}

export let commands: { [key in Command]?: ICommandProp } = {

    [Command.installPkg]: {
        log: true,

        type: CommandType.spawn,
        command: `{{exe}} {{0}}`,

        msg: `{{1}} is installing...`,
        successMsg: `{{1}} installed successfully.`,
        failureMsg: `Failed to install {{1}}.`
    },
    [Command.acceptLicenses]: {
        log: true,
        command: {
            window: `echo y | {{exe}} --licenses`,
            linux: `echo yes | {{exe}} --licenses`,
            macOS: `echo yes | {{exe}} --licenses`
        },
        msg: `Accepting SDK Licenses ...`,
        successMsg: `All SDK package licenses accepted.`,
        failureMsg: `Can't accept the licenses. Please try manually`
    },
    [Command.updateAllPkg]: {
        log: true,
        type: CommandType.spawn,
        command: {
            window: `echo y | {{exe}} --update --channel=0`,
            linux: `echo yes | {{exe}} --update --channel=0`,
            macOS: `echo yes | {{exe}} --update --channel=0`
        },
        msg: `Updating SDK package ...`,
        successMsg: `All SDK package licenses updated.`,
        failureMsg: `Failed to update SDK package`
    },
    [Command.listPkg]: {
        command: `{{exe}} --list`,
        parser: function (out: string) {
            let pkgs: PKG[] = [];
            for (const row of out.split("\n").filter(i => i !== "")) {

                let items = row.split("|").map((p) => p.trim());
                if (items.length === 3) {
                    let pathArr = items[0].split(";");
                    let pkgname = getPKGname(pathArr);

                    let tmp = {
                        pathRaw: items[0],
                        path: pathArr, version: items[1],
                        description: items[2], category: pathArr[0] ?? pathArr,
                        pkgname: pkgname
                    };

                    if (tmp.version.indexOf("-") !== -1 ||
                        tmp.version === "Version") {
                        continue;
                    }
                    pkgs.push(tmp);
                }
            }
            return pkgs;
        }
    },
    [Command.listInstalled]: {
        command: `{{exe}} --list_installed`,
        parser: function (out: string) {
            let pkgs: PKG[] = [];

            for (const row of out.split("\n").filter(i => i !== "")) {
                let items = row.split("|").map((p) => p.trim());

                if (items.length === 4) {
                    let pathArr = items[0].split(";");

                    let pkgname = getPKGname(pathArr);
                    let tmp = {
                        pathRaw: items[0],
                        path: pathArr, version: items[1], description: items[2],
                        location: items[3], category: pathArr[0] ?? pathArr,
                        pkgname: pkgname
                    };
                    if (tmp.version.indexOf("-") !== -1 ||
                        tmp.version === "Version") {
                        continue;
                    }
                    pkgs.push(tmp);
                }
            }
            return pkgs;
        }
    },
    [Command.uninstallPkg]: {
        log: true,
        command: `{{exe}} --uninstall {{0}}`,
        msg: `{{1}} is uninstalling...`,
        successMsg: `{{1}} uninstalled successfully.`,
        failureMsg: `Failed to uninstall {{1}}.`,
    },
};



export class SDKManager extends Executable {
    constructor(manager: Manager) {
        super(manager, manager.android.getSDKManager() ?? "", commands);
    }
}

function getPKGname(pathArr: string[]) {

    if (pathArr.length > 4) { // more then 3, remove first and last 
        return pathArr.slice(1, -1).join(".");
    }
    return pathArr[1] ?? pathArr[0]; // other use second, else use first 
}