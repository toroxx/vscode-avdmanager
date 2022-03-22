import * as ModuleCmd from "../module/cmd";
import { Manager } from "../core";
import * as util from "../module/util";


export interface ICommandPathform {
    linux: string,
    window: string,
    macOS: string,
}

export enum CommandType {
    runOnly,
    progress,
    spawn,
    spawnSync,
}

export interface ICommandProp {

    log?: boolean,
    type?: CommandType;
    command: ICommandPathform | string;
    msg?: string;
    successMsg?: string;
    failureMsg?: string;
    parser?: Function;
}


export abstract class Executable {
    constructor(
        protected manager: Manager,
        protected executable: string,
        protected commands: { [key: string]: ICommandProp }
    ) {

    }

    getCommand(name: string): ICommandProp {
        return this.commands[name];
    }

    getCmd(prop: ICommandProp, ...params: string[]) {
        if (prop.command === "") {
            console.error("exec not found", prop);
            return "";
        }

        let cmd = (typeof prop.command === "string") ?
            prop.command :
            prop.command[this.manager.getPlatform()];

        cmd = util.strformatNamed((cmd ?? ""), { "exe": this.executable });
        return util.strformat(cmd, ...params);
    }

    async exec<T>(name: string, ...params: string[]) {
        let prop = this.getCommand(name) ?? { command: "" };
        if (prop.command === "") {
            console.error("exec not found", prop);
            return undefined;
        }

        let cmd = this.getCmd(prop, ...params);
        let msg = util.strformat(prop.msg ?? "", ...params);
        let successMsg = util.strformat(prop.successMsg ?? "", ...params);
        let failureMsg = util.strformat(prop.failureMsg ?? "", ...params);

        let showLog = prop.log || false;
        if (showLog) {
            this.manager.output.show();
            this.manager.output.appendTime();
            this.manager.output.append("exec: " + cmd);
        }

        console.log("exec:", cmd);

        const exectype = prop.type ?? CommandType.progress;

        const exec = {
            [CommandType.runOnly]: ModuleCmd.execWithMsg,
            [CommandType.progress]: ModuleCmd.execWithProgress,
            [CommandType.spawn]: ModuleCmd.spawn,
            [CommandType.spawnSync]: ModuleCmd.spawnSync,
        };
        let next = exec[exectype](this.manager, showLog, cmd, msg, successMsg, failureMsg);
        return next.then((out) => (typeof prop.parser === "function") ? prop.parser(out) : out);
    }
}