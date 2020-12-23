import { addIcon, App, FuzzySuggestModal, MarkdownView, Modal, Notice, Plugin, PluginManifest } from 'obsidian';
import { ICON } from './constants';
import { FileInfoTempleProvider } from './providers/FileInfoTempleProvider';
import { DateTimeTempleProvider } from './providers/DateTimeTempleProvider';
import { TempleService } from './TempleService';
import { TempleSettingsTab } from './settings/TempleSettingsTab';
import { ObsidianService } from './ObsidianService';
import { TempleSettings } from "./settings/TempleSettings";

class TagFuzzySuggestModal extends FuzzySuggestModal<string> {
    app: App;

    constructor(app: App) {
        super(app);
        this.app = app;
    }

    getItems(): string[] {
        return Object.keys({
			"a": 1,
			"b": 2,
			"c": 3
		});
    }

    getItemText(item: string): string {
        return item;
    }

    onChooseItem(item: string, evt: MouseEvent | KeyboardEvent): void {
        console.log('You chose the tag ' + item + '!');
	}
}
export default class TemplePlugin extends Plugin {
	private _temple: TempleService;
	private _obs: ObsidianService;
	_settings: TempleSettings;

	// todo: select templates
	// todo: configure templates directory
	
	constructor(app: App, pluginManifest: PluginManifest) {
		super(app, pluginManifest);
		
		this._temple = new TempleService();
		this._obs = new ObsidianService(this);
    }

	async onload() {

		this._temple.register(new FileInfoTempleProvider(this.app.workspace));
		this._temple.register(new DateTimeTempleProvider());

		addIcon('temple', ICON);
		this._obs.loadSettings();
		this.addSettingTab(new TempleSettingsTab(this.app, this, this._obs));
		this.addRibbonIcon('temple', 'Temple', async () => {

// 			let file = this.app.workspace.getActiveFile();

// 			// let activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
// 			// let editor = activeView.sourceMode.cmEditor;
// 			// let doc = editor.getDoc();

// 			let content = await this.app.vault.read(file);
// 			console.log(this._temple.resolve());
// 			let template = `{% for i in range(0, 3) -%}
// my name is {{ file.name }}
// {{ datetime.now }}
// {% endfor -%}
// `;
			// console.log(this._temple.render(template))
// 			let rendered = njk.renderString(template, {
// 				file
// 			});

// 			let newContent = content + rendered;

// 			await this.app.vault.modify(file, newContent);

			// let modal = new TagFuzzySuggestModal(this.app);
			// modal.open();

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