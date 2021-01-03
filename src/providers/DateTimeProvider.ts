import { TempleSettings } from "../settings/TempleSettings";
import { inject, injectable } from "tsyringe";
import { Symbols } from "../Symbols";
import { DateTime } from "luxon";


@injectable()
export class DateTimeProvider {
	constructor(@inject(Symbols.TempleSettings) private _settings: TempleSettings) { }

	public now(): DateTime {
		return this.apply(DateTime.local());
	}

	/**
	 * Apply locale and timezone settings
	 */
	public apply(dt: DateTime): DateTime {
		if (this._settings.datetime.locale) {
			dt = dt.setLocale(this._settings.datetime.locale);
		}
		if (this._settings.datetime.timezone) {
			dt = dt.setZone(this._settings.datetime.timezone);
		}
		return dt;
	}
}
