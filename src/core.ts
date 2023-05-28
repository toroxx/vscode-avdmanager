import * as path from "path";
import { workspace, Disposable } from 'vscode';
import { AVDService } from './service/AVDService';
import { SDKService } from './service/SDKService';
import { AndroidService } from './service/AndroidService';

import { Output } from "./module/ui";
import { Cache } from "./module/cache";
import { Platform } from "./module/platform";

export interface IConfig {
    /** PATHS */
    sdkPath: string
    cmdPath: string
    buildToolPath: string
    platformToolsPath: string
    emuPath: string

    /** exe */
    cmdVersion: string
    executable?: string
    emulator?: string
    sdkManager?: string

    /** opts */
    emulatorOpt?: string
}

export enum ConfigItem {
    sdkPath = "sdkPath",
    cmdVersion = "cmdVersion",
    executable = "executable",
    emulator = "emulator",
    emulatorOpt = "emulatorOpt",
    sdkManager = "sdkManager",
}

export enum ConfigScope {
    global = 1,
    workspace = 2,
    folder = 3,
    globalnWorkspace = 4,
    globalnfolder = 5,
}

export class Manager {
    private static instance: Manager;
    public static getInstance() {
        if (!Manager.instance) {
            Manager.instance = new Manager();
        }
        return Manager.instance;
    }

    readonly android: AndroidService;
    readonly avd: AVDService;
    readonly sdk: SDKService;
    readonly output: Output;
    readonly cache: Cache;

    private constructor() {
        this.cache = new Cache();

        this.android = new AndroidService(this);
        this.avd = new AVDService(this);
        this.sdk = new SDKService(this);

        this.output = new Output("AVD Manager");
    }

    /**
     * setConfig
     * @param key string
     * @param value any
     * @param scope ConfigScope
     */


    public async setConfig(key: string, value: any, scope: ConfigScope = ConfigScope.folder) {
        let config = workspace.getConfiguration('avdmanager');

        if (scope === ConfigScope.global) {
            await config.update(key, value, true);

        } else if (scope === ConfigScope.workspace) {
            await config.update(key, value, false);

        } else if (scope === ConfigScope.folder) {
            await config.update(key, value, undefined);

        } else if (scope === ConfigScope.globalnWorkspace) {
            await config.update(key, value, true);
            await config.update(key, value, false);

        } else if (scope === ConfigScope.globalnfolder) {
            await config.update(key, value, true);
            await config.update(key, value, undefined);

        }
    }

    public getConfig(): IConfig {
        let config = workspace.getConfiguration('avdmanager');

        
        let sysSdkRoot = process.env.ANDROID_SDK_ROOT ?? "";
        let androidHomeVal = process.env.ANDROID_HOME ?? "";
        if (androidHomeVal !== "") {
            sysSdkRoot = androidHomeVal;
        }
        

        let sdkPath = config.get<string>(ConfigItem.sdkPath, sysSdkRoot);
        if(sdkPath === ""){
            sdkPath = sysSdkRoot;
        }
        console.log(`ENV SDK PATH: ${sysSdkRoot}`);
        console.log(`Final SDK PATH: ${sdkPath}`);

        let cmdVersion = config.get<string>(ConfigItem.cmdVersion, "latest");

        let cmdPath = path.join(sdkPath, "cmdline-tools", cmdVersion, "bin");
        let buildToolPath = path.join(sdkPath, "build-tools");
        let platformToolsPath = path.join(sdkPath, "platform-tools");
        let emuPath = path.join(sdkPath, "emulator");

        let executable = config.get<string>(ConfigItem.executable, "avdmanager");
        let sdkManager = config.get<string>(ConfigItem.sdkManager, "sdkmanager");
        let emulator = config.get<string>(ConfigItem.emulator, "emulator");

        return {
            sdkPath: sdkPath,
            cmdPath: cmdPath,
            buildToolPath: buildToolPath,
            platformToolsPath: platformToolsPath,
            emuPath: emuPath,

            cmdVersion: cmdVersion,
            executable: executable,
            sdkManager: sdkManager,
            emulator: emulator,
            emulatorOpt: config.get<string>(ConfigItem.emulatorOpt, "")
        };
    }

    public getPlatform() {
        switch (process.platform) {
            case 'linux':
                return Platform.linux;
            case 'darwin':
                return Platform.macOS;
        }
        return Platform.window;
    }



    private _windows: { [key: string]: Disposable } = {};
    registerDisposable(name: string, window: Disposable) {
        this._windows[name] = window;
    }

    getDisposable(name: string) {
        return this._windows[name];
    }


}


