import * as njk from 'nunjucks';
import * as _ from 'lodash';
import { ITempleProvider } from './providers/ITempleProvider';
import { TempleContext } from './providers/TempleContext';

export interface IAggregatedContext {
	[name: string]: TempleContext<any>;
}

export class TempleService {
	private _providers: ITempleProvider<any>[] = [];

	register(provider: ITempleProvider<any>): void {
		this._providers.push(provider);
	}

	async resolve(): Promise<IAggregatedContext> {
		let contexts = (await Promise.all(this._providers
			.map(async provider => ({ name: provider.name, value: await provider.provide() }))))
			.filter(c => c.value != null)
			.map(c => ({ [c.name]: c.value }));
		return Object.assign({}, ...contexts);
	}

	async render(template: string, aggregated: IAggregatedContext | null = null): Promise<string> {
		aggregated ??= await this.resolve();
		// only take the context from each TempleContext for nunjucks
		let context = _.mapValues(aggregated, c => c.context);
		return njk.renderString(template, context);
	}
}
