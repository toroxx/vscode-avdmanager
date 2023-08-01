import { QuickPickItem } from "vscode";
import { AVDDevice } from "../cmd/AVDManager";

export class AVDDeviceQuickPickItem implements QuickPickItem {
    label: string;
    description: string;
    //detail: string;

    public readonly avdDevice: AVDDevice;
    constructor(device: AVDDevice) {
        this.avdDevice = device;
        this.label = device.name;
        this.description = "";
        if (device.id >= 0) {
            this.description = device.oem + (device.tag === "" ? "" : ` | ${device.tag}`) + " | ID: " + device.id;
        }



        let infos = [
            { name: "ID", value: device.id },
            { name: "ID Name", value: device.idName },
            { name: "Name", value: device.name },
            { name: "OEM", value: device.oem },
            { name: "Tag", value: device.tag },
        ];
        let detail = "";
        infos.forEach(element => {
            detail += (detail.length === 0 ? "" : "\n") + `${element.name}: ${element.value}`;
        });
        //this.detail = detail;
    }
}


