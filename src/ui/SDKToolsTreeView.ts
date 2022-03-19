
import * as vscode from 'vscode';
import { PKG } from '../cmd/SDKManager';
import { Manager } from '../core';
import * as util from '../util';
import { showYesNoQuickPick, subscribe, term } from '../ext_util';


export class SDKToolsTreeView {
    readonly provider: SDKToolsTreeDataProvider;
    constructor(context: vscode.ExtensionContext, private manager: Manager) {
        this.provider = new SDKToolsTreeDataProvider(this.manager);

        const view = vscode.window.createTreeView('avdmanager-sdk-tools', { treeDataProvider: this.provider, showCollapseAll: true });
        subscribe(context, [
            view,
            vscode.commands.registerCommand('avdmanager.sdk-tools-refresh', this.refresh),

            vscode.commands.registerCommand("avdmanager.sdktool-pkg-install", async (node) => {
                this.installPKGDiag(node.pkg.pathRaw ?? "", node.pkg.description ?? "");
            }),
            vscode.commands.registerCommand("avdmanager.sdktool-pkg-uninstall", async (node) => {
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

        await vscode.commands.executeCommand("avdmanager.sdk-tools-refresh");

    }
    async deletePKGDiag(pkgname: string, displayName: string) {
        if (pkgname === "") {
            return;
        }

        const ans = await showYesNoQuickPick(`Are you sure to delete ${displayName}?`);
        if (ans === "Yes" && pkgname) {
            await this.manager.sdk.uninstallPkg(pkgname, displayName);
        }
        await vscode.commands.executeCommand("avdmanager.sdk-tools-refresh");
    }
}


export type TreeItem = SDKToolsTreeItem | SDKToolsTreeRootItem;

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

                let childs = tree[(element as SDKToolsTreeRootItem).pkgname]
                    .sort((a, b) => util.sort(a.description, b.description, true));
                childs.map((item) => {
                    list.push(new SDKToolsTreeItem(item, vscode.TreeItemCollapsibleState.None));
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
                    list.push(new SDKToolsTreeRootItem(key, total, installed));
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


class SDKToolsTreeRootItem extends vscode.TreeItem {
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

class SDKToolsTreeItem extends vscode.TreeItem {
    constructor(
        public readonly pkg: PKG,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(pkg.pkgname, collapsibleState);

        let installed = pkg.location ? true : false;

        this.label = pkg.description;
        this.description = installed ? "Installed" : "";
        this.tooltip = pkg.pathRaw;

        let infos = [
            { name: "Path", value: pkg.pathRaw },
            { name: "Location", value: pkg.location },
            { name: "Version", value: pkg.version }
        ];
        let tooltip = "";
        infos.forEach(element => {
            if (element.value) {
                tooltip += (tooltip.length === 0 ? "" : "\n") + `${element.name}: ${element.value}`;
            }
        });
        this.tooltip = tooltip;


        let context = "sdktool-pkg";
        if (installed) {
            context = "sdktool-pkg-installed";
            if (pkg.category === "system-images") {
                context = "sdktool-pkg-installed-img";
            }
        }
        this.contextValue = context;

        this.iconPath = new vscode.ThemeIcon(
            installed ? 'check' : "primitive-square"
        );


    }
}
