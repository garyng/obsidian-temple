import { DateTime } from 'luxon';
import { inject, injectable } from 'tsyringe';
import { TempleSettings } from '../settings/TempleSettings';
import { Symbols } from '../Symbols';


@injectable()
export class DateTimeProvider {
    constructor(@inject(Symbols.TempleSettings) private _settings: TempleSettings) { }

    public now(): DateTime {
        return this.apply(DateTime.local());
    }

    /**
     * Apply locale and timezone settings, also cast JS Date (returned from other APIs)
     *
     * Since apply is called by all filters that return a DateTime to ensure that
     * settings are respected all implicit conversion and maniputlations should be
     * concentrated here.
     */
    public apply(dt: DateTime | Date | number): DateTime {
        // Type verification and casting
        if (typeof dt == "number") {
            dt = DateTime.fromMillis(dt as number);
        } else if (dt instanceof Date) {
            dt = DateTime.fromJSDate(dt as Date);
        } else if (!(dt instanceof DateTime)) {
            console.error("Rejected DateTime value:", dt)
            throw TypeError("Only DateTime, Date and ints are accepted for date filters");
        }

        // Apply localization settings
        if (this._settings.datetime.locale) {
            dt = dt.setLocale(this._settings.datetime.locale);
        }
        if (this._settings.datetime.timezone) {
            dt = dt.setZone(this._settings.datetime.timezone);
        }

        return dt;
    }
}
