import { TempleContext } from "./TempleContext";

export interface ITempleProvider<T> {
	name: string;
	provide(): Promise<TempleContext<T>> | null;
}
