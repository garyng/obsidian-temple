import { TempleContext } from "./TempleContext";
import { TempleDocsContext } from "./TempleDocsContext";

export interface ITempleProvider<T> {
	name: string;
	
	docs(): Promise<TempleDocsContext<T>>;
	provide(): Promise<TempleContext<T>> | null;
}
