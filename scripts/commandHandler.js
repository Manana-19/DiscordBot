const {Client, REST, Collection ,Routes} = require('discord.js');
const { readdirSync } = require('node:fs');
const path = require('path');
/**
 * 
 * @param {Client} client Discord Client
 * @param {REST} rest REST API for Registering slash commands
 */

module.exports = async (client, rest) => {
    
    client.commands = new Collection();
    const SlashArray = [];
    const commandDirPath = path.join(__dirname, `../commands`);
    readdirSync(`${commandDirPath}`).forEach((commandType) => {
        const commandFilePath = path.join(__dirname, `../commands/${commandType}`);
        readdirSync(commandFilePath).filter((file) => file.endsWith('.js')).forEach((fileName) => {
            const commandPath = path.join(__dirname, `../commands/${commandType}/${fileName}`);
            const command = require(commandPath);
            client.commands.set(command.name, command);
            SlashArray.push(command.data)
        })
    });

    console.log(`Beginning registering of ${SlashArray.length} Application (/) commands`);

    try {
        const data = await rest.put(Routes.applicationCommands(client.user.id), {body:SlashArray})
        console.log(`Successfully registered ${data.length} Application (/) commands`)
    } catch (err) {
        console.log(`Error caught while registering commands\n${err}`)
    }

};