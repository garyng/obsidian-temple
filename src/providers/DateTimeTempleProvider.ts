import { ITempleProvider } from './ITempleProvider';
import { DateTimeContext } from './DateTimeContext';
import { TempleContext } from './TempleContext';
import { injectable } from 'tsyringe';

@injectable()
export class DateTimeTempleProvider implements ITempleProvider<DateTimeContext> {
	name: string = "datetime";

	async provide(): Promise<TempleContext<DateTimeContext>> {
		return new TempleContext(new DateTimeContext(new Date()));
	}
}