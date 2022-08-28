const { Modal, TextInputComponent, showModal } = require("discord-modals");
const { ButtonInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    id: "apply-partner",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */ 
    async execute(interaction, client) {
        const modal = new Modal()
            .setCustomId("partner-app")
            .setTitle("🤝 Partnership Application")
            .addComponents(
                new TextInputComponent()
                    .setCustomId("partner-usertag")
                    .setLabel("What is your Discord Tag? (eg. Homer#0001)")
                    .setStyle("SHORT")
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId("partner-servername")
                    .setLabel("What is your server name?")
                    .setStyle("SHORT")
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId("server-link")
                    .setLabel("Please Provide a server link (permanent)")
                    .setStyle("SHORT")
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId("partner-reason")
                    .setLabel("What is your reason in wanting to partner?")
                    .setStyle("LONG")
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId("partner-nsfw")
                    .setLabel("Does your server contain any nsfw content")
                    .setStyle("SHORT")
                    .setRequired(true)
            )
        
        showModal(modal, {
            client: client, 
            interaction: interaction
        }); 
        
    }
}