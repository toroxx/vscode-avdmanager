
import * as vscode from 'vscode';


import { AVDTreeView } from './ui/AVDTreeView';
import { SDKPlatformsTreeView } from './ui/SDKPlatformsTreeView';
import { SDKToolsTreeView } from './ui/SDKToolsTreeView';
import { ConfigItem, Manager } from './core';
import { subscribe } from './module/';

export async function activate(context: vscode.ExtensionContext) {
	console.log("Loaded");
	const manager = Manager.getInstance();
	await manager.android.initCheck();


	//avd manager
	new AVDTreeView(context, manager);
	console.log("avd load");
	//sdk manager
	new SDKPlatformsTreeView(context, manager);
	new SDKToolsTreeView(context, manager);
	console.log("sdk load");

	let sdkbin = manager.android.getSDKManager() ?? "";
	subscribe(context, [
		vscode.commands.registerCommand('avdmanager.setup-sdkpath', async () => {
			await manager.android.updatePathDiag("dir", ConfigItem.sdkPath, "Please select the Android SDK Root Path", "Android SDK Root path updated!", "Android SDK path not specified!");
		}),
		vscode.commands.registerCommand('avdmanager.setup-avdmanager', async () => {
			await manager.android.updatePathDiag("file", ConfigItem.executable, "Please select the AVDManager Path", "AVDManager updated!", "AVDManager path not specified!");
		}),
		vscode.commands.registerCommand('avdmanager.setup-sdkmanager', async () => {
			await manager.android.updatePathDiag("file", ConfigItem.sdkManager, "Please select the SDKManager Path", "SDKManager updated!", "SDKManager path not specified!");
		}),
		vscode.commands.registerCommand('avdmanager.setup-emulator', async () => {
			await manager.android.updatePathDiag("file", ConfigItem.emulator, "Please select the Emulator Path", "Emulator path updated!", "Emulator path not specified!");
		}),
		vscode.commands.registerCommand('avdmanager.pkg-install', async (node) => manager.sdk.pkgInstall(node)),
		vscode.commands.registerCommand('avdmanager.pkg-uninstall', async (node) => manager.sdk.pkgUnInstall(node)),
		vscode.commands.registerCommand('avdmanager.pkg-accept-license', () => { manager.sdk.acceptLicnese(sdkbin); }),
		vscode.commands.registerCommand('avdmanager.pkg-update-all', () => { manager.sdk.updateAllPkg(); })
	]);


}



// this method is called when your extension is deactivated
export function deactivate() { }
