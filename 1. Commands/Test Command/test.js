const { Client, Message, MessageEmbed, Channel } = require("discord.js")
const guildSchema = require("../../Storage/Schemas/guildSchema");
const embed = require("@embeds")

module.exports = {
    name: "test",
    aliases: ["t", "testing"],
    permissions: "ADMINISTRATOR",
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

            const {
                channel, 
                author
            } = message; 

            channel.send({embeds: [embed.TestEmbed]})

        } else {
            return message.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
