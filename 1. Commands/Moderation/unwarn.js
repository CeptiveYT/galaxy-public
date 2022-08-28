const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    invisible
} = require('../../Storage/Colors/EmbedColors');
const {
    warn
} = require("../../Storage/Schemas/warnSchema");
const moment = require("moment");

module.exports = {
    name: "unwarn",
    cooldown: 0,
    permissions: "MANAGE_MESSAGES",
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

            const id = args[0];
            if (!id) return message.reply("Please provide a warn id.");

            if (id.length !== 30) {
                return message.reply("Please enter a Warn ID that is 30 charcters long.")
            }

            let data = await warn.findOne({
                warnID: id
            });

            await data.deleteOne().then(() => {
                let user = message.guild.members.cache.get(data.userID);
                if (!user) return;

                message.channel.send({
                    embeds: [
                        new MessageEmbed({
                            color: "GREEN",
                            description: `✅ Unwarned ${user.user}`,
                        })
                    ]
                })

                let log = message.guild.channels.cache.get(MyServer.logchannelID);
                if (!log) return;

                log.send({
                    embeds: [
                        new MessageEmbed({
                            title: `Mod Log | User Warning Removed`,
                            color: `${invisible}`,
                            description: `${user.user} has been unwarned.`,
                            fields: [{
                                    name: "Removed Warning",
                                    value: `\`\`\`${data.reason}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Date Removed",
                                    value: `\`\`\`fix\n${moment(Date.now()).format("Do MMMM YYYY")}\`\`\``,
                                    inline: true
                                }
                            ]
                        })
                    ]
                });

                user.user.send({
                    embeds: [
                        new MessageEmbed({
                            title: `User Warning Removed from ${message.guild.name}`,
                            color: "GREEN",
                            description: "You have been unwarned in the server.",
                            fields: [{
                                    name: "Removed Warning",
                                    value: `\`\`\`${data.reason}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Date Removed",
                                    value: `\`\`\`fix\n${moment(Date.now()).format("Do MMMM YYYY")}\`\`\``,
                                    inline: true
                                }
                            ]
                        })
                    ]
                })
            })

        } else {
            return message.channel.send("Please set up Galaxy bot first. `!setup`");
        }
    }
}