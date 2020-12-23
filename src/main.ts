import { addIcon, App, FuzzySuggestModal, MarkdownView, Modal, Notice, Plugin, PluginManifest, PluginSettingTab, Setting } from 'obsidian';
import { ICON } from './constants';
import { FileInfoTempleProvider } from './providers/FileInfoTempleProvider';
import { DateTimeTempleProvider } from './providers/DateTimeTempleProvider';
import { TempleService } from './TempleService';

// interface TempleSettings {
// 	mySetting: string;
// }
// const DEFAULT_SETTINGS: TempleSettings = {
// 	mySetting: 'default'
// }

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
	private _service: TempleService;

	// todo: select templates
	// todo: configure templates directory
	
	constructor(app: App, pluginManifest: PluginManifest) {
		super(app, pluginManifest);
		
		this._service = new TempleService();
    }

	async onload() {

		this._service.register(new FileInfoTempleProvider(this.app.workspace));
		this._service.register(new DateTimeTempleProvider());

		addIcon('temple', ICON);
		this.addRibbonIcon('temple', 'Temple', async () => {

// 			let file = this.app.workspace.getActiveFile();
// 			// let activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
// 			// let editor = activeView.sourceMode.cmEditor;
// 			// let doc = editor.getDoc();
// 			let content = await this.app.vault.read(file);
			console.log(this._service.resolve());
			let template = `{% for i in range(0, 3) -%}
my name is {{ file.name }}
{{ datetime.now }}
{% endfor -%}
`;
			console.log(this._service.render(template))
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
