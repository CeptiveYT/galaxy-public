const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const reddit = require("reddit-fetch");
const moment = require('moment');

module.exports = {
    name: "meme",
    description: "Will generate a meme from the r/memes subreddit.",
    cooldown: 15,
    aliases: ["memes", "m"],
    enabled: true,
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        let MyServer = await guildSchema.findOne({
            serverID: message.guild.id
        });

        if (MyServer) {

            reddit({
                subreddit: "dankmemes",
                sort: "top", 
                allowNSFW: false, 
                allowCrossPost: true, 
                allowModPost: true
            }).then((post) => {
                message.channel.send({
                    embeds: [new MessageEmbed({
                        author: {
                            name: `${post.author}`,
                        }, 
                        title: `${post.title}`, 
                        color: `#ff4500`, 
                        image: {
                            url: `${post.url}`
                        }, 
                        fields: [
                            {
                                name: "Up votes", 
                                value: `${post.ups}`, 
                                inline: true
                            },
                            {
                                name: "Date Posted", 
                                value: `${moment(post.created * 1000).format("MMMM Do YYYY")}`,
                                inline: true
                            }
                        ]
                    })]
                })
            })

        } else {
            return message.channel.send("Please set up Stream Bot first. `/setup`");
        }
    }
}