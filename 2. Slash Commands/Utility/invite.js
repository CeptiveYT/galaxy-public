const { Client, MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "invite",
    description: "Invite Galaxy to your server",
    enabled: true,
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute (interaction, client) {
        let MyServer = await guildSchema.findOne({ serverID: interaction.guild.id });

        if (MyServer) {

            const embed = new MessageEmbed({
                title: "Invite Galaxy", 
                description: `Invite Galaxy to your server by clicking the button below!`, 
                color: "LUMINOUS_VIVID_PINK"
            });

            const row = new MessageActionRow()
            row.addComponents(
                new MessageButton({
                    label: "Invite me!", 
                    emoji: "🤖", 
                    style: "LINK",
                    url: "https://discord.com/api/oauth2/authorize?client_id=1000760561002365049&permissions=8&scope=applications.commands%20bot"
                })
            );

            interaction.reply({
                embeds: [embed], components: [row], ephemeral: true
            })

        } else {
            return interaction.reply("Please set up Stream Bot first. `/setup`");
        }
    }
}
