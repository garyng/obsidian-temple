import { App, FuzzySuggestModal } from 'obsidian';
import { ObsidianService } from './ObsidianService';

export class TempleFuzzySuggestModal extends FuzzySuggestModal<string> {

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
