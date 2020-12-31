import { App, PluginSettingTab, Setting } from 'obsidian';
import TemplePlugin from '../main';
import { ObsidianService } from '../ObsidianService';

export class TempleSettingsTab extends PluginSettingTab {

	constructor(app: App, private _plugin: TemplePlugin, private _obs: ObsidianService) {
		super(app, _plugin);
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: this._plugin.manifest.id });
		containerEl.createEl('p', { text: this._plugin.manifest.description });

		new Setting(containerEl)
			.setName('Templates directory location')
			.setDesc('Directory that stores nunjucks templates.')
			.addText(path => path
				.setPlaceholder('Example: /_templates')
				.setValue(this._obs.settings.templatesDir)
				.onChange(async (value) => {
					// trim / and \ from both ends
					value = value.replace(/^(\/|\\)+|(\/|\\)+$/g, '');
					this._obs.settings.templatesDir = value;
					await this._obs.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Override zettel extraction regex')
			.setDesc('Override the regex for extracting UID and title from filename. Regex must return capture groups named "uid" and "title". For example: (?<uid>^\\d+)(\\s(?<title>.*$))?')
			.addText(regex => regex
				.setValue(this._obs.settings.zettel.regex)
				.onChange(async (value) => {
					this._obs.settings.zettel.regex = value;
					await this._obs.saveSettings();
				}));

	}
}
