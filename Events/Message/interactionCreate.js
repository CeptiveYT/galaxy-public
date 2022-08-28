const {
    date
} = require("better-output");
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
require("colors");
const BotGuilds = require("../../Storage/Schemas/guildSchema")
const {
    PremiumGuild
} = require("../../Storage/Schemas/premiumSchema")

module.exports = {
    name: "interactionCreate",
    once: false,
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.slash.get(interaction.commandName);

            try {
                if (!command) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed({
                                description: "⛔ An error has occured. Please check the console for more",
                                color: "RED"
                            })

                        ]
                    }) && client.slash.delete(interaction.commandName)
                }
                if (command.permission && !interaction.member.permissions.has(command.permission)) {
                    return interaction.reply({
                        content: `You do not have the required permission for this command: \`${interaction.commandName}\`.`,
                        ephemeral: true
                    })
                }

            } catch (err) {
                console.log(err);
            }

            const Premium = await PremiumGuild.findOne({
                ServerID: interaction.guild.id
            })

            if (!command.enabled || command.enabled === false) return interaction.reply({
                content: "This command has been disabled.",
                ephemeral: true
            });

            if (command.premium || command.premium === true) {
                if (!Premium) return interaction.reply({
                    content: "This command has been limited to premium servers only.",
                    ephemeral: true
                })
            }

            await command.execute(interaction, client)
            console.log(`[Slash Command - ${date.now()}]`.magenta + " " + `Executed /${command.name} in "${interaction.guild.name}"`.white);
        }

    }
}