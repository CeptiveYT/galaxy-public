const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    warn
} = require("../../Storage/Schemas/warnSchema");
const moment = require("moment"); 

module.exports = {
    name: "warnings",
    permissions: "MANAGE_MESSAGES",
    aliases: ["list-warns", "warns"],
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

            const user = message.mentions.members.first();
            if (!args[0]) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed({
                            color: "RED",
                            description: `❌ You need to mention a user to get their warns.`
                        })
                    ]
                })
            }
            if (!user) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed({
                            color: "RED",
                            description: `❌ I cannot find the member you are looking for!`
                        })
                    ]
                })
            }

            let userWarns = await warn.find({
                userID: user.user.id,
                serverID: message.guild.id
            });

            const embedDescription = userWarns.map((warn) => {
                const Moderator = message.guild.members.cache.get(warn.moderatorID) || "Moderator has left the server.";

                return [
                    `**Warn ID:** \`${warn.warnID}\`\n**Moderator:** ${Moderator}\n**Reason:** \`${warn.reason}\`\n**Date Warned:** ${moment(warn.timestamp).format("Do MMMM YYYY")}`,
                ]
            })

            if (!userWarns?.length) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed({
                            color: "GREEN",
                            title: `${user.user.username}'s warnings.`,
                            description: "**This user has no warnings on record.**"
                        })
                    ]
                })
            }

            const embed = new MessageEmbed({
                title: `${user.user.username}'s Warning's`,
                description: `**Total Warns:** **${userWarns.length}**\n\n${embedDescription.join("\n\n")}`,
                color: "ORANGE",
                thumbnail: {
                    url: `${user.user.displayAvatarURL({ dynamic: true })}`
                }
            })

            message.channel.send({
                embeds: [embed]
            })

        } else {
            return message.channel.send("Please set up Galaxy bot first. `!setup`");
        }
    }
}