const { EmbedBuilder } = require('discord.js');
const emoji = require('./emoji.json');
// Pre-Making all the "repeatable" Embeds which are annoying in future...

const ErrorEmbed = new EmbedBuilder()
    .setColor('RED')
    .setTitle(`${emoji.warn} Error!`)
    .setTimestamp()
const successEmbed = new EmbedBuilder()
    .setColor('Green')
    .setTitle(`${emoji.success} Success!`)
    .setTimestamp()
const blackListEmbed = new EmbedBuilder()
    .setColor('RED')
    .setTitle(`${emoji.failed} Error: Restriction`)
    .setTimestamp()
const warningEmbed = new EmbedBuilder()
    .setColor('Yellow')
    .setTitle(`${emoji.warn} Warning!!!`)
    .setTimestamp()
module.exports = {ErrorEmbed, successEmbed, blackListEmbed, warningEmbed};