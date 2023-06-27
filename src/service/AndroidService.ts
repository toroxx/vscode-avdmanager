
import { Manager, ConfigItem, ConfigScope } from "../core";
import { Service } from "./Service";
import * as config from "../config";
import { MsgType, showQuickPick, showMsg, showTargetOfSettingsSelectionMsg, showYesNoMsg } from '../module/ui';
import { checkExecutable, checkPathExists } from "../module/util";
import { commands, env, OpenDialogOptions, ProgressLocation, QuickPickItem, Uri, window } from "vscode";
import * as path from "path";
import { Platform } from "../module/platform";
import { execWithMsg, spawnSync } from "../module/cmd";

export class AndroidService extends Service {
    constructor(protected manager: Manager) {
        super(manager);
    }

    public async initCheck() {
        this.manager.output.append("Config Checking start 👓 ... ");
        let configChanged = false;
        let mayFail = false;

        this.manager.output.show();

        let config = this.getConfig();
        let sdkPathLookup = this.lookupSDKPath();
        if (sdkPathLookup !== 0) {
            let result = await showMsg(MsgType.warning, "SDK Root Path Not found/Not exist!", {}, "Update SDK Root Path", "Cancel");
            if (result === "Update SDK Root Path") {
                let newpath = await this.updatePathDiag("dir", ConfigItem.sdkPath, "Please select the Android SDK Root Path", "Android SDK Root path updated!", "Android SDK path not specified!");
                if (newpath !== "") {
                    configChanged = true;

                    let result = await showYesNoMsg(MsgType.warning, "Reload window to take effect");
                    if (result === "Yes") {
                        commands.executeCommand('workbench.action.reloadWindow');
                    }
                    return;
                }
            }
        }

        config = this.getConfig();
        if (config.sdkPath !== "") {
            this.manager.output.append("SDK Root Path:            " + config.sdkPath);
            this.manager.output.append("SDK Command-Line Tools:   " + config.cmdPath);
            this.manager.output.append("SDK Build Tools:          " + config.buildToolPath);
            this.manager.output.append("SDK Platform Tools:       " + config.platformToolsPath);
            this.manager.output.append("Emulator Path:            " + config.emuPath);
            this.manager.output.append(" -- check OK 👍");
            this.manager.output.append("\n");
        } else {
            showMsg(MsgType.info, "Android SDK path not specified / fail!😓");
        }

        //check avd
        this.manager.output.append("AVD Manager path:         " + this.getAVDManager());
        await this.checkAVDManager().then((o) => {
            this.manager.output.append(" -- check OK 👍");
        }).catch(async (e) => {
            let result = await showMsg(MsgType.warning, "AVD Manager Not found/Not exist!", {}, "Update Path", "Download CmdLine Tools", "Cancel");
            if (result === "Update Path") {
                let newpath = await this.updatePathDiag("file", ConfigItem.executable, "Please select the AVDManager Path", "AVDManager updated!", "AVDManager path not specified!");
                if (newpath !== "") {
                    configChanged = true;
                    this.manager.output.append("AVD Manager path:         " + newpath);
                } else {
                    mayFail = true;
                    this.manager.output.append("AVDManager path not specified!");
                }

            } else if (result === "Download CmdLine Tools") {
                env.openExternal(Uri.parse('https://developer.android.com/studio#command-tools'));
            } else {
                this.manager.output.append("AVDManager path not specified / fail!😓");
                mayFail = true;
            }
        });

        let avdHome = config.avdHome;
        if (config.avdHome === ""){
            avdHome = "System Default";
        }
        this.manager.output.append("AVD Home path:            " + avdHome);
        this.manager.output.append("");
        //check sdk

        this.manager.output.append("SDK Manager path:         " + this.getSDKManager());
        await this.checkSDKManager().then((o) => {
            this.manager.output.append(" -- check OK 👍");
        }).catch(async (e) => {
            let result = await showMsg(MsgType.warning, "SDK Manager Not found/Not exist!", {}, "Update Path", "Download CmdLine Tools", "Cancel");
            if (result === "Update Path") {
                let newpath = await this.updatePathDiag("file", ConfigItem.sdkManager, "Please select the SDKManager Path", "SDKManager updated!", "SDKManager path not specified!");
                if (newpath !== "") {
                    configChanged = true;
                    this.manager.output.append("SDK Manager path:         " + newpath);
                } else {
                    mayFail = true;
                    this.manager.output.append("SDKManager path not specified!");
                }
            } else if (result === "Download CmdLine Tools") {
                env.openExternal(Uri.parse('https://developer.android.com/studio#command-tools'));
            } else {
                this.manager.output.append("SDKManager path not specified / fail!");
                mayFail = true;
            }
        });

        //check emu
        this.manager.output.append("Emulator path:            " + this.getEmulator());
        await this.checkEmulator().then((o) => {
            this.manager.output.append(" -- check OK 👍");
        }).catch(async (e) => {
            let result = await showMsg(MsgType.warning, "Emulator Not found/Not exist!", {}, "Update Emulator Path", "Download Emulator", "Cancel");
            if (result === "Update Path") {
                let newpath = await this.updatePathDiag("file", ConfigItem.emulator, "Please select the Emulator Path", "Emulator path updated!", "Emulator path not specified!");
                if (newpath !== "") {
                    configChanged = true;
                    this.manager.output.append("Emulator path:            " + newpath);
                } else {
                    mayFail = true;
                    this.manager.output.append("Emulator path not specified / fail!😓");
                }

            } else if (result === "Download Emulator") {
                let sdkbin = this.getSDKManager() ?? "";
                await this.manager.sdk.acceptLicnese(sdkbin).then(async () => {
                    this.manager.output.show();
                    await this.manager.sdk.installPKG("emulator", "Android Emulator");
                    await commands.executeCommand("avdmanager.sdk-tools-refresh");
                });

            } else {
                this.manager.output.append("Emulator path not specified / fail!😓");
                mayFail = true;
            }
        });

        if (configChanged) {
            let result = await showYesNoMsg(MsgType.warning, "Reload window to take effect");
            if (result === "Yes") {
                commands.executeCommand('workbench.action.reloadWindow');
            }
        } else {
            if (mayFail) {
                this.manager.output.append("\nSome of the config are failed and may not work correctly.\nPlease ensure all configure are correct.😥");
            } else {
                this.manager.output.append("\nEverything look fine! 😎");
            }
        }

        this.manager.output.show();


    }


    public async updatePathDiag(type: string, configkey: string, openDialogTitle: string, successMsg: string, failMsg: string) {
        //1. ask dir
        let options: OpenDialogOptions = {
            openLabel: "Update",
            title: openDialogTitle
        };
        if (type === "dir") {
            options = { canSelectFiles: false, canSelectFolders: true, canSelectMany: false, ...options };
        } else if (type === "file") {
            options = { canSelectFiles: true, canSelectFolders: false, canSelectMany: false, ...options };
        }

        let uri = await window.showOpenDialog(options);

        //2. check path empty or not
        let newpath = (uri && uri[0].fsPath) ?? "";
        let title = failMsg;
        let msgType = MsgType.warning;

        //2b. path valid, save
        if (newpath !== "") {
            title = successMsg;
            msgType = MsgType.info;

            //3. ask scope
            let target = await showTargetOfSettingsSelectionMsg();
            if (target === "Cancel") {
                showMsg(MsgType.info, "Cancelled");
                return Promise.resolve("");
            }
            let scope = ConfigScope.folder;
            if (target === "Global") {
                scope = ConfigScope.global;
            } else if (target === "Both") {
                scope = ConfigScope.globalnfolder;
            }
            await this.manager.setConfig(configkey, newpath, scope);
        }

        showMsg(msgType, title);
        return Promise.resolve(newpath);
    }

    public lookupSDKPath(): number {
        let config = this.getConfig();
        if (config.sdkPath !== "" && checkPathExists(config.sdkPath)) {
            return 0; //SDK path exists
        }
        return -1;
    }


    public getAVDManager() {
        let config = this.getConfig();
        let platform = this.manager.getPlatform();
        let filenames = ["", "avdmanager.bat", "avdmanager",
            "avdManager.bat", "avdManager",
            "AvdManager.bat", "AvdManager",
            "AVDManager.bat", "AVDManager"
        ];
        //exec name 
        let exec = platform === Platform.window ? "avdmanager.bat" : "avdmanager";

        //get config exec, replace to exec name
        let avdManager = config.executable ?? "";
        if (filenames.includes(avdManager)) { avdManager = exec; }

        //get alt exec
        let altExecutable = path.join(config.cmdPath, exec);


        if (filenames.includes(avdManager) && checkExecutable(altExecutable)) {
            return altExecutable;
        }
        return avdManager;
    }
    public getSDKManager() {
        let config = this.getConfig();
        let platform = this.manager.getPlatform();

        let filenames = ["", "sdkmanager.bat", "sdkmanager",
            "sdkManager.bat", "sdkManager",
            "SdkManager.bat", "SdkManager",
            "SDKManager.bat", "SDKManager"
        ];

        //exec name 
        let exec = platform === Platform.window ? "sdkmanager.bat" : "sdkmanager";

        //get config exec, replace to exec name
        let sdkManager = config.sdkManager ?? "";
        if (filenames.includes(sdkManager)) { sdkManager = exec; }

        //get alt exec
        let altSDKManager = path.join(config.cmdPath, exec);

        if (filenames.includes(sdkManager) && checkExecutable(altSDKManager)) {
            return altSDKManager;
        }
        return sdkManager;
    }
    public getEmulator() {
        let config = this.getConfig();
        let platform = this.manager.getPlatform();

        let filenames = ["", "emulator.exe", "emulator", "Emulator.exe", "Emulator"];

        //exec name 
        let exec = platform === Platform.window ? "emulator.exe" : "emulator";

        //get config exec, replace to exec name
        let emulator = config.emulator ?? "";
        if (filenames.includes(emulator)) { emulator = exec; }

        //get alt exec
        let altEmulator = path.join(config.emuPath, exec);

        if (filenames.includes(emulator) && checkExecutable(altEmulator)) {
            return altEmulator;
        }
        return emulator;
    }


    public async checkAVDManager() {
        let exec = this.getAVDManager();
        return execWithMsg(this.manager, false, exec + " list avd");

    }
    public async checkSDKManager() {
        let exec = this.getSDKManager();
        return execWithMsg(this.manager, false, exec + " --list_installed");

    }
    public async checkEmulator() {
        let exec = this.getEmulator();
        let platform = this.manager.getPlatform();
        return execWithMsg(this.manager, false, exec + " -version ");
    }
}

class CMDToolLinkQuickPickItem implements QuickPickItem {
    label: string;
    description: string;
    detail: string;


    constructor(os: string, link: string) {

        this.label = os;
        this.description = link;
        this.detail = link;
    }
}