const {Events, Client} = require('discord.js');

/**
 * 
 * @param {Client} client Discord Bot Client
 * @param {Events} events Events array imported from discord.js
 */


module.exports = async (client, events) => {

    client.on(Events.InteractionCreate, async(interaction) => {
        
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return

        try {
            command.run(client, interaction);
        } catch (err) {
            console.log(`Error caught while executing a command... \n${err}`)
        }

    });

};