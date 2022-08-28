const { Client, Message, MessageEmbed } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const { invisible } = require("../../Storage/Colors/EmbedColors");

module.exports = {
    name: "kick",
    cooldown: 0,
    permissions: "KICK_MEMBERS",
    enabled: true,
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        let MyServer = await guildSchema.findOne({ serverID: message.guild.id });

        if (MyServer) {

            let user = message.mentions.members.first();
            if (!args[0]) return message.reply("Please mention a user to kick.");
            if (!user) return message.reply("I was unable to find the member you were looking for.");
            if (!user.kickable) return message.reply("I am unable to kick that member.");

            let reason = args.slice(1).join(" ");

            let Log = message.guild.channels.cache.get(MyServer.logchannelID);
            if (!MyServer.logchannelID) return;

            const logEmbed = new MessageEmbed({
                title: "Mod Log | User Kicked",
                description: `${user} has been kicked from the server.`,
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
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: `\`\`\`${reason}\`\`\``,
                        inline: false
                    }
                ]
            });

            const response = new MessageEmbed({
                description: `${user} has been kicked from the server.`,
                color: "GREEN"
            });

            try {
                user.kick({
                    reason: reason
                });

                message.channel.send({ embeds: [response] });
                Log.send({ embeds: [logEmbed] });
            } catch (err) {
                console.log(err);
            }

        } else {
            return message.channel.send("Please set up Galaxy Bot first. `/setup`");
        }
    }
}
