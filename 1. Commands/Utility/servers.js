const asciiTable = require('ascii-table');
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    invisible
} = require("../../Storage/Colors/EmbedColors");
module.exports = {
    name: "servers",
    cooldown: 0,
    permissions: "ADMINISTARTOR",
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

            let devID = "621358600933081088";

            if (message.author.id != devID) return message.channel.send("This command has been limited to developers only.");

            const guilds = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first(10);

            message.channel.send({
                embeds: [new MessageEmbed({
                    color: `${invisible}`, 
                    description: `${guilds.map((guild, index) => {
                        return `**${index+1}.** **${guild.name}** - **\`${guild.memberCount} members\`**`
                    }).join("\n")}`, 
                    title: "Top 10 Servers (Member Count)"
                })]
            })

        } else {
            return message.channel.send("Please set up Stream Bot first. `/setup`");
        }
    }
}