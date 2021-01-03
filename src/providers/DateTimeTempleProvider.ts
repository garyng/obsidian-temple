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

Returns the current date and time.

## Usage

{% raw %}\`\`\`
now: {{ datetime.now }}
\`\`\`{% endraw %}

outputs:

\`\`\`
now: {{ datetime.now }}
\`\`\`

## Formatting with \`dateFormat\` filter

\`dateFormat\` uses [Luxon](https://moment.github.io/luxon/index.html) under-the-hood for date formatting. For example:

{% raw %}\`\`\`
now (in ISO 8601): {{ datetime.now | dateFormat("YYYY-MM-DDTHH:mm:ssZ") }}
\`\`\`{% endraw %}

outputs:

\`\`\`
now (in ISO 8601): {{ datetime.now | dateFormat("YYYY-MM-DDTHH:mm:ssZ") }}
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