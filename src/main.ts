import "reflect-metadata";
import { addIcon, App, Plugin, PluginManifest, Plugin_2, Workspace } from 'obsidian';
import { ICON } from './constants';
import { FileInfoTempleProvider } from './providers/FileInfoTempleProvider';
import { DateTimeTempleProvider } from './providers/DateTimeTempleProvider';
import { ZettelTempleProvider } from './providers/ZettelTempleProvider';
import { TempleService } from './TempleService';
import { TempleSettingsTab } from './settings/TempleSettingsTab';
import { ObsidianService } from './ObsidianService';
import { TempleSettings } from "./settings/TempleSettings";
import { TempleSettingsProvider } from "./settings/TempleSettingsProvider";
import { ClipboardTempleProvider } from './providers/ClipboardTempleProvider';
import { ITempleProvider } from "./providers/ITempleProvider";
import { container } from "tsyringe";
import { Symbols } from "./Symbols";
import { DateTimeProvider } from "./providers/DateTimeProvider";

export default class TemplePlugin extends Plugin {	
	constructor(app: App, pluginManifest: PluginManifest) {
		super(app, pluginManifest);
	}

	async onload() {
		
		container.registerInstance<Plugin_2>(Symbols.Plugin, this);
		container.registerSingleton<TempleSettingsProvider>(TempleSettingsProvider, TempleSettingsProvider);
		
		var settingsProvider = container.resolve<TempleSettingsProvider>(TempleSettingsProvider);
		await settingsProvider.load();

		container.registerInstance<App>(App, this.app);
		container.registerInstance<Workspace>(Workspace, this.app.workspace);

		container.registerInstance<TempleSettings>(Symbols.TempleSettings, settingsProvider.value);
		container.registerSingleton<TempleSettingsTab>(TempleSettingsTab, TempleSettingsTab);
		
		container.registerSingleton<DateTimeProvider>(DateTimeProvider);

		container.registerSingleton<TempleService>(TempleService, TempleService);
		container.registerSingleton<ITempleProvider<any>>(Symbols.ITempleProvider, FileInfoTempleProvider);
		container.registerSingleton<ITempleProvider<any>>(Symbols.ITempleProvider, DateTimeTempleProvider);
		container.registerSingleton<ITempleProvider<any>>(Symbols.ITempleProvider, ZettelTempleProvider);
		container.registerSingleton<ITempleProvider<any>>(Symbols.ITempleProvider, ClipboardTempleProvider);

		let obs = container.resolve<ObsidianService>(ObsidianService);
		
		addIcon('temple', ICON);

		this.addSettingTab(container.resolve<TempleSettingsTab>(TempleSettingsTab));
		this.addRibbonIcon('temple', 'Temple', async () => {
			await obs.promptTemplate();
		});
		this.addCommand({
			id: 'obsidian-temple-insert',
			name: 'Insert template',
			callback: async () => {
				await obs.promptTemplate();
			}
		});
	}	
}