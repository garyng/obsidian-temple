export const DEFAULT_SETTINGS: TempleSettings = {
    templatesDir: "/_templates",
    zettel: {
        regex: ""
    }
}

export interface TempleSettings {
    templatesDir: string;
    zettel: {
        regex: string
    };
}
