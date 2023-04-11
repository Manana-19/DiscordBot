const db = require('./scripts/dbConfiguration');
const { Client, User, Guild } = require('discord.js');
const {blackListEmbed} = require('../assets/premadeEmbeds.js');
/**
 * 
 * @param {Client} client Discord Client
 * @param {String} userID ID of the user who's going to be restricted from using this bot
 * @param {String} reason Reason to restrict the user from using this bot
 * @param {db} db Configured Firestore Database
 * @returns {boolean} Sends boolean if the function was successfully executed
 */

const blackListMember = async(client, userID, reason ,db) => {

    const Data = {
        userID:userID,
        reason:reason,
        date:new Date(),
        restricted: true
    };
    try {
        const restrictedCollection_User = db.collection('restricted_users').doc(userID);
        await restrictedCollection_User.add(Data);
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
 * @returns {boolean} Sends boolean if the function was successfully executed
 */

const blackListServer = async(client, guildID, reason, db) => {

    const Data = {
        guildID:guildID,
        reason:reason,
        date: new Date(),
        restricted: true
    };
    try {
        const restrictedCollection_Guild = db.collection('restricted_guilds').doc(guildID);
        await restrictedCollection_Guild.add(Data);
        const guild = await client.guilds.fetch(guildID);
        if (guild) {
            guild.leave();
        };
        return true;
    } catch(err) {
        console.log(`Error while blacklisting guild => ${err}`);
        return false;
    };
};
/**
 * 
 * @param {Client} client Discord Client
 * @param {User} user User to check if they're blacklisted
 * @param {db} db Configured firestore database
 * @returns {boolean} true if the user is blacklisted.
 */
const checkMember = async(client, user, db) => {
    const restrictedCollection_User = await db.collection('restricted_users').doc(user.id).get();   
    if (!restrictedCollection_User.exists || restrictedCollection_User.data().restricted === false) return false;
    if (restrictedCollection_User.data().restricted === true) return true;
};
/**
 * 
 * @param {Client} client Discord Client
 * @param {Guild} guild Guild to check if it is blacklisted
 * @param {db} db Configured firestore database
 * @returns {boolean} true if the guild is blacklisted
 */

const checkGuild = async(client, guild, db) => {
    const restrictedCollection_Guild = await db.collection('restricted_guilds').doc(guild.id).get();
    if (!restrictedCollection_Guild.exists) return false;
    if (restrictedCollection_Guild.data().restricted === true) {
        try {
            (await (await guild.fetchOwner()).createDM()).send({
                embeds:[blackListEmbed.setDescription('This guild is restricted from using this bot...')],
                ephemeral:true
            });
        } catch(err) {
            console.log(`Error occurred while Sending message to the blacklisted guild's owner:\n${err}`);
        };
        guild.leave();
        return true;
    };
    return false;
};

module.exports = {blackListMember, blackListServer, checkMember, checkGuild};