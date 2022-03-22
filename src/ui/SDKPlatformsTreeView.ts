
import * as vscode from 'vscode';
import { Manager } from '../core';
import * as util from '../module/util';

import { subscribe } from '../module/';
import { TreeItem, SDKTreeItem, SDKTreeRootItem } from './SDKTreeView';




export class SDKPlatformsTreeView {
    readonly provider: SDKPlatformsTreeDataProvider;
    constructor(context: vscode.ExtensionContext, private manager: Manager) {
        this.provider = new SDKPlatformsTreeDataProvider(this.manager);

        const view = vscode.window.createTreeView('avdmanager-sdk-platforms', { treeDataProvider: this.provider, showCollapseAll: true });
        subscribe(context, [
            view,

            vscode.commands.registerCommand('avdmanager.sdk-platforms-refresh', this.refresh),

        ]);

    }

    refresh = async () => this.manager.sdk.getSDKList(true).then(() => this.provider.refresh());


}



class SDKPlatformsTreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    constructor(private manager: Manager) {
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {


        return this.manager.sdk.getSDKList().then((items) => {
            let list: TreeItem[] = [];

            if (!items) {
                return list;
            }

            let cates = ['platforms', 'system-images', 'sources'];
            let tree = util.groupBy(Object.values(items)
                .filter((item) => cates.includes(item.category)), "pkgname");

            if (element && element.contextValue === "sdk-pkg-root") {
                const elm = (element as SDKTreeRootItem);
                elm.opened();
                let childs = tree[elm.pkgname];
                childs.map((item) => {
                    list.push(new SDKTreeItem("platforms", item, vscode.TreeItemCollapsibleState.None));
                });
                return list;
            }

            Object.keys(tree)
                .sort((a, b) => util.sort(a.replace("android-", ""), b.replace("android-", ""), true))
                .map((key) => {
                    const items = tree[key];
                    let installed = 0;
                    let total = 0;
                    for (const pkg of items) {
                        if (pkg.location) {
                            installed++;
                        }
                        total++;
                    }
                    list.push(new SDKTreeRootItem("platforms", key, total, installed));
                });

            return list;
        });

    }


    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

