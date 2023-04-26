// const {SlashCommandBuilder, EmbedBuilder, Interaction, Client } = require('discord.js');

// const emoji = require('../../assets/emoji.json');
// const path = require('node:path');
// const { ErrorEmbed, successEmbed } = require('../../assets/premadeEmbeds.js');
// const { readdirSync } = require('node:fs');

// const dirData = [];
// const misc_data = [];
// const config_data = [];
// const mod_data = [];
// const util_data = [];
// const directories = path.join(__dirname, '../');
// readdirSync(directories).forEach((dir) => {
//     dirData.push(dir);
//     const newPath = path.join(__dirname, `../${dir}`);
//     readdirSync(newPath).forEach((fileName) => {
//         const commands = require(`../${dir}/${fileName}`);
//         const Data = {name:commands.name,description:commands.description};
//         if (dir == 'moderation') mod_data.push(Data)
//         else if (dir == 'configuration') config_data.push(Data)
//         else if (dir == 'misc') misc_data.push(Data);
//         else if (dir == 'utility') util_data.push(Data);
//     });
// });

// /**
//  * @param {Client} client Discord Client we're using
//  * @param {Interaction} interaction Interaction to reply from discord
//  */

// const run = async (client, interaction) => {

// };
// // Read All command files and then showing their name and description in option and in embed's option.

// const data = new SlashCommandBuilder()
//     .setName('help')
//     .setDescription("Helping the user to know about this bot's commands in order to use it.")
//     .setDMPermission(false)

// module.exports = {
//     name:'help',
//     description:'Sends the user a help menu',
//     cooldown:5,
//     data
// };