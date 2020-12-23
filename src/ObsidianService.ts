import { App, FuzzySuggestModal, Notice, Plugin, TFile, TFolder, Vault } from 'obsidian';
import { DEFAULT_SETTINGS, TempleSettings } from './settings/TempleSettings';
import { TempleService } from './TempleService';

class TempleFuzzySuggestModal extends FuzzySuggestModal<string> {

	constructor(app: App, private _obs: ObsidianService) {
		super(app);
	}

	getItems(): string[] {
		return this._obs.getTemplatePaths();
	}
	getItemText(item: string): string {
		return item;
	}
	onChooseItem(item: string, evt: MouseEvent | KeyboardEvent): void {
		this._obs.insertTemplate(item);
	}
}


export class ObsidianService {
	public settings: TempleSettings;
	private _prompt: TempleFuzzySuggestModal;

	constructor(private _obs: Plugin, private _temple: TempleService) {
		this._prompt = new TempleFuzzySuggestModal(_obs.app, this);
	}

	/**
	 * Ask user to select a template if there are multiple defined.
	 */
	public async promptTemplate() {
		let templates = this.getTemplatePaths();
		if (templates.length > 1) {
			this._prompt.open();
		} else {
			await this.insertTemplate(templates[0]);
		}
	}

	/**
	 * Get the paths of all templates defined in the template directory.
	 */
	public getTemplatePaths(): string[] {
		let templates: string[] = [];
		let dir = this._obs.app.vault.getAbstractFileByPath(this.settings.templatesDir);
		if (dir instanceof TFolder) {
			Vault.recurseChildren(dir , file => {
				if (file instanceof TFile) {
					templates.push(file.path);
				}
			});
		}

		return templates;
	}

	/**
	 * Render and insert the selected template.
	 */
	public async insertTemplate(path: string) {
		
		let active = this._obs.app.workspace.getActiveFile();
		if (active == null) {
			new Notice("No active file!");
			return;
		}
		let content = await this._obs.app.vault.read(active);
		let template = await this.readFile(path);
		var rendered = this._temple.render(template);

		let newContent = content + rendered;

		await this._obs.app.vault.modify(active, newContent);
	}

	public async readFile(path: string): Promise<string> {
		let file = this._obs.app.vault.getAbstractFileByPath(path);
		if (file instanceof TFile) {
			return await this._obs.app.vault.read(file);
		} else {
			throw new Error(`Unable to read '${file?.path}'`);
		}
	}

	public async loadSettings() {
		this.settings = Object.assign(DEFAULT_SETTINGS, await this._obs.loadData());
	}

	public async saveSettings() {
		await this._obs.saveData(this.settings);
	}
}
