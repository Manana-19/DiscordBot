const db = require('./dbConfiguration');
const { Client, Guild, ChannelType, Role, GuildMember } = require('discord.js');

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
    await BasicConfig.set(Data1);

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
        mod_roles:[],
        restricted_channels:[],
        restricted_parents:[],
    };

    await ModuleConfig.set(Data2,{merge:true});

    // Creating Log Area with the collection's ID

    const logCount = db.collection('serverCollection').doc(guild.id).collection('logCount').doc('logCount');
    await logCount.set({
        ID:0
    },{merge:true});

    const logArea = db.collection('serverCollection').doc(guild.id).collection('logArea').doc('0');
    const logData = {
        userID:guild.ownerId,
        type:'create',
        data:'Registration of Data in bot',
        reason:undefined
    };
    await logArea.set(logData);

};
/**
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 * @param {Role} whitelisted_role 
 * @param {db} db 
 */
const createSupportSystem = async(client, guild, whitelisted_role, db) => {
    
    const parent = await guild.channels.create({
        type:ChannelType.GuildCategory,
        name:'ModMail',
        permissionOverwrites:[
            {
                id:guild.id,
                deny:['ViewChannel','SendMessages','Connect','CreatePublicThreads','CreatePrivateThreads']
            },
            {
                id:whitelisted_role.id,
                allow:['ViewChannel','SendMessages'],
            },
        ]
    });

    const mail_logs = await guild.channels.create({
        type:ChannelType.GuildText,
        name:'logs',
        parent:parent.id,
    });

    mail_logs.lockPermissions();

    const ModuleConfig = db.collection('serverCollection').doc(guild.id).collection('config').doc('config_basic');
    
    await ModuleConfig.update({
        support_enable:true
    });

    const SupportConfig = db.collection('serverCollection').doc(guild.id).collection('config').doc('config_support');
    
    const DataToSet = {
        parent_id:parent.id,
        log_id:mail_logs.id,
        allow_roles:[whitelisted_role.id],
        ticket_id:0,
        disabled:false,
        mention_role:[whitelisted_role.id],
    };

    await SupportConfig.set(DataToSet);
    
};

module.exports =  {registerFunction, createSupportSystem};