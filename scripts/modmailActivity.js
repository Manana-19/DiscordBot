const { Client, Message, Events, ChannelType } = require('discord.js');
const db = require('./dbConfiguration.js');
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {db} db 
 */
const modmailActivity = async(client, db) => {
    client.on(Events.MessageCreate, async (msg) => {
        if (msg.channel.type === ChannelType.DM) {
            return;
        } else if (msg.channel.type === ChannelType.GuildText) {

        }
    });
};