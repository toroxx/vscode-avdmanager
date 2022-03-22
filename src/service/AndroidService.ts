
import { Manager } from "../core";
import { Service } from "./Service";

import { MsgType, showYesNoMsg } from '../module/ui';
import { checkPathExists } from "../module/util";

export class AndroidService extends Service {
    constructor(protected manager: Manager) {
        super(manager);

    }

    public initCheck() {


        let config = this.getConfig();
        let sdkPathLookup = this.sdkPathLookup();
        if (sdkPathLookup === -1) {
            showYesNoMsg(MsgType.warning, "SDK Root Path Not found!");
        }

        this.manager.output.append("SDK Root Path:            " + config.sdkPath);
        this.manager.output.append("SDK Command-Line Tools:   " + config.cmdPath);
        this.manager.output.append("SDK Build Tools:          " + config.buildToolPath);
        this.manager.output.append("SDK Platform Tools:       " + config.platformToolsPath);
        this.manager.output.append("Emulator Path:            " + config.emuPath);

        this.manager.output.show();
    }

    public sdkPathLookup(): number {
        let config = this.getConfig();
        if (config.sdkPath !== "" && !checkPathExists(config.sdkPath)) {
            return -1; //SDK path not exists
        }



        return 0;
    }
}