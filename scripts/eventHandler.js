const {Events, Client, ChannelType} = require('discord.js');
const db = require('./dbConfiguration.js');
const { ErrorEmbed } = require('../assets/premadeEmbeds.js');
const { checkGuild, checkMember } = require('./blackListFunction.js');
const ErrorNotif = require('./errScript.js');
/**
 * 
 * @param {Client} client Discord Bot Client
 * @param {Events} events Events array imported from discord.js
 * @param {db} db Configured Firestore to access the database.
 */

module.exports = async (client, events, db) => {

    // Creating Interaction Event and responding every command used by the user
    client.on(events.InteractionCreate, async(interaction) => {

        // Filtering the interaction event
        if (!interaction.isChatInputCommand()) return;
        if (interaction.channel.type === ChannelType.DM) return;
        if (checkGuild(client, interaction.guild, db)) return;
        if (checkMember(client, interaction.user, db)) return;

        // Getting the command from client.commands collection
        const command = interaction.client.commands.get(interaction.commandName);

        // In case if command doesn't exist, we'll return in order to avoid errors
        if (!command) return;
        
        // Running Try/Catch to run the command and log errors, and send message to the user regarding the error if they occur
        try {
            command.run(client, interaction, db);
        } catch (err) {
            console.log(`Error caught while executing a command... \n${err}`);
            ErrorNotif(client, err);
            interaction.reply({
                embeds:[
                    ErrorEmbed.setDescription(`Error occurred while executing the command`)
                ],
                ephemeral:true,
            });
        };
    });
};