import { ITempleProvider } from './ITempleProvider';
import { DateTimeContext } from './DateTimeContext';
import { TempleContext } from './TempleContext';
import { injectable } from 'tsyringe';
import { DateTimeProvider } from './DateTimeProvider';
import { TempleDocsContext } from './TempleDocsContext';

@injectable()
export class DateTimeTempleProvider implements ITempleProvider<DateTimeContext> {
    name = 'datetime';

    constructor(private _datetime: DateTimeProvider) { }

    async docs(): Promise<TempleDocsContext<DateTimeContext>> {
        return {
            context: await this.provide(),
            template: `
# \`datetime\`

Returns the current date and time as Luxon [\`DateTime\`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e5e63b56d6bb52a95cc5e7cfadc5d1bec3023f14/types/luxon/index.d.ts#L151).

## Usage

{% raw %}\`\`\`
now: {{ datetime.now }}

day: {{ datetime.now.day }}
month: {{ datetime.now.month }}
year: {{ datetime.now.year }}

hour: {{ datetime.now.hour }}
minute: {{ datetime.now.minute }}
second: {{ datetime.now.second }}
\`\`\`{% endraw %}

outputs:

\`\`\`
now: {{ datetime.now }}

day: {{ datetime.now.day }}
month: {{ datetime.now.month }}
year: {{ datetime.now.year }}

hour: {{ datetime.now.hour }}
minute: {{ datetime.now.minute }}
second: {{ datetime.now.second }}
\`\`\`


## Formatting with \`dateFormat\` filter

\`dateFormat\` uses [Luxon](https://moment.github.io/luxon/index.html) under-the-hood for date formatting. For example:

{% raw %}\`\`\`
now: {{ datetime.now | dateFormat("ffff") }}
\`\`\`{% endraw %}

outputs:

\`\`\`
now: {{ datetime.now | dateFormat("ffff") }}
\`\`\`

See [Luxon's documentation](https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens) for a complete list of formatting tokens that can be used.

# Settings

You can override the default locale and timezone under Settings.
`
        }
    }

    async provide(): Promise<TempleContext<DateTimeContext>> {
        return new TempleContext(new DateTimeContext(this._datetime.now()));
    }
}