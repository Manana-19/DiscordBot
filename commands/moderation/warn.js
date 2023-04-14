const {SlashCommandBuilder, EmbedBuilder, Interaction, Client, PermissionFlagsBits } = require('discord.js');
const db = require(`../../scripts/dbConfiguration.js`);
const emoji = require('../../assets/emoji.json');
const { ErrorEmbed, successEmbed } = require('../../assets/premadeEmbeds.js');

/**
 * 
 * @param {Client} client Discord Client we're using
 * @param {Interaction} interaction Interaction to reply from discord
 * @param {db} db Configured Firestore Database
 */

const run = async(client, interaction, db) => {
    // Getting all the required options from the interaction command
    const target = await interaction.guild.members.fetch(interaction.options.getUser('target').id);
    const reason = interaction.options.getString('reason');

    // Conditioning/Filtering the invalid options
    if (target === interaction.user) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`You can't mute yourself\``)], ephemeral:true});
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`The Client doesn't have permission to Moderate Members.\``)], ephemeral:true});
    if (target.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`The Member has permission to Moderate Members.\``)], ephemeral:true});
    if (target.roles.highest > interaction.guild.members.me.roles.highest) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`The Client role's position is lower than the target's\``)], ephemeral:true});

    

};

module.exports = {
    name:'mute',
    description:'timeout/mute command to mute a user',
    cooldown:5,
    run,
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('warn a user')
        .addUserOption((option) => option.setName('target').setDescription('Select the user to warn').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('Add a reason').setMaxLength(2000).setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
};