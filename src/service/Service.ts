import { IConfig, Manager } from "../manager";

export abstract class Service {
    constructor(protected manager: Manager) { }

    protected getCache(key: string) {
        return this.manager.getCache(key);
    }
    protected setCache(key: string, value: any, expire?: number) {
        this.manager.setCache(key, value, expire);
    }

    protected getConfig(): IConfig {
        return this.manager.getConfig();
    }
}