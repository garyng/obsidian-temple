import { TempleSettings } from "../settings/TempleSettings";
import { inject, injectable } from "tsyringe";
import { Symbols } from "../Symbols";
import { DateTime } from "luxon";


@injectable()
export class DateTimeProvider {
	constructor(@inject(Symbols.TempleSettings) private _settings: TempleSettings) { }
	now(): DateTime {
		let datetime = DateTime.local();
		if (this._settings.datetime.locale) {
			datetime = datetime.setLocale(this._settings.datetime.locale);
		}
		if (this._settings.datetime.timezone) {
			datetime = datetime.setZone(this._settings.datetime.timezone);
		}
		return datetime;
	}
}
