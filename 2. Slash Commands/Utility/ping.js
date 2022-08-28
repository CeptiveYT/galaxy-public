const {
    Client,
    MessageEmbed,
    CommandInteraction,
    Message
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "ping",
    description: "Get Stream Bot's Ping.",
    enabled: true,
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        let MyServer = guildSchema.findOne({
            serverID: interaction.guild.id
        });

        if (MyServer) {

            let e;

            if (client.ws.ping <= 185) {
                e = "<:connection_speed_great:1007787267013750865>";
            } else if (client.ws.ping <= 250) {
                e = "<:connection_speed_ok:1007787268339150898>";
            } else {
                e = "<:connection_speed_bad:1007787265193426986>";
            }

            interaction.reply("d").then(() => {
                interaction.deleteReply();
            })

            interaction.channel.send("Calculating Galaxy Speed...").then(async (resultMessage) => {
                let ping = resultMessage.createdTimestamp - interaction.createdTimestamp;

                let f;

                if (ping <= 300) {
                    f = "<:connection_speed_great:1007787267013750865>";
                } else if (ping <= 400) {
                    f = "<:connection_speed_ok:1007787268339150898>";
                } else {
                    f = "<:connection_speed_bad:1007787265193426986>";
                }

                await resultMessage.edit({
                    content: " ",
                    embeds: [
                        new MessageEmbed({
                            color: "#2f3136",
                            fields: [{
                                    name: "API Speed",
                                    value: `${e} | ${client.ws.ping}ms`,
                                    inline: true
                                },
                                {
                                    name: "Interaction Speed",
                                    value: `${f} | ${ping}ms`,
                                    inline: true
                                },
                                {
                                    name: "Uptime",
                                    value: `🔧 | <t:${parseInt(client.readyTimestamp / 1000)}:R>`,
                                    inline: true
                                }
                            ]
                        })
                    ]
                })
            })

        } else {
            return interaction.reply({
                content: "Please set up Galaxy Bot first. `/setup`"
            })
        }

    }
}