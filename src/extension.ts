
import * as vscode from 'vscode';


import { AVDTreeView } from './ui/AVDTreeView';
import { SDKPlatformsTreeView } from './ui/SDKPlatformsTreeView';
import { SDKToolsTreeView } from './ui/SDKToolsTreeView';
import { subscribe, term } from './ext_util';
import { Manager } from './core';


export function activate(context: vscode.ExtensionContext) {

	console.log("Loaded");
	const manager = Manager.getInstance();
	//avd manager
	new AVDTreeView(context, manager);

	//sdk manager
	new SDKPlatformsTreeView(context, manager);
	new SDKToolsTreeView(context, manager);

	let acceptLicnese = async () => {
		let sdkbin = manager.getConfig().sdkManager ?? "";
		let t = term("Accept SDK licenses", sdkbin + " --licenses");

		let c: number = 0;
		let i = setInterval(() => {
			t.sendText("y");
			if (c >= 10) {
				clearInterval(i);
				t.sendText("echo '\n-------------------------------------\n\n'");
				t.sendText("echo 'All Licenses should be accepted. '");
				t.sendText("echo '\n'");
				t.sendText("echo 'Please close this terminal '");
				t.sendText("echo '\n\n-------------------------------------\n'");
			}
			c++;
		}, 1000);

	};


	subscribe(context, [
		vscode.commands.registerCommand('avdmanager.cmd-sdk-accept-license', acceptLicnese),
		vscode.commands.registerCommand('avdmanager.pkg-accept-license', acceptLicnese)
	]);


}


// this method is called when your extension is deactivated
export function deactivate() { }
