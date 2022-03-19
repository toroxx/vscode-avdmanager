
import * as vscode from 'vscode';


import { AVDTreeView } from './ui/AVDTreeView';
import { SDKPlatformsTreeView } from './ui/SDKPlatformsTreeView';
import { SDKToolsTreeView } from './ui/SDKToolsTreeView';
import { subscribe } from './ext_util';
import { Manager } from './core';


export function activate(context: vscode.ExtensionContext) {

	console.log("Loaded");
	const manager = Manager.getInstance();
	//avd manager
	new AVDTreeView(context, manager);

	//sdk manager
	new SDKPlatformsTreeView(context, manager);
	new SDKToolsTreeView(context, manager);


	let sdkbin = manager.getConfig().sdkManager ?? "";
	subscribe(context, [
		vscode.commands.registerCommand('avdmanager.pkg-accept-license', () => { manager.sdk.acceptLicnese(sdkbin); }),
		vscode.commands.registerCommand('avdmanager.pkg-update-all', () => { manager.sdk.updateAllPkg(); })
	]);


}


// this method is called when your extension is deactivated
export function deactivate() { }
