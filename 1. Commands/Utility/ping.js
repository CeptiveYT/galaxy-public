const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "ping",
    cooldown: 0,
    aliases: ["latency"],
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

            let e;

            if (client.ws.ping <= 185) {
                e = "<:connection_speed_great:1007787267013750865>";
            } else if (client.ws.ping <= 250) {
                e = "<:connection_speed_ok:1007787268339150898>";
            } else {
                e = "<:connection_speed_bad:1007787265193426986>";
            }

            message.channel.send({content: "Calculating Galaxy Speed..."}).then((resultMessage) => {
                let ping = resultMessage.createdTimestamp - message.createdTimestamp;

                let f;

                if (ping <= 300) {
                    f = "<:connection_speed_great:1007787267013750865>";
                } else if (ping <= 450) {
                    f = "<:connection_speed_ok:1007787268339150898>";
                } else {
                    f = "<:connection_speed_bad:1007787265193426986>";
                }

                resultMessage.edit({
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
                                    name: "Message Speed",
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
            return message.channel.send("Please set up Stream Bot first. `/setup`");
        }
    }
}