import { TempleContext } from "./TempleContext";

export interface ITempleProvider<T> {
	name: string;
	provide(): TempleContext<T> | null;
}
