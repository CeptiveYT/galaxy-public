const { Client, CommandInteraction, MessageEmbed, MessageActionRow, Message, MessageButton } = require("discord.js")
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "apply",
    description: "Choose an application to apply for.",
    enabled: true,
    options: [
        {
            name: "application",
            type: 3,
            description: "Choose an application to fill out.",
            required: true,
            choices: [
                {
                    name: "🤝 Partnership Application",
                    value: "partner"
                },
                {
                    name: "🛠️ Staff Application",
                    value: "staff"
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.guild.id !== "990391641930100756") return interaction.reply({
            embeds: [
                new MessageEmbed({
                    color: "RED",
                    description: "❌ This command has been limited to the bots main guild. [server invote](https://discord.gg/pZ8D8vqRqX)",
                })
            ],
            ephemeral: true
        });

        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        const {
            options,
            guild,
            reply
        } = interaction;

        if (MyServer) {

            const application = options.getString("application");
            switch (application) {
                case "partner": {
                    const embed = new MessageEmbed({
                        color: "GREEN",
                        description: "Please click the button below to apply for Partnership with our server. Once the form has been filled out you will recieve your application details and application id. If there is any issues please send us a message using `/contact [message]` and we will get back to you as soon as possible.",
                        title: "🤝 Partnership Application",
                    });
                    const row = new MessageActionRow();
                    row.addComponents(
                        new MessageButton()
                            .setCustomId("apply-partner")
                            .setLabel("Apply")
                            .setStyle("SUCCESS")
                    )

                    interaction.reply({
                        embeds: [embed],
                        components: [row]
                    });
                }
                    break;
                case "staff": {
                    const embed = new MessageEmbed({
                        color: "GREEN",
                        description: "Please click the button below to apply for Staff in our server. Once the form has been filled out you will recieve your application details and application id. If there is any issues please send us a message using `/contact [message]` and we will get back to you as soon as possible.",
                        title: "🛠️ Saff Application",
                    });
                    const row = new MessageActionRow();
                    row.addComponents(
                        new MessageButton()
                            .setCustomId("apply-staff")
                            .setLabel("Apply")
                            .setStyle("SUCCESS")
                    )

                    interaction.reply({
                        embeds: [embed],
                        components: [row]
                    });
                }
            }

        } else {
            return interaction.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
