import { App, PluginSettingTab, Plugin_2, Setting } from 'obsidian';
import { Symbols } from 'src/Symbols';
import { inject, injectable } from 'tsyringe';
import { TempleSettingsProvider } from "./TempleSettingsProvider";

@injectable()
export class TempleSettingsTab extends PluginSettingTab {

	constructor(app: App, @inject(Symbols.Plugin) private _plugin: Plugin_2, private _settings: TempleSettingsProvider) {
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
				.setValue(this._settings.value.templatesDir)
				.onChange(async (value) => {
					// trim / and \ from both ends
					value = value.replace(/^(\/|\\)+|(\/|\\)+$/g, '');
					this._settings.value.templatesDir = value;
					await this._settings.save();
				}));

		new Setting(containerEl)
			.setName('Override zettel extraction regex')
			.setDesc('Override the regex for extracting UID and title from filename. Regex must return capture groups named "uid" and "title". For example: (?<uid>^\\d+)(\\s(?<title>.*$))?')
			.addText(regex => regex
				.setValue(this._settings.value.zettel.regex)
				.onChange(async (value) => {
					this._settings.value.zettel.regex = value;
					await this._settings.save();
				}));

	}
}
