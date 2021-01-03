import * as njk from 'nunjucks';
import * as _ from 'lodash';
import { ITempleProvider } from './providers/ITempleProvider';
import { TempleContext } from './providers/TempleContext';
import { injectable, injectAll } from 'tsyringe';
import { Symbols } from './Symbols';
import dayjs from 'dayjs';
import * as localesfrom 'dayjs/locale/*';
import localizedFormat from 'dayjs/plugin/localizedFormat';
// import advancedFormat from 'dayjs/plugin/advancedFormat';

export interface IAggregatedContext {
	[name: string]: TempleContext<any>;
}


class DayJsFilters {
	static format(input: Date, format: string) {
		return dayjs(input).format(format);
	}
}

@injectable()
export class TempleService {
	private _env: njk.Environment;
	constructor(@injectAll(Symbols.ITempleProvider) private _providers: ITempleProvider<any>[]) {
		this._env = new njk.Environment();
		this.initDayJs();
		this.installFilters();
	}

	private initDayJs() {
		dayjs.extend(localizedFormat);
		// dayjs.extend(advancedFormat);

		if (true) {
			let locale = require('dayjs/locale/zh-cn');
			dayjs.locale(locale);
		}

		// todo: utc
		// todo: advancedFormat
		// todo: timezone
	}

	private installFilters() {
		this._env.addFilter("dateFormat", DayJsFilters.format);
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
		return this._env.renderString(template, context);
	}
}