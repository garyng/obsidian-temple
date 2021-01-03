export const DEFAULT_SETTINGS: TempleSettings = {
    templatesDir: '/_templates',
    zettel: {
        regex: ''
    },
    datetime: {
        locale: '',
        timezone: ''
    }
}

export interface TempleSettings {
    templatesDir: string;
    zettel: {
        regex: string
    };
    datetime: {
        locale: string,
        timezone: string
    }
}