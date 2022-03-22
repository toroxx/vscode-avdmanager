import * as path from "path";
import * as config from "./config";
import { workspace, Disposable } from 'vscode';
import { AVDService } from './service/AVDService';
import { SDKService } from './service/SDKService';
import { AndroidService } from './service/AndroidService';
import * as Module from "./module";
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




export class Manager {
    private static instance: Manager;
    public static getInstance() {
        if (!Manager.instance) {
            Manager.instance = new Manager();
        }
        return Manager.instance;
    }

    readonly avd: AVDService;
    readonly sdk: SDKService;
    readonly android: AndroidService;
    readonly output: Output;
    readonly cache: Cache;

    private constructor() {
        this.cache = new Cache();
        this.avd = new AVDService(this);
        this.sdk = new SDKService(this);
        this.android = new AndroidService(this);

        this.output = new Output("AVD Manager");
    }


    public getConfig(): IConfig {
        let config = workspace.getConfiguration('avdmanager');
        let sdkPath = config.get<string>("sdkPath", "avdmanager");
        let cmdVersion = config.get<string>("cmdVersion", "avdmanager");
        let cmdPath = path.join(sdkPath, "cmdline-tools", cmdVersion, "bin");

        return {
            sdkPath: sdkPath,
            cmdPath: cmdPath,
            buildToolPath: path.join(sdkPath, "build-tools"),
            platformToolsPath: path.join(sdkPath, "platform-tools"),
            emuPath: path.join(sdkPath, "emulator"),

            cmdVersion: cmdVersion,
            executable: config.get<string>("executable", "avdmanager"),
            emulator: config.get<string>("emulator", "emulator"),
            emulatorOpt: config.get<string>("emulatorOpt", ""),
            sdkManager: config.get<string>("sdkManager", "sdkManager")
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


