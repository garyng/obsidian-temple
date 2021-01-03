import { Plugin_2 } from "obsidian";
import { Symbols } from "src/Symbols";
import { inject, injectable } from "tsyringe";
import { TempleSettings, DEFAULT_SETTINGS } from "./TempleSettings";

@injectable()
export class TempleSettingsProvider {
    public value: TempleSettings;

    constructor(@inject(Symbols.Plugin) private _plugin: Plugin_2) {
    }

    public async load() {
        this.value = Object.assign(DEFAULT_SETTINGS, await this._plugin.loadData());
        
    }

    public async save() {
        await this._plugin.saveData(this.value);
    }
}
