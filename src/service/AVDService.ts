import { Manager } from '../core';
import { AVD, AVDDevice, AVDTarget, AVDManager, Command as avdcommand } from '../cmd/AVDManager';
import { Service } from './Service';
import { Emulator, Command as EmuCommand } from '../cmd/Emulator';
export class AVDService extends Service {
    readonly avdmanager: AVDManager;
    readonly emulator: Emulator;
    constructor(manager: Manager) {
        super(manager);
        this.avdmanager = new AVDManager(manager);
        this.emulator = new Emulator(manager);

    }


    async getAVDList(noCache: boolean = false) {
        let out = this.getCache("getAVDList");
        if (!out || noCache) {
            out = this.avdmanager.exec<AVD>(avdcommand.listAvd);
            this.setCache("getAVDList", out);
        }
        return out;
    }

    async getAVDDeviceList(noCache: boolean = false) {
        let out = this.getCache("getAVDDeviceList");
        if (!out || noCache) {
            out = this.avdmanager.exec<AVDDevice>(avdcommand.listDevice);
            this.setCache("getAVDDeviceList", out);
        }
        return out;
    }

    async getAVDTargetList(noCache: boolean = false) {
        let out = this.getCache("getAVDTargetList");
        if (!out || noCache) {
            out = this.avdmanager.exec<AVDTarget>(avdcommand.listTarget);
            this.setCache("getAVDTargetList", out);
        }
        return out;
    }

    async createAVD(avdname: string, path: string, imgname: string) {
        return this.avdmanager.exec<AVD>(avdcommand.create, avdname, path, imgname);
    }
    async renameAVD(name: string, newName: string) {
        return this.avdmanager.exec<AVD>(avdcommand.rename, name, newName);
    }

    async deleteAVD(name: string) {
        return this.avdmanager.exec<AVD>(avdcommand.delete, name);
    }


    async launchEmulator(name: string, opt?: string) {
        opt = (opt ?? "") + " " + (this.manager.getConfig().emulatorOpt ?? "");
        return this.emulator.exec<string>(EmuCommand.run, name, opt);
    }

}