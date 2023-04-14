const {SlashCommandBuilder, EmbedBuilder, Interaction, Client } = require('discord.js');
const db = require(`../../scripts/dbConfiguration.js`);
const emoji = require('../../assets/emoji.json');
const { ErrorEmbed, successEmbed } = require('../../assets/premadeEmbeds.js');

/**
 * @param {Client} client Discord Client we're using
 * @param {Interaction} interaction Interaction to reply from discord
 * @param {db} db Configured Firestore Database
 */

const run = async (client, interaction, db) => {
    
};
// Read All command files and then showing their name and description in option and in embed's option.

const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription("Helping the user to know about this bot's commands in order to use it.")
    .setDMPermission(false)

module.exports = {
    name:'help',
    description:'Sends the user a help menu',
    cooldown:5,
    data
};