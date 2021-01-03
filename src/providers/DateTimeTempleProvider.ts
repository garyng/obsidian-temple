import { ITempleProvider } from './ITempleProvider';
import { DateTimeContext } from './DateTimeContext';
import { TempleContext } from './TempleContext';
import { injectable } from 'tsyringe';
import { DateTimeProvider } from './DateTimeProvider';

@injectable()
export class DateTimeTempleProvider implements ITempleProvider<DateTimeContext> {
	name = 'datetime';

	constructor(private _datetime: DateTimeProvider) {}

	async provide(): Promise<TempleContext<DateTimeContext>> {
		return new TempleContext(new DateTimeContext(this._datetime.now()));
	}
}