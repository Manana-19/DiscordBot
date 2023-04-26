const db = require('./dbConfiguration.js');
const { User, Client, Guild } = require('discord.js');
/**
 * 
 * @param {Client} client Discord Client
 * @param {User} user User to check if they're blacklisted
 * @returns {Promise < true | false >} Sends boolean if the function was successfully executed
 */
const checkMember = async(client, user) => {
    const restrictedCollection_User = await db.collection('restricted_users').doc(user.id).get();
    try { 
        if (!restrictedCollection_User.exists) return false;
        if (restrictedCollection_User.data().restricted === true) return true;
        return false;
    } catch(err) {
        console.log(err)
        return false;
    };
};
/**
 * 
 * @param {Client} client Discord Client
 * @param {Guild} guild Guild to check if it is blacklisted
 * @returns {Promise < true | false >} Sends boolean if the function was successfully executed
 */

const checkGuild = async(client, guild) => {
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
module.exports = { checkGuild, checkMember};