const {SlashCommandBuilder, EmbedBuilder, Interaction, Client }  = require('discord.js');
const emoji = require('../../assets/emoji.json');
/**
 * 
 * @param {Client} client Discord Client we're using
 * @param {Interaction} interaction Interaction to reply from discord
 */

const run = async (client, interaction) => {
    
    await interaction.reply({
        embeds:[
            new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('Pinging...........')
        ]
    });
    interaction.editReply({
        embeds:[
            new EmbedBuilder()
                .setColor('Green')
                .setTitle('Pong!')
                .setDescription(`Client Web Socket Latency => \`${client.ws.ping}\``)
                .setTimestamp()
        ]
    });
};

module.exports = {
    name:'ping',
    description:'Shows the Latency of discord client',
    cooldown:2,
    req_perms:'None',
    run,
    alias:['p'],
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the latency of discord client')
        .setDMPermission(false)
        ,
};
