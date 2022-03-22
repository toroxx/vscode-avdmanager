import { Platform } from "./module/platform";

export const CACHE_TIMEOUT = 30;


export const CMDTOOLS_DLPATH: { [key: string]: string } = {
    [Platform.window]: "https://dl.google.com/android/repository/commandlinetools-win-8092744_latest.zip",
    [Platform.macOS]: "https://dl.google.com/android/repository/commandlinetools-mac-8092744_latest.zip",
    [Platform.linux]: "https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip"
};