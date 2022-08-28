const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const guildSchema = require("../../Storage/Schemas/guildSchema");
const { PremiumGuild } = require("../../Storage/Schemas/premiumSchema")

module.exports = {
    name: "play",
    description: "⭐ Play a song",
    enabled: true,
    options: [
        {
            name: "query", 
            type: 3, 
            description: "Enter a song name or url.", 
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        let premium = await PremiumGuild.findOne({ServerID: interaction.guild.id});
        if (!premium) return interaction.reply({
            embeds: [
                new MessageEmbed({
                    author: { name: "This command is limited to premium guilds only." },
                    description: "Buy Galaxy Premium Here - [Buy Premium](https://discord.com/channels/990391641930100756/1009213365782065222)"
                })
            ]
        })

        if (MyServer) {

            const {
                guild, 
                member, 
                channel, 
                options
            } = interaction; 

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

            client.distube.play(VoiceChannel, options.getString("query"),{ textChannel: interaction.channel, member: interaction.member }); 
            await interaction.reply({
                embeds: [
                    new MessageEmbed({
                        description: "You request has been recieved!", 
                        color: "LUMINOUS_VIVID_PINK"
                    })
                ]
            }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply(); 
                }, 3000);
            })

        } else {
            return interaction.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
