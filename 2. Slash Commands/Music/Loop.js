const { Client, CommandInteraction, MessageEmbed, MessageMentions } = require("discord.js")
const guildSchema = require("../../Storage/Schemas/guildSchema");
const { PremiumGuild } = require("../../Storage/Schemas/premiumSchema")

module.exports = {
    name: "loop",
    description: "⭐ loop the current queue.",
    enabled: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        const {
            guild,
            member,
            channel,
            options
        } = interaction;

        let premium = await PremiumGuild.findOne({ ServerID: interaction.guild.id });
        if (!premium) return interaction.reply({
            embeds: [
                new MessageEmbed({
                    author: { name: "This command is limited to premium guilds only." },
                    description: "Buy Galaxy Premium Here - [Buy Premium](https://discord.com/channels/990391641930100756/1009213365782065222)"
                })
            ]
        })

        if (MyServer) {

            const VoiceChannel = member.voice.channel;
            if (!VoiceChannel) return interaction.reply({
                embeds: [
                    new MessageEmbed({
                        description: "You must be in a voice channel before using this command.",
                        color: "RED"
                    })
                ]
            });

            if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed({
                            color: "RED",
                            description: `I am already playing music in <#${guild.me.voice.channelId}>`
                        })
                    ]
                })
            };

            const queue = client.distube.getQueue(VoiceChannel);

            if (!queue)
                return interaction.reply({
                    embeds: [
                        new MessageEmbed({
                            color: "RED", description: "⛔ There is no queue."
                        })
                    ]
                });

            let mode = await client.distube.setRepeatMode(queue);
            return interaction.reply({
                embeds: [
                    new MessageEmbed({
                        color: "LUMINOUS_VIVID_PINK",
                        description: `🔁 Repeat Mode is set to: ${mode = mode ? mode == 2 ? "Queue" : "Song" : "Off"}`
                    })
                ]
            })

        } else {
            return interaction.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
