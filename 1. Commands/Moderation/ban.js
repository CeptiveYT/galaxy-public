const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const { invisible } = require("../../Storage/Colors/EmbedColors");
const { Error } = require('../../Storage/Schemas/BotErrorSchema');
const moment = require('moment');

module.exports = {
    name: "ban",
    cooldown: 0,
    permissions: "BAN_MEMBERS",
    enabled: true,
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        let MyServer = await guildSchema.findOne({ serverID: message.guild.id });

        const row = new MessageActionRow();
        row.addComponents(
            new MessageButton({
                customId: "bug-report",
                label: "Report Error",
                disabled: false,
                emoji: "<:aaaa_user_report:1011718989086462052>",
                style: "DANGER"
            })
        )

        if (MyServer) {

            const user = message.mentions.members.first();
            if (!args[0]) return message.reply("Please mention a user to ban!");
            if (!user) return message.reply("I am unable to find that user.");

            let member = message.guild.members.cache.get(user.user.id);
            if (!member.bannable) return message.channel.send("I am unable to ban that member!"); 
            let reason = args.slice(0).join(" ") || "No reason given."

            try {
                member.ban({
                    reason: reason, 
                    days: 7
                }); 
                message.channel.send({
                    embeds: [
                        new MessageEmbed({
                            description: `${member.user} was banned by ${message.author}`, 
                            color: "GREEN"
                        })
                    ]
                });
                
                const Log = message.guild.channels.cache.get(MyServer.logchannelID); 
                if (!Log) return; 
                await Log.send({
                    embeds: [new MessageEmbed({
                        title: "Mod Log | User Banned", 
                        description: `${user.user} has been banned from the server by ${message.author}`, 
                        timestamp: new Date(), 
                        color: `${invisible}`, 
                        fields: [
                            {
                                name: "User Tag", 
                                value: `\`\`\`${user.user.tag}\`\`\``, 
                                inline: true
                            }, 
                            {
                                name: "User ID", 
                                value: `\`\`\`${user.user.id}\`\`\``, 
                                inline: true,
                            }, 
                            {
                                name: "Date", 
                                value: `\`\`\`fix\n${moment(Date.now()).format("Do MMMM YYYY")}\`\`\``, 
                                inline: true
                            }, 
                            {
                                name: "Reason", 
                                value: `\`\`\`${reason}\`\`\``
                            }
                        ]
                    })]
                })
            } catch (err) {
                console.log(err);
                const embed = new MessageEmbed({
                    title: "An error has occured | Ban Command",
                    description: `\`\`\`${err}\`\`\``,
                    color: "RED"
                })
                let error = await message.channel.send({
                    embeds: [
                        embed
                    ], 
                    components: [
                        row
                    ]
                }).then(async (sent) => {
                    await Error.create({
                        ErrorID: `${sent.id}`,
                        Command: "Ban (Prefix)",
                        Date: `${moment(Date.now()).format("Do MMMM YYYY")}`,
                        Embed: {
                            Color: "RED", 
                            Title: "An error has occured | Ban Command",
                            Description: `\`\`\`${err}\`\`\``
                        }
                    })
                })
            }

        } else {
            return message.channel.send("Please set up Galaxy Bot first. `/setup`");
        }
    }
}
