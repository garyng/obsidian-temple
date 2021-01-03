import { TempleContext } from './TempleContext';

export interface TempleDocsContext<T> {
    context: TempleContext<T>;
    template: string;
}
