const { Client, MessageEmbed, CommandInteraction, Message } = require('discord.js');
const { invisible } = require('../../Storage/Colors/EmbedColors');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "kick",
    description: "Kick a member from the server",
    permission: "KICK_MEMBERS",
    enabled: true,
    options: [
        {
            name: "user",
            description: "Choose a User.",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "Enter a reason for the kick",
            type: 3,
            required: false
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

            const { options, guild } = interaction;

            const user = options.getUser("user");
            let reason = options.getString("reason");

            if (!reason) reason = "No reason has been given.";

            let Target = guild.members.cache.get(user.id);
            if (!Target.kickable) return interaction.reply({ content: "I am unable to kick that member." });

            try {

                Target.kick({
                    reason: reason
                })

                let logChannel = guild.channels.cache.get(MyServer.logchannelID);
                if (!MyServer.logchannelID) return;

                let logEmbed = new MessageEmbed({
                    title: "Mod Log | User Kicked",
                    description: `${Target} has been Kicked from the server.`,
                    color: `${invisible}`,
                    fields: [
                        {
                            name: "User Tag",
                            value: `\`\`\`${Target.user.tag}\`\`\``,
                            inline: true
                        },
                        {
                            name: "User ID",
                            value: `\`\`\`${Target.user.id}\`\`\``,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value: `\`\`\`${reason}\`\`\``,
                            inline: true
                        },
                    ]
                })

                let response = new MessageEmbed({
                    description: `${Target} has been kicked from the server.`,
                    color: "GREEN"
                })

                interaction.reply({ embeds: [response], ephemeral: true });
                await logChannel.send({ embeds: [logEmbed] });

            } catch (err) {
                console.log(err);
            }


        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }
    }
}
