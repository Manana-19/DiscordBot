const db = require('./scripts/dbConfiguration');
const { Client, Guild } = require('discord.js');

/**
 * 
 * @param {Client} client Discord Client
 * @param {Guild} guild Required guild whose data is going to be registered
 * @param {db} db Configured Firestore Database
 */
// Creating this function is still work in progress 
const registerFunction = async(client, guild, db) => {
    const GuildDB = await db.collection(`serverCollection`).doc(guild.id).collection('config').doc('config_basic');
    const Data = {
        guildName:guild.name,
        ownerID:guild.ownerId,
        createdAt:guild.createdAt,
        joinedAt:guild.joinedAt,
        autoModeration_Enable:false,
        antiRaidModule_Enable:false,
        supportSystem_Enable:false,
        Moderation_Enable:false,
        logging:false,
    };
    await GuildDB.add(Data);
};
module.exports = registerFunction;