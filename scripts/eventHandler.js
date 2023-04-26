const { Events, Client, ChannelType} = require('discord.js');
const { ErrorEmbed } = require('../assets/premadeEmbeds.js');
const { checkGuild, checkMember } = require('./checkBlacklist.js');
const ErrorNotif = require('./errScript.js');
/**
 * 
 * @param {Client} client Discord Bot Client
 * @param {Events} events Events array imported from discord.js
 */

module.exports = async (client, events) => {

    // Creating Interaction Event and responding every command used by the user
    client.on(events.InteractionCreate, async(interaction) => {

        // Filtering the interaction event
        if (!interaction.isChatInputCommand()) return;
        if (interaction.channel.type === ChannelType.DM) return;
        if ((await checkGuild(client, interaction.guild))) return;
        if ((await checkMember(client, interaction.user))) return;
        console.log(await checkGuild(client, interaction.guild));
        console.log(await checkMember(client, interaction.user));

        // Getting the command from client.commands collection
        const command = interaction.client.commands.get(interaction.commandName);

        // In case if command doesn't exist, we'll return in order to avoid errors
        if (!command) return;
        
        // Running Try/Catch to run the command and log errors, and send message to the user regarding the error if they occur
        try {
            command.run(client, interaction);
        } catch (err) {
            console.log(`Error caught while executing a command... \n${err}`);
            ErrorNotif(client, err);
            interaction.reply({
                embeds:[
                    ErrorEmbed.setDescription(`\`Error occurred while executing the command...\``)
                ],
                ephemeral:true,
            });
        };
    });
};