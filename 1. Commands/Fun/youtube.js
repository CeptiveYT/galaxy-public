const { Client, Message, MessageEmbed } = require("discord.js");
const guildSchema = require("@schemas/guildSchema");
const sr = require("yt-search");

module.exports = {
    name: "youtube",
    description: "Search for a youtube tutorial",
    aliases: ["yts", "yt-search"],
    cooldown: 30,
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

            const search = async (Argument) => {
                const Result = await sr(Argument);
                return (Result.videos.length > 1) ? Result.videos[0] : null;
            };

            const vid = await search(args.slice(0).join(" "));
            if (vid) {
                const embed = new MessageEmbed({
                    author: {
                        name: `${vid.author.name}`,
                        iconURL: `https://cdn.discordapp.com/attachments/868172328998146195/892831378515845130/1280px-YouTube_full-color_icon_2017.svg.png`, 
                        url: `${vid.author.url}`
                    }, 
                    title: `${vid.title}`, 
                    url: `${vid.url}`, 
                    color: "RED", 
                    timestamp: new Date(),
                    image: {
                        url: `${vid.thumbnail}`, 
                    },
                    fields: [
                        {
                            name: "Duration", 
                            value: `${vid.duration.timestamp} Minutes`,
                            inline: true
                        },
                        {
                            name: "Created",
                            value: `${vid.ago}`, 
                            inline: true
                        }, 
                        {
                            name: "Views", 
                            value: `${vid.views} views`, 
                            inline: true
                        }
                    ]
                })

                message.channel.send({ embeds: [embed] })
            }

        } else {
            return message.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
