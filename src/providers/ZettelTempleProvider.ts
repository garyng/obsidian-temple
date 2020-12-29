import { Workspace } from 'obsidian';
import { ITempleProvider } from './ITempleProvider';
import { TempleContext } from './TempleContext';
import { ZettelContext } from './ZettelContext';

export class ZettelTempleProvider implements ITempleProvider<ZettelContext> {
    name: string = "zettel";

    constructor(private _workspace: Workspace) {

    }

    async provide(): Promise<TempleContext<ZettelContext>> {
        let file = this._workspace.getActiveFile();
        if (file == null)
            return null;

        let context = this.extractPrefix(file.basename) 
            ?? this.extractSuffix(file.basename);

        return new TempleContext(context);
    }

    /**
     * <uid> <title>
     */
    extractPrefix(name: string): ZettelContext {
        return this.extract(name, /(?<uid>^\d+)\s(?<title>.*$)/gm);
    }

    /**
     * <title> <uid>
     */
    extractSuffix(name: string): ZettelContext {
        return this.extract(name, /(?<title>^.*)\s(?<uid>\d+$)/gm);
    }

    extract(name: string, regex: RegExp) {
        let matches = regex.exec(name);

        if (matches == null) return null;
        let { groups: { uid, title } } = matches;

        return new ZettelContext(uid, title);
    }
}
