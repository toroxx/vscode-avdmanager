
import {
    MessageOptions, window, QuickPickOptions, QuickPickItem, OutputChannel
} from 'vscode';

export enum MsgType {
    info, warning, error
}


export function showMsg(type: MsgType, message: string, options: MessageOptions = {}, ...items: string[]) {
    switch (type) {
        case MsgType.error:
            return window.showErrorMessage(message, options, ...items);
        case MsgType.warning:
            return window.showWarningMessage(message, options, ...items);
    }
    return window.showInformationMessage(message, options, ...items);
}

export function showYesNoMsg(type: MsgType, message: string, options: MessageOptions = {}) {
    return showMsg(type, message, options, "Yes", "No");
}
export function showYesNoCancelMsg(type: MsgType, message: string, options: MessageOptions = {}) {
    return showMsg(type, message, options, "Yes", "No", "Cancel");
}
export function showOkCancelMsg(type: MsgType, message: string, options: MessageOptions = {}) {
    return showMsg(type, message, options, "OK", "Cancel");
}


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





export class Output {
    private output: OutputChannel;
    constructor(name: string) {
        this.output = window.createOutputChannel(name);
    }
    public append(msg: string, level: string = "info") {
        let o = msg;
        if (msg === "") {
            return;
        }

        if (level === "error") {
            o = "[ERR] " + msg;
        }

        this.output.appendLine(o);
    }

    public appendTime() {
        let current = new Date();
        this.output.appendLine("\nCurrent: " + current + "\n");
    }
    public clear() {
        this.output.clear();
    }

    public show() {
        this.output.show(true);
    }
    public hide() {
        this.output.hide();
    }
}