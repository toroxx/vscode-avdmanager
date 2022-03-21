import * as child_process from "child_process";
import {
    workspace, ExtensionContext, MessageOptions, window,
    ProgressLocation, QuickPickOptions, QuickPickItem, Terminal
} from 'vscode';
import { Manager } from "./core";

export enum MsgType {
    info, warning, error
}



export const rootPath =
    workspace.workspaceFolders && workspace.workspaceFolders.length > 0
        ? workspace.workspaceFolders[0].uri.fsPath
        : undefined;

export function subscribe(context: ExtensionContext, items: Array<any>) {
    context.subscriptions.push(...items);
}


export function showMsg(type: MsgType, message: string, ...items: string[]) {
    switch (type) {
        case MsgType.error:
            return window.showErrorMessage(message, ...items);
        case MsgType.warning:
            return window.showWarningMessage(message, ...items);
    }
    return window.showInformationMessage(message, ...items);
}
export function showMsgWithOptions(type: MsgType, message: string, options: MessageOptions, ...items: string[]) {
    switch (type) {
        case MsgType.error:
            return window.showErrorMessage(message, options, ...items);
        case MsgType.warning:
            return window.showWarningMessage(message, options, ...items);
    }
    return window.showInformationMessage(message, options, ...items);
}

export const exec = async function (manager: Manager, command: string, willLoad: Function, didLoad: Function) {
    willLoad();

    child_process.exec(command, (error, stdout, stderr) => {
        didLoad(error, stdout, stderr);
    });
};

export const term = function (name: string, command: string) {
    let term = window.createTerminal(name);
    term.show();
    term.sendText(command);

    return term;

};

export const sendTerm = function (term: Terminal, ...msg: string[]) {
    return new Promise((resolve, reject) => {
        let c: number = 0;
        let i = setInterval(() => {
            term.sendText(msg[c]);
            c++;
            if (c >= msg.length) {
                clearInterval(i);
                resolve(true);
            }
        }, 1000);
    });
};


export const cmdSpawn = async function (manager: Manager, showLog: boolean, command: string, willLoadMsg?: string, success?: string, failure?: string) {

    console.log("CMD Spawn");
    if (showLog) { manager.appendTime(); }

    if (willLoadMsg && willLoadMsg !== "") { showMsg(MsgType.info, willLoadMsg); };
    return new Promise((resolve, reject) => {
        let child = child_process.spawn(command, { shell: true });

        let stdout = new StrBuffer();
        let stderr = new StrBuffer();
        if ("on" in child.stdout) {
            child.stdout.on('data', (data) => {
                let buf = Buffer.from(data).toString();
                if (buf === "") {
                    return;
                }
                stdout.append(buf);
                console.log(buf, stdout.count(), stdout.getArray());

                if (showLog) {
                    while (stdout.count() > 1) {
                        let next = stdout.next();
                        if (next) {
                            manager.append(next);
                        }
                    }
                }


            });
        }
        if ("on" in child.stderr) {
            child.stderr.on('data', (data) => {
                let buf = Buffer.from(data).toString();
                if (buf === "") {
                    return;
                }
                stderr.append(buf);
                console.log(buf, stderr.count(), stderr.getArray());
                if (showLog) {
                    while (stderr.count() > 1) {
                        let next = stderr.next();
                        if (next) {
                            manager.append(next, "error");
                        }
                    }
                }


            });
        }

        child.on("error", (code) => {
            console.log("CMD Spawn - fail");
            if (showLog) {
                manager.append(stdout.getBufferAll());
                manager.append(stderr.getBufferAll(), "error");

            }
            if (failure && failure !== "") { showMsg(MsgType.error, failure + ", Error: " + code); }
            reject(stderr.getAll());

        });
        child.on("close", (code) => {
            if (showLog) {
                manager.append(stdout.getBufferAll());
                manager.append(stderr.getBufferAll(), "error");
            }
            console.log("CMD Spawn - end: " + code);
            manager.appendTime();
            if (code && code !== 0) {

                if (failure && failure !== "") { showMsg(MsgType.error, failure + ", Error: " + code); }
                reject(stderr.getAll());
                return;
            }
            if (success && success !== "") { showMsg(MsgType.info, success); }
            setTimeout(() => { resolve(stdout.getAll()); }, success ? 1500 : 0);
        });
    });
};
export const cmdSpawnSync = async function (manager: Manager, showLog: boolean, command: string, willLoadMsg?: string, success?: string, failure?: string) {
    const { spawnSync } = require("child_process");
    console.log("CMD SpawnSync");
    if (showLog) { manager.appendTime(); }

    if (willLoadMsg && willLoadMsg !== "") { showMsg(MsgType.info, willLoadMsg); };
    return new Promise((resolve, reject) => {

        let result = spawnSync(command, { shell: false });

        console.log("CMD SpawnSync - end");
        console.log(result);

        if (showLog) {
            //manager.append("Status: " + (result.status ?? ""));
            manager.appendTime();
        }

        let stdout = result.stdout + "";
        if (result.status && result.status !== 0) {
            let stderr = result.stderr + "";
            if (showLog) {
                manager.append(stderr, "error");
            }

            console.error(stderr);
            console.error(result.error);
            if (failure && failure !== "") { showMsg(MsgType.error, failure + "\n" + stderr); }
            reject(stderr);
            return;
        }

        if (showLog) { manager.append(stdout); }
        if (success && success !== "") { showMsg(MsgType.info, success); }
        setTimeout(() => { resolve(stdout); }, success ? 1500 : 0);
    });
};

export const cmdWithMsg = async function (manager: Manager, showLog: boolean, command: string, willLoadMsg?: string, success?: string, failure?: string) {
    console.log("CMD MSG");
    return new Promise((resolve, reject) => {

        exec(manager, command,
            () => { if (willLoadMsg && willLoadMsg !== "") { showMsg(MsgType.info, willLoadMsg); } },
            (error: any, stdout: string, stderr: string) => {
                if (showLog) { manager.appendTime(); }

                if (error) {
                    if (showLog) { manager.append(stderr, "error"); }

                    console.error(stderr);
                    if (failure && failure !== "") { showMsg(MsgType.error, failure + "\n" + stderr); }
                    reject(stderr);
                    return;
                }
                if (showLog) { manager.append(stdout); }

                if (success && success !== "") { showMsg(MsgType.info, success); }
                setTimeout(() => { resolve(stdout); }, success ? 1500 : 0);
            });
    });
};

export const cmdWithProgress = async function (manager: Manager, showLog: boolean, command: string, willLoadMsg?: string, success?: string, failure?: string) {
    console.log("CMD Progress");
    return window.withProgress(
        { location: ProgressLocation.Notification, },
        async (progress) => new Promise((resolve, reject) => {

            let interval: any;

            let options = {
                willLoad: () => {
                    interval = setInterval(() => {
                        if (willLoadMsg && willLoadMsg !== "") { progress.report({ message: willLoadMsg, }); }
                    });
                },
                didLoad: (error: any, stdout: string, stderr: string) => {
                    if (showLog) { manager.appendTime(); }
                    if (error) {

                        if (showLog) { manager.append(stderr, "error"); }

                        console.error(stderr);
                        if (failure && failure !== "") { showMsg(MsgType.error, failure + "\n" + stderr); }
                        reject(stderr);
                        return;
                    }

                    clearInterval(interval);
                    if (showLog) { manager.append(stdout); }
                    if (success && success !== "") { progress.report({ message: success, }); }
                    setTimeout(() => { resolve(stdout); }, success ? 1500 : 0);
                }
            };
            return exec(manager, command, options.willLoad, options.didLoad);
        })
    );
};



export async function showQuickPick(
    items: Promise<QuickPickItem[] | undefined>,
    quickPickOption: QuickPickOptions,
    msglistEmpty: string,
    msgNotSelected: string): Promise<QuickPickItem | boolean> {

    // get available AVDs
    const list: QuickPickItem[] | undefined = await items;
    if (!list || list.length < 1) {
        showMsg(MsgType.info, msglistEmpty);
        return false;
    }

    // get AVD
    const item: QuickPickItem | undefined = await window.showQuickPick(list, quickPickOption);
    if (!item) {
        showMsg(MsgType.info, msgNotSelected);
        return false;
    }

    return item;
}

export async function showYesNoQuickPick(placeHolder: string) {
    return await window.showQuickPick(["Yes", "No"], {
        placeHolder: placeHolder,
        canPickMany: false
    });
}



class StrBuffer {
    private buffer: string = "";
    private bufferAll: string = "";
    constructor() {
        this.buffer = "";
        this.bufferAll = "";
    }

    append(str: string) {
        this.buffer += str;
        this.bufferAll += str;
        console.log(this.buffer);
    }

    getArray() {
        return this.buffer.split(/\n|\r/);
    }
    count() {
        return this.getArray().length;
    }

    next() {
        let arr = this.getArray();

        let firstline = arr.shift();

        this.buffer = arr.length === 0 ? "" : arr.join("\n");

        return firstline;
    }
    getBufferAll() {
        return this.buffer;
    }
    getAll() {
        return this.bufferAll;
    }
}