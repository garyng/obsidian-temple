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
		});
	}
}