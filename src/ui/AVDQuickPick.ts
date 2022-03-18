import { QuickPickItem, window } from "vscode";
import { AVD } from "../cmd/AVDManager";
import { Manager } from "../core";

export class AVDQuickPickItem implements QuickPickItem {
    label: string;
    description: string;
    detail: string;

    public readonly avd: AVD;
    constructor(avd: AVD) {
        this.avd = avd;
        this.label = avd.name;
        this.description = avd.basedOn + " | " + avd.tagAbi;

        let infos = [
            { name: "Device", value: avd.device },
            { name: "Skin", value: avd.skin },
            //{ name: "Path", value: avd.path },
            { name: "Sdcard", value: avd.sdCard },
            { name: "Target", value: avd.target },
        ];
        let detail = "";
        infos.forEach(element => {
            detail += (detail.length === 0 ? "" : "\n") + `${element.name}: ${element.value}`;
        });
        this.detail = detail;
    }
}


