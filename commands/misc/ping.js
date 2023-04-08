const {SlashCommandBuilder, EmbedBuilder, Interaction, Client }  = require('discord.js');

module.exports = {
    name:'ping',
    description:'Shows the Latency of discord client',
    cooldown:2,
    alias:['p'],
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the latency of discord client')
        .setDMPermission(false),
}

/**
 * @param {Interaction} interact Interaction to reply from discord
 * @param {Client} client Discord Client we're using
 */

module.exports.run = async (client, interact) => {
    
    await interact.reply({
        embeds:[
            new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('Pinging...........')
        ]
    });
    interact.editReply({
        embeds:[
            new EmbedBuilder()
                .setColor('Green')
                .setTitle('Pong!')
                .setDescription(`Client Web Socket Latency => \`${client.ws.ping}\``)
                .setTimestamp()
        ]
    });

}