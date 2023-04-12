// Importing all the required modules, classes and functions
const {ErrorEmbed} = require('./assets/premadeEmbeds.js');
const { Client, GatewayIntentBits, Events, REST} = require('discord.js');
const eventHandler = require('./scripts/eventHandler.js');
const commandHandler = require('./scripts/commandHandler.js');
const db = require('./scripts/dbConfiguration.js');
require('dotenv').config();

// Creating the bot client and setting all the required intents (basically every intent 🗿)
const client = new Client({
    intents:[
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks
    ],
    allowedMentions:'users',
});

// Logging into Discord API
client.login(process.env.TOKEN);
const rest = new REST({version:'10'}).setToken(process.env.TOKEN);

// When client is up, logging the event and executing all of my handlers
client.once(Events.ClientReady, (c) => {
    try {
        eventHandler(c, Events, db);
        commandHandler(c, rest);
    } catch (err) {
        c.channels.fetch(process.env.ERRID).then((channel) => {
            channel.send({
                embeds:[ErrorEmbed.setDescription(`${err}`)]
            });
        });
    };
});