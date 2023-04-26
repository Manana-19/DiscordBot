const {SlashCommandBuilder, EmbedBuilder, Interaction, Client }  = require('discord.js');
const emoji = require('../../assets/emoji.json');
/**
 * 
 * @param {Client} client Discord Client we're using
 * @param {Interaction} interaction Interaction to reply from discord
 */

const run = async (client, interaction) => {

    let user = interaction.options.getUser('userinfo') ?? interaction.user;
    interaction.reply({
        embeds:[
            new EmbedBuilder()
                .setColor('DarkBlue')
                .setThumbnail(user.avatarURL())
                .setTitle(`User Info`)
                .setDescription(`Username: \`${user.username}\`\nDiscriminator: \`${user.discriminator}\`\nJoined Discord: \`${user.createdAt}\`\nID: \`${user.id}\``)
        ],
        ephemeral:true
    });
};


module.exports = {
    name:'userinfo',
    description:`Shows The User's Info`,
    cooldown:3,
    run,
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription(`Show's the info about the user`)
        .setDMPermission(false)
        .addUserOption((option) => option.setName('userinfo').setDescription('Enter the user')),
};