const {
    Client,
    MessageEmbed,
    CommandInteraction,
    Message,
    Guild
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    invisible
} = require("../../Storage/Colors/EmbedColors");
const Ascii = require("ascii-table");

module.exports = {
    name: "servers",
    description: "Get the top 10 server",
    enabled: true,
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        if (MyServer) {

            if (interaction.member.id !== "621358600933081088")
                return interaction.reply({
                    content: "This command has been restricted to developers only.",
                    ephemeral: true
                })

            const guilds = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first(10);

            interaction.reply({
                embeds: [new MessageEmbed({
                    color: `${invisible}`, 
                    description: `${guilds.map((guild, index) => {
                        return `**${index+1}.** **${guild.name}** - **\`${guild.memberCount} members\`**`
                    }).join("\n")}`, 
                    title: "Top 10 Servers (Member Count)"
                })]
            })

        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }
    }
}