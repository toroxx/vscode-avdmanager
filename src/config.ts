import { Platform } from "./module/platform";

export const CACHE_TIMEOUT = 30;


export interface DLPATH {
    os: string,
    name: string,
    url: string,
}

export const CMDTOOLS_DLPATH: DLPATH[] = [
    { os: Platform.window, name: "commandlinetools-win-8092744_latest.zip", url: "https://dl.google.com/android/repository/commandlinetools-win-8092744_latest.zip" },
    { os: Platform.macOS, name: "commandlinetools-mac-8092744_latest.zip", url: "https://dl.google.com/android/repository/commandlinetools-mac-8092744_latest.zip" },
    { os: Platform.linux, name: "commandlinetools-linux-8092744_latest.zip", url: "https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip" },

];
