const { EmbedBuilder } = require('discord.js');
const emoji = require('./emoji.json');
// Pre-Making all the "repeatable" Embeds which are annoying in future...
const footerText = 'Utility Bot'
const ErrorEmbed = new EmbedBuilder()
    .setColor('Red')
    .setTitle(`${emoji.warn} Error!`)
    .setTimestamp()
    .setFooter({text:footerText})
const successEmbed = new EmbedBuilder()
    .setColor('Green')
    .setTitle(`${emoji.success} Success!`)
    .setTimestamp()
    .setFooter({text:footerText})
const blackListEmbed = new EmbedBuilder()
    .setColor('Red')
    .setTitle(`${emoji.failed} Error: Restriction`)
    .setTimestamp()
    .setFooter({text:footerText})
const warningEmbed = new EmbedBuilder()
    .setColor('Yellow')
    .setTitle(`${emoji.warn} Warning!!!`)
    .setTimestamp()
    .setFooter({text:footerText})
module.exports = {ErrorEmbed, successEmbed, blackListEmbed, warningEmbed};