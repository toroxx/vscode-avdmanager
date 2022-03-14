
import { Manager } from '../../src/manager';
import { ICommandProp, Executable, CommandType } from './Executable';


export enum Command {
    run = "Run"
}

let commands: { [key in Command]?: ICommandProp } = {

    [Command.run]: {
        log: true,
        type: CommandType.runOnly,
        command: {
            window: `start /B {{exe}} @{{0}} {{1}}`,
            linux: `{{exe}} @{{0}} {{1}} > /dev/null 2>&1 & `,
            macOS: `{{exe}} @{{0}} {{1}} > /dev/null 2>&1 & `,
        },

        msg: `{{0}} is starting...`,
        successMsg: `{{0}} started successfully.`,
        failureMsg: `Failed to start {{0}}.`
    },

};



export class Emulator extends Executable {
    constructor(manager: Manager) {
        super(manager, manager.getConfig().emulator ?? "", commands);
    }
}