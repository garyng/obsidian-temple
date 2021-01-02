import "reflect-metadata";
import { addIcon, App, FuzzySuggestModal, MarkdownView, Modal, Notice, Plugin, PluginManifest, TFolder, Vault, Workspace } from 'obsidian';
import { ICON } from './constants';
import { FileInfoTempleProvider } from './providers/FileInfoTempleProvider';
import { DateTimeTempleProvider } from './providers/DateTimeTempleProvider';
import { ZettelTempleProvider } from './providers/ZettelTempleProvider';
import { TempleService } from './TempleService';
import { TempleSettingsTab } from './settings/TempleSettingsTab';
import { ObsidianService } from './ObsidianService';
import { TempleSettings } from "./settings/TempleSettings";
import { ClipboardTempleProvider } from './providers/ClipboardTempleProvider';
import { Container, inject, injectable, multiInject } from "inversify";
import { ITempleProvider } from "./providers/ITempleProvider";

const Symbols = {
	TempleSettings: Symbol.for('TempleSettings'),
	ITempleProvider: Symbol.for('ITempleProvider<any>')
}

@injectable()
class TestSettings {
	constructor(@multiInject(Symbols.ITempleProvider) private _providers: ITempleProvider<any>[]) {
		_providers.forEach(p => console.log(p.name));
	}
}

export default class TemplePlugin extends Plugin {
	private _temple: TempleService;
	private _obs: ObsidianService;
	_settings: TempleSettings;
	
	constructor(app: App, pluginManifest: PluginManifest) {
		super(app, pluginManifest);
		
		// todo: inject service as well?
		this._temple = new TempleService();
		this._obs = new ObsidianService(this, this._temple);
	}

	async onload() {
		
		await this._obs.loadSettings();
		
		
		const container = new Container();
		container.bind<TempleSettings>(Symbols.TempleSettings).toConstantValue(this._obs.settings);
		container.bind<Workspace>(Workspace).toConstantValue(this.app.workspace);

		container.bind<TestSettings>(TestSettings).toSelf();
		container.bind<ITempleProvider<any>>(Symbols.ITempleProvider).to(FileInfoTempleProvider);
		container.bind<ITempleProvider<any>>(Symbols.ITempleProvider).to(DateTimeTempleProvider);

		container.get(TestSettings);


		// todo: inject as self, and as multiple
		// todo: resolve many and bulk register
		// or maybe just do it inside `TempleService` 
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