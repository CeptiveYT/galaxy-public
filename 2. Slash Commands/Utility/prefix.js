const { Client, MessageEmbed, CommandInteraction, Message } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const { invisible } = require("../../Storage/Colors/EmbedColors");
const { date } = require('better-output');
module.exports = {
    name: "prefix",
    description: "Change the prefix",
    permission: "ADMINISTRATOR",
    enabled: true,
    options: [
        {
            name: "prefix",
            type: 3,
            description: "Your new prefix.",
            required: true
        }
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({ serverID: interaction.guild.id });

        if (MyServer) {

            let prefix = interaction.options.getString("prefix");
            if (prefix.length > 2) {
                return interaction.reply("The prefix must be 1 or 2 characters long.\nExamples: `?` `s?`");
            } else {

                let log = interaction.guild.channels.cache.get(MyServer.logchannelID);
                if (!MyServer.logchannelID) return;

                await MyServer.updateOne({ prefix: prefix });
                interaction.reply(`Successfully updated the prefix to \`${prefix}\``);

                await log.send({
                    embeds: [
                        new MessageEmbed({
                            title: "Mod Log | Prefix Change",
                            description: `Changed the prefix.`,
                            color: `${invisible}`,
                            fields: [
                                {
                                    name: "New Prefix",
                                    value: `\`\`\`${prefix}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Time",
                                    value: `\`\`\`${date.today()}\`\`\``,
                                    inline: true
                                }
                            ]
                        })
                    ]
                })
            }
        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }
    }
}
