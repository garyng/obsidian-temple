import { addIcon, App, FuzzySuggestModal, MarkdownView, Modal, Notice, Plugin, PluginManifest, TFolder, Vault } from 'obsidian';
import { ICON } from './constants';
import { FileInfoTempleProvider } from './providers/FileInfoTempleProvider';
import { DateTimeTempleProvider } from './providers/DateTimeTempleProvider';
import { ZettelTempleProvider } from './providers/ZettelTempleProvider';
import { TempleService } from './TempleService';
import { TempleSettingsTab } from './settings/TempleSettingsTab';
import { ObsidianService } from './ObsidianService';
import { TempleSettings } from "./settings/TempleSettings";
import { ClipboardTempleProvider } from './providers/ClipboardTempleProvider';
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
		await this._obs.loadSettings();

		this._temple.register(new FileInfoTempleProvider(this.app.workspace));
		this._temple.register(new ZettelTempleProvider(this.app.workspace, this._obs.settings));
		this._temple.register(new DateTimeTempleProvider());
		this._temple.register(new ClipboardTempleProvider());

		addIcon('temple', ICON);

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