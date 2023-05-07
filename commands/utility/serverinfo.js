const {SlashCommandBuilder, EmbedBuilder, Interaction, Client }  = require('discord.js');
const emoji = require('../../assets/emoji.json');
const toUnix = require('../../scripts/unixTime');
/**
 * 
 * @param {Client} client Discord Client we're using
 * @param {Interaction} interaction Interaction to reply from discord
 */

const run = async (client, interaction) => {

    const embedToSend = new EmbedBuilder()
        .setColor('DarkBlue')
        .setTitle('Server Info')
        .setDescription(
        `Server Name: **${interaction.guild.name}**\n`+
        `Server ID: \`${interaction.guild.id}\`\n`+
        `Server Owner: ${await interaction.guild.fetchOwner()}\n`+
        `Server was created at: <t:${toUnix(interaction.guild.createdAt.getTime())}:D>\n`+
        `Member Count : **${interaction.guild.memberCount}**\n`+
        `Role Count: **${(await interaction.guild.roles.fetch()).size}**\n`+
        `Channel Count: **${(await interaction.guild.channels.fetch()).size}**\n`+
        `Verified ? : **${interaction.guild.verified ? 'Yes' :'No'}**\n`+
        `Partnered ? : **${interaction.guild.partnered ? 'Yes':'No'}**\n`
        )
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({text:client.user.username, iconURL:client.user.displayAvatarURL()})
        .setTimestamp()
        
    interaction.reply({
        embeds:[embedToSend],
        ephemeral:true
    });
}

module.exports = {
    name:'serverinfo',
    description:'Shows the info about the server.',
    cooldown:3,
    data: new SlashCommandBuilder()
        .setName(`serverinfo`)
        .setDescription(`Shows the info about the server`)
        .setDMPermission(false),
    run
}