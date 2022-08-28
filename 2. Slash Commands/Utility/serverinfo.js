const { Client, MessageEmbed, CommandInteraction, Message, Guild } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "server-info",
    description: "Will get the server information.",
    permission: "MANAGE_CHANNELS",
    enabled: true,
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let myserver = guildSchema.findOne({ serverID: interaction.guild.id });

        if (myserver) {

            const { guild } = interaction;

            const embed = new MessageEmbed({
                title: `${guild.name} | Information`,
                description: `${guild.description || "`No description has been set`"}`,
                color: "#2f3136",
                thumbnail: {
                    url: `${guild.iconURL({ dynamic: true }) || "https://media.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif"}`
                },
                timestamp: new Date(),
                footer: {
                    text: `Guild ID: ${guild.id}`
                },
                fields: [
                    {
                        name: "__General__",
                        value: `**Server Name:** ${guild.name}\n**Server ID:** ${guild.id}\n**Server Owner:** <@${guild.ownerId}>`,
                        inline: true
                    },
                    {
                        name: "__Users__",
                        value: `**Total Member Count:** ${guild.memberCount}\n**Humans:** ${guild.members.cache.filter((m) => !m.user.bot).size}\n**Bots:** ${guild.members.cache.filter((m) => m.user.bot).size}`,
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: false
                    },
                    {
                        name: "__Channels__",
                        value: `**Total Channel Count:** ${guild.channels.cache.size}\n**Text Channels:** ${guild.channels.cache.filter((c) => c.type == "GUILD_TEXT").size}\n**Voice Channels:** ${guild.channels.cache.filter((c) => c.type == "GUILD_VOICE").size}\n**Public Thread Channels:** ${guild.channels.cache.filter((c) => c.type == "GUILD_PUBLIC_THREAD").size}\n**Private Thread Channels:** ${guild.channels.cache.filter((c) => c.type == "GUILD_PRIVATE_THREAD").size}\n**Categories** ${guild.channels.cache.filter((c) => c.type == "GUILD_CATEGORY").size}`,
                        inline: true
                    },
                    {
                        name: "__Nitro Statistics__",
                        value: `**Tier:** ${guild.premiumTier.replace("TIER_", "")}\n**Boosts:** ${guild.premiumSubscriptionCount}\n**Boostsers:** ${guild.members.cache.filter(m => m.premiumSince).size}`,
                        inline: true
                    }
                ]
            })

            interaction.reply({ embeds: [embed] })

        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }

    }
}
