const {Client, REST, Collection ,Routes} = require('discord.js');
const { readdirSync } = require('node:fs');
const path = require('node:path');
/**
 * 
 * @param {Client} client Discord Client
 * @param {REST} rest REST API for Registering slash commands
 */

module.exports = async (client, rest) => {

    // Creating commands collection in client
    client.commands = new Collection();
    
    // Slash Array for pushing all the SlashCommandBuilder data from command files
    const SlashArray = [];
    
    // Getting command's directory path
    const commandDirPath = path.join(__dirname, `../commands`);
    
    // Reading the Directory
    readdirSync(`${commandDirPath}`).forEach((commandType) => {
        const commandFilePath = path.join(__dirname, `../commands/${commandType}`);
    
        // Repeating same thing to get command files from sub directories
        readdirSync(commandFilePath).filter((file) => file.endsWith('.js')).forEach((fileName) => {
            
            // Getting command's file path then importing them...
            const commandPath = path.join(__dirname, `../commands/${commandType}/${fileName}`);
            const command = require(commandPath);

            // Confirming that they have SlashCommand Builder and response for the Application's command then pushing it to the SlashArray and Inserting it into the client.commands collection.
            if (command.data && command.run) {
                client.commands.set(command.name, command);
                SlashArray.push(command.data);
                console.log(command);
            };
        });
    });

    // Beginning the process of registering Slash Commands
    console.log(`Beginning registering of ${SlashArray.length} Application (/) commands`);

    // Using Try/Catch chain in case we face any errors and log it
    try {
    
        // Registering Slash Commands and then getting the data of how many of our Slash Command(s) have been registered
        const data = await rest.put(Routes.applicationCommands(client.user.id), {body:SlashArray});
        console.log(`Successfully registered ${data.length} Application (/) commands`);
    
    } catch (err) {
        console.log(`Error caught while registering commands\n${err}`);
    };
};