
import { Manager } from "../core";
import { Service } from "./Service";

import { MsgType, showYesNoMsg } from '../module/ui';

export class AndroidService extends Service {
    constructor(protected manager: Manager) {
        super(manager);

    }

    public initCheck() {
        this.manager.output.show();
        showYesNoMsg(MsgType.warning, "SDK Root Path Not found!");
        this.manager.output.append("SDK Root Path:            " + this.getConfig().sdkPath);
        this.manager.output.append("SDK Command-Line Tools:   " + this.getConfig().cmdPath);
        this.manager.output.append("SDK Build Tools:          " + this.getConfig().buildToolPath);
        this.manager.output.append("SDK Platform Tools:       " + this.getConfig().platformToolsPath);
        this.manager.output.append("Emulator Path:            " + this.getConfig().emuPath);
    }
}