import * as _ from 'lodash';
import { DateTime } from 'luxon';
import * as njk from 'nunjucks';
import { EOL } from 'os';
import { injectable, injectAll } from 'tsyringe';
import { inspect } from 'util';
import { DateTimeFilters } from './providers/DateTimeFilters';
import { ITempleProvider } from './providers/ITempleProvider';
import { TempleContext } from './providers/TempleContext';
import { Symbols } from './Symbols';

export interface IAggregatedContext {
    [name: string]: TempleContext<any>;
}

@injectable()
export class TempleService {
    private _env: njk.Environment;
    constructor(private _dateTimeFilters: DateTimeFilters, @injectAll(Symbols.ITempleProvider) private _providers: ITempleProvider<any>[]) {
        this._env = new njk.Environment();
        this.installFilters();
    }

    private installFilters() {

        // seems like this won't properly capture the variable
        // this._env.addFilter('dateFormat', this._dateTimeFilters.format);

        this._env.addFilter('dateFormat', (input: DateTime, format: string) => {
            // NOTE: By convention actions should start with a verb rather than a noun
            console.warn("The `dateFormat` filter is deprecated in favor of `formatDate`");
            return this._dateTimeFilters.format(input, format);
        });

        // TODO: Add documentation
        this._env.addFilter('formatDate', (input: DateTime, format: string) => {
            return this._dateTimeFilters.format(input, format);
        });

        // TODO: Add documentation
        this._env.addFilter('parseDate', (input: string, format: string) => {
            return this._dateTimeFilters.parse(input, format)
        })

        // TODO: Add documentation
        this._env.addFilter('inspect', (input: any, depth: null) => {
            return inspect(input, undefined, depth);
        })
    }

    async resolve(): Promise<IAggregatedContext> {
        const contexts = (await Promise.all(this._providers
            .map(async provider => ({ name: provider.name, value: await provider.provide() }))))
            .filter(c => c.value != null)
            .map(c => ({ [c.name]: c.value }));
        return Object.assign({}, ...contexts);
    }

    async render(template: string, aggregated: IAggregatedContext | null = null): Promise<string> {

        aggregated ??= await this.resolve();
        // only take the context from each TempleContext for nunjucks
        const context = _.mapValues(aggregated, c => c.context);

        return this._env.renderString(template, context);
    }

    async renderDoc(): Promise<string> {

        const doc = (await Promise.all(this._providers
            .map(async provider => {
                const doc = await provider.docs();
                return this._env.renderString(doc.template, ({
                    [provider.name]: doc.context.context
                }));
            })))
            .join(`${EOL}---${EOL}`);

        return doc;
    }
}