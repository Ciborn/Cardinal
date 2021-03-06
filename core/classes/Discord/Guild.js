const poolQuery = require('./../../functions/database/poolQuery');
const isEmpty = require('./../../functions/utils/isEmpty');
const config = require('./../../../config.json');
const Cache = require('./../../classes/Cache');
module.exports = class DiscordGuild {
    constructor(guildId) {
        this.id = guildId;
    }

    async init(callback) {
        const cache = new Cache(this.id, 'guildSettings.json');
        if (cache.get('prefix') == undefined) {
            await this.updateGuildCache();
        } else {
            this.prefix = cache.get('prefix');
        }
        callback.bind(this)();
    }

    async updateGuildCache() {
        const guildData = await poolQuery(`SELECT * FROM guildssettings WHERE guildId='${this.id}'`);
        const cache = new Cache(this.id, 'guildSettings.json');
        if (isEmpty(guildData)) {
            await poolQuery(`INSERT INTO guildssettings (guildId, prefix) VALUES ('${this.id}', '${config.bot.defaultPrefix}')`);
            cache.set('prefix', config.bot.defaultPrefix);
            this.prefix = config.bot.defaultPrefix;
        } else {
            cache.set('prefix', guildData[0].prefix);
            this.prefix = guildData[0].prefix;
        }
    }
}