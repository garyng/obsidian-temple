import { Workspace } from 'obsidian';
import { ITempleProvider } from './ITempleProvider';
import { FileInfoContext } from './FileInfoContext';
import { TempleContext } from './TempleContext';
import { injectable } from 'tsyringe';

@injectable()
export class FileInfoTempleProvider implements ITempleProvider<FileInfoContext> {
	name = 'file';

	constructor(private _workspace: Workspace) {
	}

	async provide(): Promise<TempleContext<FileInfoContext>> {
		const file = this._workspace.getActiveFile();
		if (file == null)
			return null;
		return new TempleContext(file);
	}
}
