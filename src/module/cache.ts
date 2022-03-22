import * as config from "../config";

export interface CacheItem {
    object: any,
    expire: number
}

export class Cache {
    private cache: { [key: string]: CacheItem } = {};
    public get(key: string, autoClean: boolean = false) {
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
    public set(key: string, value: any, expire: number = config.CACHE_TIMEOUT) {
        let current: number = new Date().getTime();
        let time = expire;
        if (expire > -1) {
            time = current + expire * 1000;
        }

        //console.log("setCache", key, expire);
        this.cache[key] = {
            object: value,
            expire: time
        };
    }
}