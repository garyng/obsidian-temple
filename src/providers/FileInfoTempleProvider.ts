import { Workspace } from 'obsidian';
import { ITempleProvider } from './ITempleProvider';
import { FileInfoContext } from './FileInfoContext';
import { TempleContext } from './TempleContext';

export class FileInfoTempleProvider implements ITempleProvider<FileInfoContext> {
	name: string = "file";

	constructor(private _workspace: Workspace) {
	}

	provide(): TempleContext<FileInfoContext> {
		var file = this._workspace.getActiveFile();
		if (file == null)
			return null;
		return new TempleContext(file);
	}
}