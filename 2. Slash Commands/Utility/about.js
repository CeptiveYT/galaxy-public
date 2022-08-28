const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const guildSchema = require("@schemas/guildSchema.js");
const embed = require("@embeds");

module.exports = {
    name: "about",
    description: "Information on Galaxy Bot.",
    enabled: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        if (MyServer) {

            const row = new MessageActionRow();
            row.addComponents(
                new MessageButton({
                    label: "About",
                    customId: "about",
                    disabled: true,
                    style: "SUCCESS"
                }),
                new MessageButton({
                    label: "Terms Of Service",
                    customId: "tos",
                    disabled: false,
                    style: "SUCCESS"
                })
            );

            let reply = await interaction.reply({ components: [row], embeds: [embed.About], ephemeral: true }); 
            

        } else {
            return interaction.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}