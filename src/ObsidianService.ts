import { Notice, Plugin_2, TFile, TFolder, Vault } from 'obsidian';
import { inject, injectable } from 'tsyringe';
import { TempleSettings } from './settings/TempleSettings';
import { Symbols } from './Symbols';
import { TempleFuzzySuggestModal } from './TempleFuzzySuggestModal';
import { TempleService } from './TempleService';

@injectable()
export class ObsidianService {
	private _prompt: TempleFuzzySuggestModal;

	constructor(@inject(Symbols.Plugin) private _obs: Plugin_2, private _temple: TempleService, @inject(Symbols.TempleSettings) private _settings: TempleSettings) {
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
		let dir = this._obs.app.vault.getAbstractFileByPath(this._settings.templatesDir);
		if (dir instanceof TFolder) {
			Vault.recurseChildren(dir, file => {
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
		var rendered = await this._temple.render(template);

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
}
