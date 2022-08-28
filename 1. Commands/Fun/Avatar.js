const { Client, Message, MessageEmbed, Channel } = require("discord.js");
const guildSchema = require("@schemas/guildSchema");

module.exports = {
    name: "avatar",
    description: "get the avatar of a person mentioned",
    aliases: ["av"],
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

            const member = message.mentions.members.first();

            if (!args[0]) return message.reply({
                content: "Please mention a user to get an avatar!"
            });
            if (!member) return message.reply({
                content: "That member does not exist"
            });

            const embed = new MessageEmbed({
                title: `${member.user.username}'s Avatar`,
                color: "LUMINOUS_VIVID_PINK",
                timestamp: new Date(),
                image: {
                    url: `${member.user.displayAvatarURL({ dynamic: true })}`
                }
            });

            await message.channel.send({
                embeds: [embed]
            })

        } else {
            return message.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
