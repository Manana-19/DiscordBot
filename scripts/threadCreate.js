const { Client, User, Guild, EmbedBuilder } = require('discord.js');
const db = require('./dbConfiguration.js');
const {checkMember} = require('./blackListFunction.js');

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild
 * @param {User} user 
 * @param {db} db
 * @returns 0 => (success)
 * @returns 1 => (failed due to blacklist)
 * @returns 2 => (disabled)
 * @returns 3 => (unexpected error).
 */

const modmailscript = async(client, guild ,user, db) => {

    try {

        if (checkMember(client, user, db)) return 1;

        const user_resolved = await guild.members.fetch(user.id);
        const guildData = await db.collection('serverCollection').doc(guild.id).collection('config').doc('config_basic').get();
        const supportData = await db.collection('serverCollection').doc(guild.id).collection('config').doc('config_support').get();
        const user_thread = db.collection('thread_system').doc('user').collection(user.id).doc('thread_data');
        const guild_thread = db.collection('thread_system').doc('guild').collection(guild.id).doc('thread_data');
        
        if ((!guildData.exists || !supportData.exists) || (guildData.get().support_enable === false || supportData.get().disabled === false)) return 2;

        const ticket_id = supportData.data().ticket_id

        const ticketChannel = await guild.channels.create({
            name:`ticket_id => ${ticket_id}`,
            parent:supportData.data().parent_id
        });

        const user_thread_data = {
            guild_id:guild.id,
            channel_id:ticketChannel.id,
            active:true,
        }

        await user_thread.set(user_thread_data)
        
        ticketChannel.lockPermissions();
        let content = ''
        supportData.data().mention_role.forEach(role => {
            content+=`<@&${role}> `
        });
        ticketChannel.send({
            content:content,
            embeds:[
            new EmbedBuilder()
                .setColor('Green')
                .setTitle(`New Ticket Created!`)
                .setDescription(`User => ${user_resolved}`)
                .setAuthor({
                    name:user_resolved.displayName,
                    iconURL:user_resolved.displayAvatarURL()
                })
                .setFooter({
                    text:guild.name,
                    iconURL:guild.iconURL(),
                })
                .setTimestamp()
        ]});

        const toSubmit = {
            ticket_id:ticket_id,
            user_id:user.id,
            channel_id:ticketChannel.id,
            messages:[],
            active:true,
            close_reason:'',
        };

        await guild_thread.set(toSubmit);
        
    } catch (err) {

    }
};