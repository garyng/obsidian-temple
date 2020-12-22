import { addIcon, App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ICON } from './constants';

// interface TempleSettings {
// 	mySetting: string;
// }

// const DEFAULT_SETTINGS: TempleSettings = {
// 	mySetting: 'default'
// }

export default class Temple extends Plugin {


	async onload() {
		addIcon('temple', ICON);
		this.addRibbonIcon('temple', 'Temple', () => {
			new Notice("this is a notice!");
		})
	}

	// settings: TempleSettings;

	// async onload() {
	// 	console.log('loading plugin');
	// 	debugger;

	// 	await this.loadSettings();

	// 	this.addRibbonIcon('dice', 'Sample Plugin', () => {
	// 		new Notice('This is a notice!');
	// 	});

	// 	this.addStatusBarItem().setText('Status Bar Text');

	// 	this.addCommand({
	// 		id: 'open-sample-modal',
	// 		name: 'Open Sample Modal',
	// 		// callback: () => {
	// 		// 	console.log('Simple Callback');
	// 		// },
	// 		checkCallback: (checking: boolean) => {
	// 			let leaf = this.app.workspace.activeLeaf;
	// 			if (leaf) {
	// 				if (!checking) {
	// 					new SampleModal(this.app).open();
	// 				}
	// 				return true;
	// 			}
	// 			return false;
	// 		}
	// 	});

	// 	this.addSettingTab(new TempleSettingsTab(this.app, this));

	// 	this.registerCodeMirror((cm: CodeMirror.Editor) => {
	// 		console.log('codemirror', cm);
	// 	});

	// 	this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
	// 		console.log('click', evt);
	// 	});

	// 	this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	// }

	// onunload() {
	// 	console.log('unloading plugin');
	// }

	// async loadSettings() {
	// 	this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
	// }

	// async saveSettings() {
	// 	await this.saveData(this.settings);
	// }
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		let {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		let {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

// class TempleSettingsTab extends PluginSettingTab {
// 	plugin: Temple;

// 	constructor(app: App, plugin: Temple) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		let {containerEl} = this;

// 		containerEl.empty();

// 		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue('')
// 				.onChange(async (value) => {
// 					console.log('Secret: ' + value);
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
