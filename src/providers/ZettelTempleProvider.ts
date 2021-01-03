import { Workspace } from 'obsidian';
import { TempleSettings } from 'src/settings/TempleSettings';
import { Symbols } from 'src/Symbols';
import { inject, injectable } from 'tsyringe';
import { ITempleProvider } from './ITempleProvider';
import { TempleContext } from './TempleContext';
import { TempleDocsContext } from './TempleDocsContext';
import { ZettelContext } from './ZettelContext';

@injectable()
export class ZettelTempleProvider implements ITempleProvider<ZettelContext> {
    name = 'zettel';

    constructor(private _workspace: Workspace, @inject(Symbols.TempleSettings) private _settings: TempleSettings) {

    }

    async docs(): Promise<TempleDocsContext<ZettelContext>> {
        return {
            context: new TempleContext(this.extract('20201224030406 title.md')),
            template: `
# \`zettel\`

Extracts uid and title from notes that have the Zettelkasten ID.

## Usages

Given a file named \`20201224030406 title.md\`, the following template

{% raw %}\`\`\`
uid: {{ zettel.uid }}
title: {{ zettel.title }}
\`\`\`{% endraw %}

outputs:

\`\`\`
uid: {{ zettel.uid }}
title: {{ zettel.title }}
\`\`\`

Works even if the \`uid\` is used as a suffix, eg. \`title 20201224030406.md\`.

## Settings

You can override the extraction regex under Settings.
`
        }
    }

    async provide(): Promise<TempleContext<ZettelContext>> {
        const file = this._workspace.getActiveFile();
        if (file == null)
            return null;
        const context = this.extract(file.basename);
        return new TempleContext(context);
    }

    extract(name: string): ZettelContext {
        let context = this.extractPrefix(name)
            ?? this.extractSuffix(name);

        if (this._settings.zettel.regex) {
            // override if a custom regex is set
            context = this.extractCustom(name);
        }
        return context;
    }

    /**
     * use custom regex from settings for extraction
     */
    extractCustom(name: string): ZettelContext {
        const regex = new RegExp(this._settings.zettel.regex, 'gm')
        return this.extractRegex(name, regex);
    }

    /**
     * <uid> <title>
     */
    extractPrefix(name: string): ZettelContext {
        return this.extractRegex(name, /(?<uid>^\d+)(\s(?<title>.*$))?/gm);
    }

    /**
     * <title> <uid>
     */
    extractSuffix(name: string): ZettelContext {
        return this.extractRegex(name, /((?<title>^.*)\s)?(?<uid>\d+$)/gm);
    }

    extractRegex(name: string, regex: RegExp): ZettelContext {
        const matches = regex.exec(name);

        if (matches?.groups == null) return null;
        const { groups: { uid, title } } = matches;

        return new ZettelContext(uid, title);
    }
}
