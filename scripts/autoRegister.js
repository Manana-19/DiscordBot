const db = require('./dbConfiguration.js');
const { Client, Guild, ChannelType, Role, GuildMember, EmbedBuilder } = require('discord.js');
const toUnix = require('./unixTime.js');
const logModule = require(`./logModule.js`);

/**
 * 
 * @param {Client} client Discord Client
 * @param {Guild} guild Required guild whose data is going to be registered
 */


const registerFunction = async(client, guild) => {

    // Fetching the Path in database and structuring the data with it's respective module. Also Fetching the owner too
    const BasicConfig = db.collection(`serverCollection`).doc(guild.id).collection('config').doc('config_basic');
    const ModuleConfig = db.collection('serverCollection').doc(guild.id).collection('config').doc(`config_moderation`);
    const logCount = db.collection('serverCollection').doc(guild.id).collection('log').doc('logCount');
    const logArea = db.collection('serverCollection').doc(guild.id).collection('log').doc('0');
    const user = (await guild.fetchOwner());

    // Creatung channel for logging.
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
    
    const BasicConfig_Data = {
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

    const ModuleConfig_Data = {
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

    const logData = {
        id:0,
        mod:user.id,
        action:'create',
        data:'Registration of Data in bot',
        reason:'Execution of command by the owner of the server.',
        time:toUnix(new Date().getTime()),
    };

    const logEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle(`ID -> 0 | Log Trigger: \`Auto Registeration\``)
        .setDescription(`Reason:\n\`Execution of command by the owner of the server.\``)
        .setFooter({text:user.user.username,iconURL:user.user.displayAvatarURL()})
        .setTimestamp()

    await webhook.send({embeds:[logEmbed]});
    await ModuleConfig.set(ModuleConfig_Data);
    await BasicConfig.set(BasicConfig_Data);
    await logCount.set({ID:1});
    await logArea.set(logData);

};

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 * @param {Role} whitelisted_role  
 */
const createSupportSystem = async(client, guild, whitelisted_role) => {
    
    const ModuleConfig = db.collection('serverCollection').doc(guild.id).collection('config').doc('config_basic');
    const SupportConfig = db.collection('serverCollection').doc(guild.id).collection('config').doc('config_support');
    const logConfig = db.collection('serverCollection').doc(guild.id).collection('log').doc('count');
    const user = await guild.fetchOwner();
    const logCount = (await logConfig.get()).data().ID;

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
        ],
        reason:'Setting the ModMail Plugin...'
    });

    const mail_logs = await guild.channels.create({
        type:ChannelType.GuildText,
        name:'logs',
        parent:parent.id,
    });

    mail_logs.lockPermissions();

    const DataToSet = {
        setup:true,
        parent_id:parent.id,
        log_id:mail_logs.id,
        allow_roles:[whitelisted_role.id],
        ticket_id:0,
        disabled:false,
        mention_role:[whitelisted_role.id],
    };

    const logEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle(`ID -> ${logCount} | Log Trigger: \`ModMail Registration\``)
        .setDescription(`Reason:\n\`Execution of the command by the owner of the server.\``)
        .setFooter({text:user.user.username,iconURL:user.user.displayAvatarURL()})
        .setTimestamp()

    
    await SupportConfig.set(DataToSet);
    await ModuleConfig.update({ support_enable:true });
    await logConfig.update({ID:logCount+1});

};

module.exports =  {registerFunction, createSupportSystem};