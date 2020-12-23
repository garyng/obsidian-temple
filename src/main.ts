import { addIcon, App, FuzzySuggestModal, MarkdownView, Modal, Notice, Plugin, PluginManifest, TFolder, Vault } from 'obsidian';
import { ICON } from './constants';
import { FileInfoTempleProvider } from './providers/FileInfoTempleProvider';
import { DateTimeTempleProvider } from './providers/DateTimeTempleProvider';
import { ZettelTempleProvider } from './providers/ZettelTempleProvider';
import { TempleService } from './TempleService';
import { TempleSettingsTab } from './settings/TempleSettingsTab';
import { ObsidianService } from './ObsidianService';
import { TempleSettings } from "./settings/TempleSettings";

export default class TemplePlugin extends Plugin {
	private _temple: TempleService;
	private _obs: ObsidianService;
	_settings: TempleSettings;

	// todo: select templates
	// todo: configure templates directory
	
	constructor(app: App, pluginManifest: PluginManifest) {
		super(app, pluginManifest);
		
		this._temple = new TempleService();
		this._obs = new ObsidianService(this, this._temple);
    }

	async onload() {

		this._temple.register(new FileInfoTempleProvider(this.app.workspace));
		this._temple.register(new ZettelTempleProvider(this.app.workspace));
		this._temple.register(new DateTimeTempleProvider());

		addIcon('temple', ICON);

		this._obs.loadSettings();
		this.addSettingTab(new TempleSettingsTab(this.app, this, this._obs));
		this.addRibbonIcon('temple', 'Temple', async () => {
			await this._obs.promptTemplate();
		});
		this.addCommand({
			id: 'obsidian-temple-insert',
			name: 'Insert template',
			callback: async () => {
				await this._obs.promptTemplate();
			}
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