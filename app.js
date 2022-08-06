//import discord.js
const { Client, ActivityType, EmbedBuilder, Permissions, InteractionType, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

//config
const config = require('./config.json');
require('dotenv').config();

//import express
const http = require("http");
const express = require('express');
const app = express();
var server = http.createServer(app);
const port = process.env.PORT || 3000;

//import youtube notification
const notifier = require("yt-notifs");

client.on("ready", () => {
    console.log("Watching " + config.CHANNEL_ID.length  + " Channels")
    config.CHANNEL_ID.forEach(channel => {
        console.log("Name of channel: " + notifier.getChannelName(channel));
    });
    client.user.setPresence({ activities: [{ name: "YouTube", type: ActivityType.Watching }], status: 'online'});
});

notifier.start(60);

notifier.events.on("newVid", (obj) => {
    console.log('New Video');
    // console.log(obj);
    // send embed when video gets posted
    let disc = obj.vid.description;
    if(disc && disc.length > 100){
        disc = disc.slice(0, 100) + "...";
    }else{
        disc = disc;
    }
    const embed = new EmbedBuilder()
        .setTitle(obj.vid.name || "Could not find a title")
        // .setDescription(obj.vid.description || "Could not find a description")
        .addFields({
            name: "Video Description",
            value: disc || "Could not find a description"
        })
        .setColor("#c4302b")
        .setThumbnail(obj.vid.thumbnail.url || null)
        .setURL(obj.vid.url || null)
        .setAuthor({ name: obj.channel.name || "Could not find a username", url: obj.channel.url || null })
        .setTimestamp()
    client.channels.cache.get(config.SERVER_CHANNEL_ID).send({embeds: [embed]});
    // client.channels.cache.get(config.SERVER_CHANNEL_ID).send(`**${data.channel.name}** just uploaded a new video - **${data.video.link}**`);
});

notifier.subscribe(config.CHANNEL_ID);
  
  
client.login(process.env.TOKEN);