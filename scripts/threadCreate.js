const { Client, User, Guild, EmbedBuilder } = require('discord.js');
const db = require('./dbConfiguration.js');
const {checkMember} = require('./blackListFunction.js');
const ErrNotif = require('./errScript.js');

/**
 * 
 * @param {Client} client Discord Client
 * @param {Guild} guild Guild for the ModMail
 * @param {User} user The user who's going to use the ModMail to contact the support team
 * @returns 0 => (success)
 * @returns 1 => (failed due to blacklist)
 * @returns 2 => (disabled)
 * @returns 3 => (ModMail is already in use with that user)
 * @returns 4 => (unexpected error).
 * @description This Script is made to run when the user is trying to contact the support team from the guild and taking it to the different path after the creation with verification of User (User's DM <--> Moderator's Channel).
 */

const modmailscript = async(client, guild ,user) => {

    try {

        // Checking for the Blacklist
        if (checkMember(client, user, db)) return 1;

        // Resolving Guild User and Getting the config and specific data
        const user_resolved = await guild.members.fetch(user.id);
        const guildData = await db.collection('serverCollection').doc(guild.id).collection('config').doc('config_basic').get();
        const supportData = await db.collection('serverCollection').doc(guild.id).collection('config').doc('config_support').get();
        
        // Checking for the ModMail Setup w/ User's config data
        if ((!guildData.exists || !supportData.exists) || (guildData.get().support_enable === false || supportData.get().disabled === false)) return 2;
        if ((await user_thread.get()).data().active === true) return 3;

        // Creating Channel and Fetching the last ID of the ticket to increment it. After that, Configuring Guild and Channel's data to make this thread work. 
        const ticket_id = Number(supportData.data().ticket_id) + 1;
        const ticketChannel = await guild.channels.create({
            name:`ticket => ${ticket_id}`,
            parent:supportData.data().parent_id,
            topic:`User ID => ${ticket_id}\nClose Command => d?close`
        });
        
        const guild_thread = db.collection('thread_system').doc('guild').collection(guild.id).doc(ticket_id);
        const channel_thread = db.collection('thread_system').doc('channel').collection(guild.id).doc(ticketChannel.id);
        const user_thread = db.collection('thread_system').doc('user').collection('thread_data').doc(user.id);


        // Synchronizing the Permissions of the channel with the thread data. Then Sending the Alert Embed to the support team

        ticketChannel.lockPermissions();

        let content = '';
        supportData.data().mention_role.forEach(role => {
            content+=`<@&${role}> `
        });

        await ticketChannel.send({
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


        // Creating Thread Data for Guild, Channel and User to fetch their respective data and ID easily
        
        const user_thread_data = {
            guild_id:guild.id,
            channel_id:ticketChannel.id,
            active:true,
        };

        const guild_thread_data = {
            ticket_id:ticket_id,
            user_id:user.id,
            channel_id:ticketChannel.id,
            messages:[],
            active:true,
            close_reason:'',
        };

        const channel_thread_data = {
            ticket_id:ticket_id,
            user_id:user.id,
            active:true,
        }

        // Configuration of Guild, Channel and, User Data and Updating the ID of the latest ticket

        await guild_thread.set(guild_thread_data);
        await user_thread.set(user_thread_data);
        await channel_thread.set(channel_thread_data);
        await db.collection('serverCollection').doc(guild.id).collection('config').doc('config_support').update({ticket_id:ticket_id});
        
        return 0;

    } catch (err) {
        ErrNotif(client, err);
        return 4;
    };
};

module.exports = modmailscript;