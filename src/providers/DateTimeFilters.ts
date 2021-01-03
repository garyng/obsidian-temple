import { injectable } from 'tsyringe';
import { DateTime } from 'luxon';
import { DateTimeProvider } from './DateTimeProvider';

@injectable()
export class DateTimeFilters {

	constructor(private _datetime: DateTimeProvider) {
	}

	public format(input: DateTime, format: string): string {
		return this._datetime.apply(input).toFormat(format);
	}
}
