import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';
import { TempleSettings } from '../settings/TempleSettings';
import { Symbols } from '../Symbols';
import { DateTimeProvider } from './DateTimeProvider';

export class DateTimeParsingError extends Error { }

@injectable()
export class DateTimeFilters {

    constructor(private _datetime: DateTimeProvider, @inject(Symbols.TempleSettings) private _settings: TempleSettings) {
    }

    public format(input: DateTime, format: string | null = null): string {
        return this._datetime
            .apply(input)
            .toFormat(format || this._settings.datetime.format);
    }

    public parse(input: string, format: string): DateTime {
        if (!format) throw TypeError("A format is required for parseDate")
        const parsed = DateTime.fromFormat(input, format)
        if (parsed.invalidReason) throw new DateTimeParsingError(`${parsed.invalidReason}: ${parsed.invalidExplanation}`);
        return parsed
    }
}
