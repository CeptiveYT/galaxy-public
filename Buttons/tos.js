const {
    ButtonInteraction,
    Client, 
    MessageActionRow, 
    MessageButton
} = require("discord.js");
const embed = require("@embeds")

module.exports = {
    id: "tos",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {

        const row = new MessageActionRow();
        row.addComponents(
            new MessageButton({
                label: "About",
                customId: "about",
                disabled: false,
                style: "SUCCESS"
            }),
            new MessageButton({
                label: "Terms Of Service",
                customId: "tos",
                disabled: true,
                style: "SUCCESS"
            })
        );

        interaction.update({embeds: [embed.TOS], components: [row]})

    }
}