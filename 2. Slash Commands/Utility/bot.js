const { Client, MessageEmbed, CommandInteraction, Message } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const mongoose = require("mongoose");

module.exports = {
    name: "bot",
    description: "Get the information about the bot.",
    permission: "ADMINISTRATOR",
    enabled: true,
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({ serverID: interaction.guild.id });

        if (MyServer) {

            const reply = new MessageEmbed({
                title: "Stream Bots Information",
                color: "#2f3136",
                thumbnail: {
                    url: `${client.user.displayAvatarURL()}`
                },
                description: `**Uptime:**  <t:${parseInt(client.readyTimestamp / 1000)}:R> \n**Status:** \`🟢 ONLINE\` \n**Database:** \`${SwitchTo(mongoose.connection.readyState)}\``,
                fields: [
                    {
                        name: "Shard Count",
                        value: `\`\`\`${client.shard.count}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Server Count",
                        value: `\`\`\`${client.guilds.cache.size}\`\`\``,
                        inline: true
                    }
                ]
            })

            interaction.reply({ embeds: [reply] });

        } else {
            interaction.reply({ content: "Please set up Galaxy Bot first. `/setup`" });
        }

        function SwitchTo(val) {
            var status = " ";
            switch (val) {
                case 0: status = "🔴 DISCONNECTED"
                    break;
                case 1: status = "🟢 CONNECTED"
                    break;
                case 2: status = "🟡 CONNECTING"
                    break;
                case 3: status = "🟣 DISCONNECTING"
                    break;
            }

            return status
        }

    }
}
