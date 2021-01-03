import { read } from "clipboardy";
import { ITempleProvider } from "./ITempleProvider";
import { TempleContext } from "./TempleContext";
import { ClipboardContext } from "./ClipboardContext";
import { injectable } from "tsyringe";

@injectable()
export class ClipboardTempleProvider implements ITempleProvider<ClipboardContext> {
	name: string = "clipboard";

	async provide(): Promise<TempleContext<ClipboardContext>> {
		let text = await read();
		return new TempleContext(new ClipboardContext(
			text
		));
	}

}
