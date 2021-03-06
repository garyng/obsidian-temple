import * as njk from 'nunjucks';
import * as _ from 'lodash';
import { ITempleProvider } from './providers/ITempleProvider';
import { TempleContext } from './providers/TempleContext';
import { injectable, injectAll } from 'tsyringe';
import { Symbols } from './Symbols';
import { DateTime } from 'luxon';
import { DateTimeFilters } from './providers/DateTimeFilters';
import { EOL } from 'os';
import { inspect } from 'util';

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
			return this._dateTimeFilters.format(input, format);
		});

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