const { Client, MessageEmbed, CommandInteraction, Message } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "userinfo",
    description: "Get someones user info",
    permission: "BAN_MEMBERS",
    enabled: true,
    options: [
        {
            name: "user",
            type: 6 ,
            description: "Select or search for a user",
            required: true
        }
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = guildSchema.findOne({ serverID: interaction.guild.id });

        if (MyServer) {

            let user = interaction.options.getUser("user");
            const member = interaction.guild.members.cache.get(user.id);

            const embed = new MessageEmbed({
                title: `${user.username}'s User Information`,
                description: `**Account Creation:** <t:${parseInt(user.createdTimestamp / 1000)}:R>`,
                fields: [
                    {
                        name: "Username",
                        value: `\`\`\`${user.username}\`\`\``,
                        inline: true
                    },
                    {
                        name: "User ID",
                        value: `\`\`\`${user.id}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Discriminator",
                        value: `\`\`\`#${user.discriminator}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Roles",
                        value: `${member.roles.cache.map(r => r).join(" ").replace("@everyone", " ")}`,
                        inline: false
                    }
                ],
                color: "#2f3136"
            })

            interaction.reply({ embeds: [embed], ephemeral: true })

        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }

    }
}
