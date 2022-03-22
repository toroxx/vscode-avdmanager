import { Cache } from "./cache";
import { workspace, ExtensionContext } from 'vscode';

const rootPath =
    workspace.workspaceFolders && workspace.workspaceFolders.length > 0
        ? workspace.workspaceFolders[0].uri.fsPath
        : undefined;

function subscribe(context: ExtensionContext, items: Array<any>) {
    context.subscriptions.push(...items);
}



export {
    Cache, rootPath, subscribe
};