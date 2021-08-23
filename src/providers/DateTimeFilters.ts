import { DateTime } from 'luxon';
import { injectable } from 'tsyringe';
import { DateTimeProvider } from './DateTimeProvider';

@injectable()
export class DateTimeFilters {

    constructor(private _datetime: DateTimeProvider) {
    }

    public format(input: DateTime, format: string | null = null): string {
        if (format === null) {
            // TODO: Add setting for default time format (here iso8601)
            format = "yyyy-LL-dd HH:mm:ss ZZZZ";
        }
        return this._datetime.apply(input).toFormat(format);
    }
}
