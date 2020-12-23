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

	resolve(): IAggregatedContext {
		let contexts = this._providers
			.map(provider => ({ name: provider.name, value: provider.provide() }))
			.filter(c => c.value != null)
			.map(c => ({ [c.name]: c.value }));
		return Object.assign({}, ...contexts);
	}

	render(template: string, aggregated: IAggregatedContext | null = null): string {
		aggregated ??= this.resolve();
		// only take the context from each TempleContext for nunjucks
		let context = _.mapValues(aggregated, c => c.context);
		return njk.renderString(template, context);
	}
}
