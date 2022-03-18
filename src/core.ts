import * as nodeUtil from "util";
import { workspace, Disposable, window, OutputChannel } from 'vscode';
import { AVDService } from './service/AVDService';
import { SDKService } from './service/SDKService';

export interface IConfig {
    executable?: string
    emulator?: string
    emulatorOpt?: string
    sdkManager?: string
}

export enum Platform {
    linux = "linux",
    window = "window",
    macOS = "macOS",
}

export interface CacheItem {
    object: any,
    expire: number
}

export class Manager {
    private static instance: Manager;
    public static getInstance() {
        if (!Manager.instance) {
            Manager.instance = new Manager();
        }
        return Manager.instance;
    }

    private constructor() {
        this.avd = new AVDService(this);
        this.sdk = new SDKService(this);

        this.output = window.createOutputChannel("AVD Manager");
    }
    readonly output: OutputChannel;
    readonly avd: AVDService;
    readonly sdk: SDKService;

    public append(msg: string, level: string = "info") {
        let current = new Date();
        this.output.appendLine(nodeUtil.format("[%s] %s", level, msg));
    }

    public appendTime() {
        let current = new Date();
        this.output.appendLine(nodeUtil.format("Current %s", current));
    }
    public clearOutput() {
        this.output.clear();
    }

    public showOutput() {
        this.output.show(true);
    }
    public hideOutput() {
        this.output.hide();
    }

    private cache: { [key: string]: CacheItem } = {};
    public getCache(key: string, autoClean: boolean = false) {
        let cacheObj = this.cache[key] ?? false;
        if (!cacheObj) {
            return false;
        }

        let current = new Date().getTime();
        console.log("getCache: check expire", key, current, cacheObj.expire, current - cacheObj.expire);
        if (cacheObj.expire !== -1 && current > cacheObj.expire) {
            return false;
        }

        if (autoClean) {
            this.cache[key].expire = current - 1;
        }
        return cacheObj.object;
    }
    public setCache(key: string, value: any, expire: number = -1) {
        let current: number = new Date().getTime();
        let time = expire;
        if (expire > -1) {
            time = current + expire * 1000;
        }

        console.log("setCache", key, expire);
        this.cache[key] = {
            object: value,
            expire: time
        };
    }

    public getConfig(): IConfig {
        let config = workspace.getConfiguration('avdmanager');
        return {
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
