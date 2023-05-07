const db = require('./dbConfiguration.js');
const emoji = require('../assets/emoji.json');
const {Client, Guild, GuildMember, ChannelType, EmbedBuilder, WebhookClient} = require('discord.js');
/**
 * 
 * @param {Client} client Discord Client
 * @param {GuildMember} target 
 * @param {Guild} guild 
 * @param {GuildMember} user The moderator
 * @param {string} action
 * @param {Number} duration if Mentioned
 * @param {string} reason
 */

const ModerationLog = async (client, target, guild, user, action, duration, reason) => {


    const confirm = (await db.collection('serverCollection').doc(guild.id).collection('config').doc('config_basic').get()).data()
    if (confirm.logging !== true) return; 


    const ModuleConfig = db.collection('serverCollection').doc(guild.id).collection('config').doc(`config_moderation`);
    const mod_data = await ModuleConfig.get();
    const userCollection = db.collection('serverCollection').doc(guild.id).collection('user').doc(target.id);
    const userData = await userCollection.get();
    const logChannelID = mod_data.data().log_channel;
    const logChannel = await guild.channels.fetch(logChannelID);
    const logID = (await db.collection('serverCollection').doc(guild.id).collection('log').doc('logCount').get()).data();

    if (logChannel) {

        const logEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle(`ID -> ${logID.ID} | Log Trigger: \`Moderation\` => \`${action}\``)
        .setDescription(`Reason:-\n**${reason}**`)
        .addFields([{
                name:'Moderator',
                value:user.user.username,
            },])
        .setAuthor({name:target.user.username,iconURL:target.avatarURL()})
        .setFooter({text:user.user.username,iconURL:user.displayAvatarURL()})
        .setTimestamp()
    
        if (duration !== NaN) logEmbed.addFields([{name:'Duration', value:`${duration/60000} Minutes`}])
        
        const webhookClient = new WebhookClient({url:mod_data.get().log_webhook});
        
        if (webhookClient) {
            webhookClient.send({embeds:[logEmbed]});
        } else {
            logChannel.send({embeds:[logEmbed]});
        };
        
    };
    
    if (mod_data.data().infractionlimit_usage === true) {
        // Infraction System Which is going to be build
    }
    
};
/**
 * 
 * @param {Client} client
 * @param {Guild} guild 
 * @param {GuildMember} user 
 * @param {string} action 
 * @param {string} reason 
 */
const updateLog = async(client, user, guild, action, reason) => {

    const confirm = (await db.collection('serverCollection').doc(guild.id).collection('config').doc('config_basic').get()).data()
    if (confirm.logging !== true) return;

    const logModule = db.collection('serverCollection').doc(guild.id).collection('log');
    const ID = (await logModule.doc('logCount').get()).data().ID;
    
    const ModuleConfig = db.collection('serverCollection').doc(guild.id).collection('config').doc(`config_moderation`);
    const mod_data = await ModuleConfig.get();

    const logChannelID = mod_data.data().log_channel;
    const logChannel = await guild.channels.fetch(logChannelID);

    if (logChannel) {
        const webhook = new WebhookClient({url:mod_data.data().log_webhook});
        if (webhook) {
            webhook.send()
        }
    };

};