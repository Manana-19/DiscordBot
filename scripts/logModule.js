const db = require('./dbConfiguration.js');
const emoji = require('../assets/emoji.json');
const {} = require('../assets/premadeEmbeds.js');
const {Client, Guild, GuildMember, ChannelType, EmbedBuilder, WebhookClient} = require('discord.js');
/**
 * 
 * @param {Client} client Discord Client
 * @param {GuildMember} target 
 * @param {Guild} guild 
 * @param {GuildMember} user The moderator
 * @param {String} action
 * @param {Number} duration if Mentioned
 * @param {String} reason
 */

const ModerationLog = async (client, target, guild, user, action, duration, reason) => {

    const ModuleConfig = db.collection('serverCollection').doc(guild.id).collection('config').doc(`config_moderation`);
    const mod_data = await ModuleConfig.get();
    const userCollection = db.collection('serverCollection').doc(guild.id).collection('user').doc(target.id);
    const userData = await userCollection.get();
    const logChannelID = mod_data.data().log_channel;
    const logChannel = await guild.channels.fetch(logChannelID);

    if (logChannel) {

        const logEmbed = new EmbedBuilder()
        .setColor('DarkBlue')
        .setTitle(`Log Trigger: \`Moderation\` => \`${action}\``)
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