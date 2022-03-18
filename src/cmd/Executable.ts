import * as ext_util from "../ext_util";
import { Manager } from "../manager";
import * as util from "../util";


export interface ICommandPathform {
    linux: string,
    window: string,
    macOS: string,
}

export enum CommandType {
    runOnly,
    progress,
    spawn,
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

    getCommand(name: string) {
        return this.commands[name];
    }

    getCmd(prop: ICommandProp, ...params: string[]) {
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
            this.manager.showOutput();
            this.manager.appendTime();
            this.manager.append("exec: " + cmd);
        }

        console.log("exec:", cmd);

        const exectype = prop.type ?? CommandType.progress;

        const exec = {
            [CommandType.runOnly]: ext_util.cmdWithMsg,
            [CommandType.progress]: ext_util.cmdWithProgress,
            [CommandType.spawn]: ext_util.cmdSpawn,
            // [CommandType.spawnSync]: ext_util.cmdSpawnSync,
        };
        let next = exec[exectype](this.manager, showLog, cmd, msg, successMsg, failureMsg);
        return next.then((out) => (typeof prop.parser === "function") ? prop.parser(out) : out);
    }
}