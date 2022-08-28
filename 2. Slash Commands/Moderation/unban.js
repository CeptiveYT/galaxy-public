const { Client, MessageEmbed, CommandInteraction, interaction } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "unban",
    description: "Unban a user from the server",
    permission: "BAN_MEMBERS",
    enabled: true,
    options: [
        {
            name: "user-id",
            description: "Provide a user id",
            type: 3,
            required: true
        },
        {
            name: "reason",
            description: "Provide a reason for the unban.", 
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

            const id = interaction.options.getString("user-id"); 
            if (isNaN(id)) return interaction.reply("You need to state a valid user id!");

            const bannedUsers = await interaction.guild.bans.fetch();
            const user = await bannedUsers.get(id);
            if (!user) return interaction.reply("I was unable to find that user, please try another user or id.");

            let reason = interaction.options.getString("reason"); 
            if (!reason) reason = "No reason has been provided"

            await interaction.guild.members.unban(user.user, reason);
            const response = new MessageEmbed({
                title: `Unbanned ${user.user.username}`,
                description: `Successfully unbanned ${user.user}.\nCheck the logs for more information`,
                color: "GREEN"
            })
            interaction.reply({ embeds: [response] });

            let Log = interaction.guild.channels.cache.get(MyServer.logchannelID);
            if (!MyServer.logchannelID) return;

            const logEmbed = new MessageEmbed({
                title: "Mod Log | User Unbanned",
                description: `${user.user} has been unbanned from the server.`,
                color: `${invisible}`,
                fields: [
                    {
                        name: "Username",
                        value: `\`\`\`${user.user.username}\`\`\``,
                        inline: true
                    },
                    {
                        name: "User ID",
                        value: `\`\`\`${user.user.id}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Discriminator",
                        value: `\`\`\`#${user.user.discriminator}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: `\`\`\`${reason}\`\`\``,
                        inline: true
                    },
                ],
                thumbnail: {
                    url: `${user.user.displayAvatarURL({ dynamic: true })}`
                }
            })

            Log.send({ embeds: [logEmbed] })

        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }
    }
}
