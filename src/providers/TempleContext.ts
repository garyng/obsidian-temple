export class TempleContext<T> {
	// todo: include additional metadata
	constructor(public context: T, public metadata: any = null) {
	}
}
