const { ButtonInteraction, Client, MessageEmbed } = require("discord.js"); 

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        if (!interaction.isButton()) return; 
        const Button = client.buttons.get(interaction.customId);

        Button.execute(interaction, client)
    }
}