

import * as vscode from 'vscode';
import * as util from '../util';
import { PKG } from '../cmd/SDKManager';

export type TreeItem = SDKTreeItem | SDKTreeRootItem;

export class SDKTreeRootItem extends vscode.TreeItem {
    constructor(
        public readonly type: string,
        public readonly pkgname: string,
        total: number,
        private installed: number
    ) {
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

        this.closed();
    }

    opened() {
        this.iconPath = new vscode.ThemeIcon(
            'folder-opened',
            this.installed > 0 ? new vscode.ThemeColor("avdmanager.pkgFolderInstalled") : undefined
        );
    }
    closed() {
        this.iconPath = new vscode.ThemeIcon(
            'file-directory',
            this.installed > 0 ? new vscode.ThemeColor("avdmanager.pkgFolderInstalled") : undefined
        );
    }
}

export class SDKTreeItem extends vscode.TreeItem {

    constructor(
        public readonly type: string,
        public readonly pkg: PKG,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(pkg.pkgname, collapsibleState);

        let installed = pkg.location ? true : false;

        this.label = pkg.description;
        this.description = "ver: " + pkg.version + (installed ? ", Installed" : "");
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


        let context = "sdk-pkg";
        if (installed) {
            context = "sdk-pkg-installed";
            if (pkg.category === "system-images") {
                context = "sdk-pkg-installed-img";
            }
        }
        this.contextValue = context;
        this.iconPath = new vscode.ThemeIcon(
            installed ? 'check' : "primitive-square",
            new vscode.ThemeColor(installed ? 'avdmanager.pkgInstalled' : "avdmanager.pkgNotInstall")
        );
    }
}


