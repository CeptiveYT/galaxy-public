const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageMentions } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const { invisible } = require("../../Storage/Colors/EmbedColors");
const { Error } = require('../../Storage/Schemas/BotErrorSchema');
const moment = require('moment');

module.exports = {
    name: "unban",
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
            try {

                const id = args[0];
                if (!id) return message.reply("You need to provide a user id for me to unban them.")
                if (isNaN(id)) return message.reply("You need to state a valid user id!");

                const bannedUsers = await message.guild.bans.fetch();
                const user = await bannedUsers.get(id);
                if (!user) return message.reply("I was unable to find that user, please try another user or id.");

                const reason = args.slice(1).join(" ") || "No reason given.";

                let member = user.user;

                await message.guild.members.unban(user.user, reason);
                const response = new MessageEmbed({
                    title: `${member.username} has been unbanned`,
                    description: `${member} has been unbanned by ${message.author}`,
                    color: "GREEN"
                });
                message.channel.send({ embeds: [response] })

                let Log = message.guild.channels.cache.get(MyServer.logchannelID);
                if (!Log) return;

                const logEmbed = new MessageEmbed({
                    title: "Mod Log | User Unbanned",
                    description: `${user.user} has been unbanned from the server.`,
                    color: `${invisible}`,
                    fields: [
                        {
                            name: "Username",
                            value: `\`\`\`${user.user.username}\`\`\``,
                            inline: true
                        },
                        {
                            name: "User ID",
                            value: `\`\`\`${user.user.id}\`\`\``,
                            inline: true
                        },
                        {
                            name: "Discriminator",
                            value: `\`\`\`#${user.user.discriminator}\`\`\``,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value: `\`\`\`${reason}\`\`\``,
                            inline: true
                        },
                    ],
                    thumbnail: {
                        url: `${user.user.displayAvatarURL({ dynamic: true })}`
                    }
                })

                await Log.send({embeds: [logEmbed]})

            } catch (err) {
                console.log(err);
                const embed = new MessageEmbed({
                    title: "An error has occured | Unban Command",
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
                        Command: "Unban (Prefix)",
                        Date: `${moment(Date.now()).format("Do MMMM YYYY")}`,
                        Embed: {
                            Color: "RED",
                            Title: "An error has occured | Unban Command",
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
