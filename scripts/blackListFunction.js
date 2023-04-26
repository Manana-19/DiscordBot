const db = require('./dbConfiguration.js');
const { Client, User, Guild } = require('discord.js');
/**
 * 
 * @param {Client} client Discord Client
 * @param {String} userID ID of the user who's going to be restricted from using this bot
 * @param {String} reason Reason to restrict the user from using this bot
 * @returns {Promise < true | false >} Sends boolean if the function was successfully executed
 */

const blackListMember = async(client, userID, reason) => {

    const Data = {
        userID:userID,
        reason:reason,
        date:new Date(),
        restricted: true
    };
    try {
        const restrictedCollection_User = db.collection('restricted_users').doc(userID);
        await restrictedCollection_User.set(Data);
        return true;
    } catch(err) {
        console.log(err);
        return false;
    } 
};

/**
 * 
 * @param {Client} client Discord Client
 * @param {String} guildID ID of the guild which is going to be restricted from using this bot
 * @param {String} reason Reason to restrict the user from using this bot
 * @param {db} db Configured Firestore Database
 * @returns {Promise < true | false >} Sends boolean if the function was successfully executed
 */

const blackListServer = async(client, guildID, reason) => {

    const Data = {
        guildID:guildID,
        reason:reason,
        date: new Date(),
        restricted: true
    };
    try {
        const restrictedCollection_Guild = db.collection('restricted_guilds').doc(guildID);
        await restrictedCollection_Guild.set(Data);
        const guild = await client.guilds.fetch(guildID);
        if (guild) {
            guild.leave();
        };
        return true;
    } catch(err) {
        console.log(`Error while blacklisting guild => ${err}`);
        return undefined;
    };
};


module.exports = { blackListMember, blackListServer};