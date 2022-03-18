
import { Manager } from '../core';
import { PKG, SDKManager, Command as SDKCommand } from '../cmd/SDKManager';
import { Service } from './Service';
import * as util from '../util';

export class SDKService extends Service {
    readonly sdkmanager: SDKManager;
    constructor(manager: Manager) {
        super(manager);
        this.sdkmanager = new SDKManager(manager);
    }

    accepts() {
        //let commandProp = this.sdkmanager.getCommand(SDKCommand.acceptLicenses);
        //let cmd = this.sdkmanager.getCmd(commandProp);
        console.log("accept license");
        //


        /*
                let termObj = term("Accept SDK Licenses", cmd);
                setTimeout(function () {
                    termObj.sendText("y");
                    if (commandProp.msg && commandProp.msg !== "") { showMsg(MsgType.info, commandProp.msg); }
                }, 1500);*/
    }

    async getPkgs(noCache: boolean = false): Promise<PKG[] | undefined> {
        let out = this.getCache("getPkgs");
        if (!out || noCache) {
            out = this.sdkmanager.exec<PKG>(SDKCommand.listPkg);
            this.setCache("getPkgs", out);
        }
        return out;
    }

    async getInstalledPkgs(noCache: boolean = false): Promise<PKG[] | undefined> {
        let out = this.getCache("getInstalledPkgs");
        if (!out || noCache) {
            out = this.sdkmanager.exec<PKG>(SDKCommand.listInstalled);
            this.setCache("getInstalledPkgs", out);
        }
        return out;
    }



    async installPKG(pkgname: string, displayName: string) {
        return this.sdkmanager.exec<string>(SDKCommand.installPkg, pkgname, displayName);
    }

    async uninstallPkg(pkgname: string, displayName: string) {
        return this.sdkmanager.exec<string>(SDKCommand.uninstallPkg, pkgname, displayName);
    }

    async getSDKList(noCache: boolean = false): Promise<{ [key: string]: PKG } | undefined> {
        let out = this.getCache("getSDKList");
        if (!out || noCache) {
            out = await Promise.all([this.getPkgs(noCache), this.getInstalledPkgs(noCache)]).then(data => {
                let [pkgs, installed] = data;

                let pkgsKeyed = util.keyBy(pkgs ?? [], "pathRaw");
                let installedKeyed = util.keyBy(installed ?? [], "pathRaw");

                for (const installedkey in installedKeyed) {
                    pkgsKeyed[installedkey] = installedKeyed[installedkey];
                }
                return pkgsKeyed;
            });

            this.setCache("getSDKList", out);
        }
        return out;
    }

}