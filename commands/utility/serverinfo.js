const {SlashCommandBuilder, EmbedBuilder, Interaction, Client }  = require('discord.js');
const db = require(`../../scripts/dbConfiguration`);
const emoji = require('../../assets/emoji.json');
/**
 * 
 * @param {Client} client Discord Client we're using
 * @param {Interaction} interaction Interaction to reply from discord
 * @param {db} db Configured Firestore Database
 */

const run = async (client, interaction ,db) => {

    const embedToSend = new EmbedBuilder()
        .setColor('DarkBlue')
        .setTitle('Server Info')
        .setDescription(`
        Server Name: \`${interaction.guild.name}\`\n
        Server ID: \`${interaction.guild.id}\`\n
        Server Owner: ${await interaction.guild.fetchOwner()}\n
        Server was created at: \`${interaction.guild.createdAt}\`\n
        Member Count : \`${interaction.guild.memberCount}\`\n
        Verified ? :\`${interaction.guild.verified ? 'Yes' : 'No'}\`\n
        Partnered ? :\`${interaction.guild.partnered ? 'Yes':'No'}\`\n
        `)
        .setThumbnail(interaction.guild.iconURL())
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