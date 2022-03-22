import { IConfig, Manager } from "../core";

export abstract class Service {
    constructor(protected manager: Manager) { }

    protected getCache(key: string) {
        return this.manager.cache.get(key);
    }
    protected setCache(key: string, value: any, expire?: number) {
        this.manager.cache.set(key, value, expire);
    }

    protected getConfig(): IConfig {
        return this.manager.getConfig();
    }

}