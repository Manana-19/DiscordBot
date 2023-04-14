const db = require('./dbConfiguration');
const { Client, Guild, ChannelType } = require('discord.js');

/**
 * 
 * @param {Client} client Discord Client
 * @param {Guild} guild Required guild whose data is going to be registered
 * @param {db} db Configured Firestore Database
 */


const registerFunction = async(client, guild, db) => {
    const BasicConfig = db.collection(`serverCollection`).doc(guild.id).collection('config').doc('config_basic');
    const Data1 = {
        guild_name:guild.name,
        ownerID:guild.ownerId,
        createdAt:guild.createdAt,
        joinedAt:guild.joinedAt,
        auto_moderation_enable:false,
        anti_raid_enable:false,
        support_enable:false,
        moderation_enable:true,
        logging:true,
    };
    await BasicConfig.add(Data1);

    const ModuleConfig = db.collection('serverCollection').doc(guild.id).collection('config').doc(`config_moderation`);
    const channel = await guild.channels.create({
        name:'logchannel',
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id:guild.id,
                deny:['ViewChannel','SendMessages','CreatePrivateThreads','CreatePublicThreads','CreateInstantInvite']
            }
        ]
    });

    const webhook = await channel.createWebhook({
        name:client.user.username,
        avatar:client.user.displayAvatarURL()
    });

    const Data2 = {
        log_channel:channel.id,
        log_webhook:webhook.url,
        log_command_usage:true,
        infractionlimit_usage:true,
        infractionlimit_mute:3,
        infractionlimit_kick:5,
        infractionlimit_ban:9,
    };

    await ModuleConfig.set(Data2,{merge:true});

};

const createSupportSystem = async(client, guild, whitelisted_role, owner) => {
    // Function for creating the support system for the server
};

module.exports =  {registerFunction};