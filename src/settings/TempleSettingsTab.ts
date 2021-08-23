import { DateTime } from 'luxon';
import { App, PluginSettingTab, Plugin_2, Setting } from 'obsidian';
import { Symbols } from 'src/Symbols';
import { inject, injectable } from 'tsyringe';
import { TempleSettingsProvider } from './TempleSettingsProvider';

@injectable()
export class TempleSettingsTab extends PluginSettingTab {

    constructor(app: App, @inject(Symbols.Plugin) private _plugin: Plugin_2, private _settings: TempleSettingsProvider) {
        super(app, _plugin);
    }

    display(): void {
        const { containerEl: e } = this;

        e.empty();

        e.createEl('h1', { text: this._plugin.manifest.id });
        e.createEl('p', { text: this._plugin.manifest.description });
        e.createEl('br');

        this.createSection(e, 'common');

        new Setting(e)
            .setName('Templates directory location')
            .setDesc('Directory that stores nunjucks templates.')
            .addText(path => path
                .setPlaceholder('Example: _templates')
                .setValue(this._settings.value.templatesDir)
                .onChange(async (value) => {
                    // trim / and \ from both ends
                    value = value.replace(/^(\/|\\)+|(\/|\\)+$/g, '');
                    this._settings.value.templatesDir = value;
                    await this._settings.save();
                }));

        this.createSection(e, 'zettel');

        new Setting(e)
            .setName('Override extraction regex')
            .setDesc('Override the regex for extracting UID and title from filename. Regex must return capture groups named "uid" and "title". For example: (?<uid>^\\d+)(\\s(?<title>.*$))?')
            .addText(regex => regex
                .setValue(this._settings.value.zettel.regex)
                .onChange(async (value) => {
                    this._settings.value.zettel.regex = value;
                    await this._settings.save();
                }));

        e.createEl('h3', { text: 'datetime' });

        new Setting(e)
            .setName('Default datetime format')
            .setDesc('Default is ISO 8601-ish (yyyy-MM-dd HH:mm)')
            .addText(format => format
                .setValue(this._settings.value.datetime.format)
                .onChange(async (value) => {
                    this._settings.value.datetime.format = value;
                    await this._settings.save();
                }));

        new Setting(e)
            .setName('Override timezone')
            .setDesc(`Defaults to system timezone ("${DateTime.local().zoneName}").`)
            .addText(tz => tz
                .setValue(this._settings.value.datetime.timezone)
                .onChange(async (value) => {
                    this._settings.value.datetime.timezone = value;
                    await this._settings.save();
                }));

        new Setting(e)
            .setName('Override locale')
            .setDesc(`Defaults to system local ("${DateTime.local().locale}").`)
            .addText(tz => tz
                .setValue(this._settings.value.datetime.locale)
                .onChange(async (value) => {
                    this._settings.value.datetime.locale = value;
                    await this._settings.save();
                }));

    }


    private createSection(e: HTMLElement, title: string) {
        e.createEl('h3', { text: title });
    }
}
