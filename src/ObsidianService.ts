import { MarkdownSourceView, MarkdownView, Notice, Plugin_2, TFile, TFolder, Vault } from 'obsidian';
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
	public async promptTemplate(): Promise<void> {
		const templates = this.getTemplatePaths();
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
		const templates: string[] = [];
		const dir = this._obs.app.vault.getAbstractFileByPath(this._settings.templatesDir);
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
	public async insertTemplate(path: string): Promise<void> {
		const template = await this.readFile(path);
		const rendered = await this._temple.render(template);

		this.insertAtCursor(rendered);
	}

	private insertAtCursor(text: string): void {
		const view = this._obs.app.workspace.getActiveViewOfType(MarkdownView);
		if (view && view.currentMode instanceof MarkdownSourceView) {
			const editor = view.sourceMode.cmEditor;
			const doc = editor.getDoc();
			doc.replaceSelection(text);
		}
	}

	/**
	 * Insert the documentation of all providers.
	 */
	public async insertDocs(): Promise<void> {
		const doc = await this._temple.renderDoc();
		this.insertAtCursor(doc);
	}

	public async readFile(path: string): Promise<string> {
		const file = this._obs.app.vault.getAbstractFileByPath(path);
		if (file instanceof TFile) {
			return await this._obs.app.vault.read(file);
		} else {
			throw new Error(`Unable to read '${file?.path}'`);
		}
	}
}
