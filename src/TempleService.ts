import * as njk from 'nunjucks';
import * as _ from 'lodash';
import { ITempleProvider } from './providers/ITempleProvider';
import { TempleContext } from './providers/TempleContext';

export class TempleService {
	// todo: discover all variables provider
	// todo: render templates
	// todo: output to an object instead 
	// {
	// 	newContent: "xxx",
	// }
	private _providers: ITempleProvider<any>[] = [];

	register(provider: ITempleProvider<any>): void {
		this._providers.push(provider);
	}

	resolve(): { [name: string]: TempleContext<any>; } {
		let contexts = this._providers.map(provider => ({ [provider.name]: provider.provide() }));
		return Object.assign({}, ...contexts);
	}

	render(template: string): string {
		let aggregated = this.resolve();
		// only take the context from each TempleContext for nunjucks
		let context = _.mapValues(aggregated, context => context.context);
		return njk.renderString(template, context);
	}
}
