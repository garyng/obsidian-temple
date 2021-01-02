import { Workspace } from 'obsidian';
import { ITempleProvider } from './ITempleProvider';
import { FileInfoContext } from './FileInfoContext';
import { TempleContext } from './TempleContext';
import { injectable } from 'tsyringe';

@injectable()
export class FileInfoTempleProvider implements ITempleProvider<FileInfoContext> {
	name: string = "file";

	constructor(private _workspace: Workspace) {
	}

	async provide(): Promise<TempleContext<FileInfoContext>> {
		var file = this._workspace.getActiveFile();
		if (file == null)
			return null;
		return new TempleContext(file);
	}
}
