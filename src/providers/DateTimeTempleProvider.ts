import { ITempleProvider } from './ITempleProvider';
import { DateTimeContext } from './DateTimeContext';
import { TempleContext } from './TempleContext';

export class DateTimeTempleProvider implements ITempleProvider<DateTimeContext> {
	name: string = "datetime";

	provide(): TempleContext<DateTimeContext> {
		return new TempleContext(new DateTimeContext(new Date()));
	}
}