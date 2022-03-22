
import * as vscode from 'vscode';
import { Manager } from '../core';
import * as util from '../module/util';
import { subscribe } from '../module/';

import { TreeItem, SDKTreeItem, SDKTreeRootItem } from './SDKTreeView';

export class SDKToolsTreeView {
    readonly provider: SDKToolsTreeDataProvider;
    constructor(context: vscode.ExtensionContext, private manager: Manager) {
        this.provider = new SDKToolsTreeDataProvider(this.manager);

        const view = vscode.window.createTreeView('avdmanager-sdk-tools', { treeDataProvider: this.provider, showCollapseAll: true });
        subscribe(context, [
            view,
            vscode.commands.registerCommand('avdmanager.sdk-tools-refresh', this.refresh),

        ]);

    }

    refresh = async () => this.manager.sdk.getSDKList(true).then(() => this.provider.refresh());

}


class SDKToolsTreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    constructor(private manager: Manager) {
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {


        return this.manager.sdk.getSDKList().then((items) => {
            let list: TreeItem[] = [];
            let cates = ['platforms', 'system-images', 'sources', 'add-ons', 'ID'];
            if (!items) {
                return list;
            }

            // 
            let filtered = Object.values(items)
                .filter((item) => !cates.includes(item.category))
                .map((item) => {
                    let pkgname = item.path[0];
                    let extra = item.path[1] || "";
                    item.pkgname = pkgname + (pkgname === "extras" ? "-" + extra : "");
                    return item;
                });
            //console.log(filtered);
            let tree = util.groupBy(filtered, "pkgname");

            if (element && element.contextValue === "sdk-pkg-root") {
                const elm = (element as SDKTreeRootItem);
                elm.opened();
                let childs = tree[elm.pkgname]
                    .sort((a, b) => util.sort(a.description, b.description, true));
                childs.map((item) => {
                    list.push(new SDKTreeItem("tools", item, vscode.TreeItemCollapsibleState.None));
                });

                return list;
            }

            Object.keys(tree)
                .sort((a, b) => util.sort(a, b, false))
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
                    list.push(new SDKTreeRootItem("tools", key, total, installed));
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
