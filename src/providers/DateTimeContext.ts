import { DateTime } from 'luxon';

export class DateTimeContext {
	constructor(public now: DateTime) { }
}
