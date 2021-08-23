import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';
import { TempleSettings } from '../settings/TempleSettings';
import { Symbols } from '../Symbols';
import { DateTimeProvider } from './DateTimeProvider';

@injectable()
export class DateTimeFilters {

    constructor(private _datetime: DateTimeProvider, @inject(Symbols.TempleSettings) private _settings: TempleSettings) {
    }

    public format(input: DateTime, format: string | null = null): string {
        return this._datetime
            .apply(input)
            .toFormat(format || this._settings.datetime.format);
    }
}
