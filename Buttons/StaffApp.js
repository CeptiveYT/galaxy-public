const { ButtonInteraction, Client, MessageEmbed } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require("discord-modals");

module.exports = {
    id: "apply-staff",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const modal = new Modal()
            .setCustomId("staff-app")
            .setTitle("Staff Application")
            .setComponents(
                new TextInputComponent()
                    .setCustomId("staff-usertag")
                    .setLabel("What is your Discord Tag? (eg. Homer#0001)")
                    .setStyle("SHORT")
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId("moderated-before")
                    .setLabel("Have you moderated any servers before?")
                    .setStyle("LONG")
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId("staff-reason")
                    .setLabel("What is your reason on applying for staff?")
                    .setStyle("LONG")
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId("scenario-1")
                    .setLabel("If a member broke rule 5 what would you do?")
                    .setStyle("LONG")
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId("scenario-2")
                    .setLabel("If a member broke rule 4 what would you do?")
                    .setStyle("LONG")
                    .setRequired(true),
            )

            showModal(modal, {
                client: client, 
                interaction: interaction
            })
    }
}