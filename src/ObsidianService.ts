import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, TempleSettings } from './settings/TempleSettings';

export class ObsidianService {
	// todo: prompt for templates
	// todo: read file
	// todo: append file
	// todo: write file
	public settings: TempleSettings;

	constructor(private _obs: Plugin) {
	}

	private promptTemplate() {
		return;
	}

	public insertTemplateCommand() {
	}

	private readFile() {
	}

	public async loadSettings() {
		this.settings = Object.assign(DEFAULT_SETTINGS, await this._obs.loadData());
	}

	public async saveSettings() {
		await this._obs.saveData(this.settings);
	}
}
