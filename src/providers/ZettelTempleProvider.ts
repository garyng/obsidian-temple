import { Workspace } from 'obsidian';
import { TempleSettings } from 'src/settings/TempleSettings';
import { Symbols } from 'src/Symbols';
import { inject, injectable } from 'tsyringe';
import { ITempleProvider } from './ITempleProvider';
import { TempleContext } from './TempleContext';
import { ZettelContext } from './ZettelContext';

@injectable()
export class ZettelTempleProvider implements ITempleProvider<ZettelContext> {
    name: string = "zettel";

    constructor(private _workspace: Workspace, @inject(Symbols.TempleSettings) private _settings: TempleSettings) {

    }

    async provide(): Promise<TempleContext<ZettelContext>> {
        let file = this._workspace.getActiveFile();
        if (file == null)
            return null;

        let context = this.extractPrefix(file.basename) 
            ?? this.extractSuffix(file.basename);

        if (this._settings.zettel.regex)
        {
            // override if a custom regex is set
            context = this.extractCustom(file.basename);
        }
        return new TempleContext(context);
    }

    /**
     * use custom regex from settings for extraction
     */
    extractCustom(name: string): ZettelContext {
        let regex = new RegExp(this._settings.zettel.regex, "gm")
        return this.extract(name, regex);
    }

    /**
     * <uid> <title>
     */
    extractPrefix(name: string): ZettelContext {
        return this.extract(name, /(?<uid>^\d+)(\s(?<title>.*$))?/gm);
    }

    /**
     * <title> <uid>
     */
    extractSuffix(name: string): ZettelContext {
        return this.extract(name, /((?<title>^.*)\s)?(?<uid>\d+$)/gm);
    }

    extract(name: string, regex: RegExp) {
        let matches = regex.exec(name);
    
        if (matches?.groups == null) return null;
        let { groups: { uid, title } } = matches;

        return new ZettelContext(uid, title);
    }
}
