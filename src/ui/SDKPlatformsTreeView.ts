
import * as vscode from 'vscode';
import { PKG } from '../cmd/SDKManager';
import { Manager } from '../core';
import * as util from '../util';
import { showYesNoQuickPick, subscribe, term } from '../ext_util';





export class SDKPlatformsTreeView {
    readonly provider: SDKPlatformsTreeDataProvider;
    constructor(context: vscode.ExtensionContext, private manager: Manager) {
        this.provider = new SDKPlatformsTreeDataProvider(this.manager);

        const view = vscode.window.createTreeView('avdmanager-sdk-platforms', { treeDataProvider: this.provider, showCollapseAll: true });
        subscribe(context, [
            view,

            vscode.commands.registerCommand('avdmanager.cmd-sdk-platforms-refresh', this.refresh),
            vscode.commands.registerCommand('avdmanager.sdk-platforms-refresh', this.refresh),

            vscode.commands.registerCommand("avdmanager.pkg-install", async (node) => {
                this.installPKGDiag(node.pkg.pathRaw ?? "", node.pkg.description ?? "");
            }),
            vscode.commands.registerCommand("avdmanager.pkg-uninstall", async (node) => {
                this.deletePKGDiag(node.pkg.pathRaw ?? "", node.pkg.description ?? "");
            })
        ]);

    }

    refresh = async () => this.manager.sdk.getSDKList(true).then(() => this.provider.refresh());



    async installPKGDiag(pkgname: string, displayName: string) {
        if (pkgname === "") {
            return;
        }

        await this.manager.sdk.installPKG(pkgname, displayName);

        await vscode.commands.executeCommand("avdmanager.sdk-platforms-refresh");

    }
    async deletePKGDiag(pkgname: string, displayName: string) {
        if (pkgname === "") {
            return;
        }

        const ans = await showYesNoQuickPick(`Are you sure to delete ${displayName}?`);
        if (ans === "Yes" && pkgname) {
            await this.manager.sdk.uninstallPkg(pkgname, displayName);
        }
        await vscode.commands.executeCommand("avdmanager.sdk-platforms-refresh");
    }
}


export type TreeItem = SDKPlatformsTreeItem | SDKPlatformsTreeRootItem;

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
                let childs = tree[(element as SDKPlatformsTreeRootItem).pkgname];
                childs.map((item) => {
                    list.push(new SDKPlatformsTreeItem(item, vscode.TreeItemCollapsibleState.None));
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
                    list.push(new SDKPlatformsTreeRootItem(key, total, installed));
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


class SDKPlatformsTreeRootItem extends vscode.TreeItem {
    constructor(public readonly pkgname: string, total: number, installed: number) {
        super(pkgname.replace("android-", "Android "), vscode.TreeItemCollapsibleState.Collapsed);
        const info = util.getApiLevelInfo(pkgname.replace("android-", ""));
        if (info) {
            this.label = `Android ${info.version}`;
            if (info.code) {
                this.label += ` (${info.code})`;
            }
        }
        this.tooltip = pkgname;
        this.contextValue = "sdk-pkg-root";
        this.description = `${installed}/${total}`;
        this.iconPath = new vscode.ThemeIcon('file-directory');
    }
}

class SDKPlatformsTreeItem extends vscode.TreeItem {
    constructor(
        public readonly pkg: PKG,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(pkg.pkgname, collapsibleState);

        let installed = pkg.location ? true : false;

        this.label = pkg.description;
        this.description = installed ? "Installed" : "";
        this.tooltip = pkg.pathRaw;

        let context = "sdk-pkg";
        if (installed) {
            context = "sdk-pkg-installed";
            if (pkg.category === "system-images") {
                context = "sdk-pkg-installed-img";
            }
        }
        this.contextValue = context;


        this.iconPath = new vscode.ThemeIcon(
            installed ? 'check' : "primitive-square"
        );


    }
}
