const { Client, EmbedBuilder } = require("discord.js");
const { config } = require("dotenv");
config();
/**
 * 
 * @param {Client} client 
 * @param {String} err 
 */

function ErrorNotif(client, err) {
    const errorEmbed = new EmbedBuilder()
        .setColor('RED')
        .setTitle('An Error Occurred')
        .setDescription(`\`\`\`js\n${err}\`\`\``)
        .setTimestamp()
        .setFooter({iconURL:client.user.displayAvatarURL(),text:client.user.username})
    client.channels.fetch(process.env.ERRID).then((channel) => {
        channel.send({embeds:[errorEmbed]})
    });
    console.error(err);
};

module.exports = ErrorNotif;