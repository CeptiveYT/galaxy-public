const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const embed = require("@embeds");
const guildSchema = require("@schemas/guildSchema");
module.exports = {
    name: "privacy",
    description: "Get the Privacy Policy for Galaxy Bot",
    enabled: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        if (MyServer) {

            interaction.reply({ embeds: [embed.Privacy], ephemeral: true })

        } else {
            return interaction.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}