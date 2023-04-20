const {SlashCommandBuilder, EmbedBuilder, Interaction, Client, PermissionFlagsBits } = require('discord.js');
const db = require(`../../scripts/dbConfiguration.js`);
const emoji = require('../../assets/emoji.json');
const { ErrorEmbed, successEmbed, actionDMEmbed } = require('../../assets/premadeEmbeds.js');
const ms = require('../../scripts/ms.js');
/**
 * 
 * @param {Client} client Discord Client we're using
 * @param {Interaction} interaction Interaction to reply from discord
 * @param {db} db Configured Firestore Database
 */

const run = async(client, interaction, db) => {
    
    // Getting all the required options from the interaction command
    const target = await interaction.guild.members.fetch(interaction.options.getUser('target').id);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const duration = ms(interaction.options.getString('duration'));
    
    // Conditioning/Filtering the invalid options
    if (target === interaction.user) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`You can't mute yourself\``)], ephemeral:true});
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`The Client doesn't have permission to Moderate Members.\``)], ephemeral:true});
    if (target.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`The Member has permission to Moderate Members.\``)], ephemeral:true});
    if (target.roles.highest > interaction.guild.members.me.roles.highest) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`The Client role's position is lower than the target's\``)], ephemeral:true});
    if (duration === NaN) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`The duration input was invalid, please try again!\``)], ephemeral:true});
    if (duration > 86400000*28 || duration < 60000) return interaction.reply({ embeds: [ErrorEmbed.setDescription(`\`The duration input was out of range, please enter the value between 1 minute to 28 days, and try again!\``)], ephemeral:true});

    // Muting the member, DM'ing them and logging things
    interaction.reply({
        embeds:[
            successEmbed.setDescription(`${target} has been muted\nReason: ${reason}`)
        ],
        ephemeral:true
    });
    
    try {
        target.createDM().then((channel)  => {
            channel.send({embeds:[actionDMEmbed.setTitle(`You're muted from guild \`${interaction.guild.name}\``).setDescription(`${reason}`).setAuthor({name:interaction.guild.name, iconURL:interaction.guild.iconURL()})]});
        });
    } catch (err) {
        console.log(err)
    };
    
    target.timeout(duration, reason);
    // Few things are still in WIP....
};

module.exports = {
    name:'mute',
    description:'timeout/mute command to mute a user',
    cooldown:5,
    run,
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user')
        .addUserOption((option) => option.setName('target').setDescription('Select the user to mute').setRequired(true))
        .addStringOption((option) => option.setName('duration').setDescription('Enter the duration between 1 min and 28 days (Eg: 2m, 48h)').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('Add a reason').setMaxLength(2000))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
};