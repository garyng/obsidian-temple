import { Workspace } from 'obsidian';
import { ITempleProvider } from './ITempleProvider';
import { FileInfoContext } from './FileInfoContext';
import { TempleContext } from './TempleContext';
import { injectable } from 'tsyringe';
import { TempleDocsContext } from './TempleDocsContext';

@injectable()
export class FileInfoTempleProvider implements ITempleProvider<FileInfoContext> {
	name = 'file';

	constructor(private _workspace: Workspace) {
	}
	
    async docs(): Promise<TempleDocsContext<FileInfoContext>> {
        return {
            context: await this.provide(),
			template: `
# \`file\`

Exposes Obsidian's internal [\`TFile\`](https://github.com/obsidianmd/obsidian-api/blob/d10f2f6efc0d0d7c9bf96cd435ef376b18fbd6d8/obsidian.d.ts#L2206) structure for templating.

## Usages

{% raw %}\`\`\`
path: {{ file.path }}
name: {{ file.name }}
basename: {{ file.basename }}
extension: {{ file.extension }}
\`\`\`{% endraw %}

outputs:

\`\`\`
path: {{ file.path }}
name: {{ file.name }}
basename: {{ file.basename }}
extension: {{ file.extension }}
\`\`\`
`,
        }
    }

	async provide(): Promise<TempleContext<FileInfoContext>> {
		const file = this._workspace.getActiveFile();
		if (file == null)
			return null;
		return new TempleContext(file);
	}
}
