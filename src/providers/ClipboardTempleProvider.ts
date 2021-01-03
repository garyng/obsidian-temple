import { read } from 'clipboardy';
import { ITempleProvider } from './ITempleProvider';
import { TempleContext } from './TempleContext';
import { ClipboardContext } from './ClipboardContext';
import { injectable } from 'tsyringe';
import { TempleDocsContext } from './TempleDocsContext';

@injectable()
export class ClipboardTempleProvider implements ITempleProvider<ClipboardContext> {
	name = 'clipboard';

	async docs(): Promise<TempleDocsContext<ClipboardContext>> {
		return {
			context: await this.provide(),
			template: `
# \`clipboard\`
Extracts data from your system clipboard. Uses [sindresorhus/clipboardy](https://github.com/sindresorhus/clipboardy).

## Usages

{% raw %}\`\`\`
text: {{ clipboard.text }}
\`\`\`{% endraw %}

outputs:

\`\`\`
text: {{ clipboard.text }}
\`\`\`
`,
		}
	}

	async provide(): Promise<TempleContext<ClipboardContext>> {
		const text = await read();
		return new TempleContext(new ClipboardContext(
			text
		));
	}

}
