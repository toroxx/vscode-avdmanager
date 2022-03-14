import { spawn } from 'child_process';
import * as vscode from 'vscode';

import { Manager } from './Manager';
import { AVDTreeView } from './ui/AVDTreeView';
import { SDKPlatformsTreeView } from './ui/SDKPlatformsTreeView';
import * as util from './util';




export function activate(context: vscode.ExtensionContext) {
	let iconv = require('iconv-lite');
	console.log("Loaded");
	const manager = Manager.getInstance();
	new AVDTreeView(context, manager);
	new SDKPlatformsTreeView(context, manager);

}


// this method is called when your extension is deactivated
export function deactivate() { }
