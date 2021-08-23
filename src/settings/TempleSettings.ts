export const DEFAULT_SETTINGS: TempleSettings = {
    templatesDir: '_templates',
    zettel: {
        regex: ''
    },
    datetime: {
        format: 'yyyy-MM-dd HH:mm',
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
        format: string,
        locale: string,
        timezone: string
    }
}