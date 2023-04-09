const {Events, Client} = require('discord.js');
const db = require('./dbConfiguration');
/**
 * 
 * @param {Client} client Discord Bot Client
 * @param {Events} events Events array imported from discord.js
 * @param {db} db Configured Firestore to access the database.
 */

module.exports = async (client, events, db) => {

    // Creating Interaction Event and responding every command used by the user
    client.on(events.InteractionCreate, async(interaction) => {
        
        if (!interaction.isChatInputCommand()) return;
        
        // Getting the command from client.commands collection
        const command = interaction.client.commands.get(interaction.commandName);

        // In case if command doesn't exist, we'll return in order to avoid errors
        if (!command) return;
        
        // Running Try/Catch to run the command and log errors if they occur
        try {
            command.run(client, interaction, db);
        } catch (err) {
            console.log(`Error caught while executing a command... \n${err}`);
        };
    });
};