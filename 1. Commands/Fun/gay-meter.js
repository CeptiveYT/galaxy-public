const { generate } = require('better-output');
const { Client, Message, MessageEmbed } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "how-gay",
    cooldown: 15,
    aliases: ["gay"],
    enabled: true,
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        let MyServer = await guildSchema.findOne({ serverID: message.guild.id });

        if (MyServer) {

            let user = message.mentions.members.first() || message.author;

            let embed = new MessageEmbed({
                description: `🌈 ${user} is ${generate.ranInt(1, 100)}% gay`,
                color: "RANDOM",
            });

            message.channel.send({ embeds: [embed] });

        } else {
            return message.channel.send("Please set up Stream Bot first. `/setup`");
        }
    }
}
