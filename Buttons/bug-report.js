const { ButtonInteraction, Client, MessageEmbed } = require("discord.js");
const { Error } = require("../Storage/Schemas/BotErrorSchema");

module.exports = {
    id: "bug-report",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute (interaction, client) {

        const Err = await Error.findOne({
            ErrorID: interaction.message.id
        });

        let ErrLog = await client.channels.cache.get("1011722671777656893").send({
            embeds: [
                new MessageEmbed({
                    color: `${Err.Embed.Color}`, 
                    title: `${Err.Embed.Title}`, 
                    fields: [
                        {
                            name: "Date", 
                            value: `${Err.Date}`, 
                            inline: true
                        }, 
                        {
                            name: "Command", 
                            value: `${Err.Command}`, 
                            inline: true 
                        },
                        {
                            name: "Err", 
                            value: `${Err.Embed.Description}`
                        }
                    ]
                })
            ]
        }); 
        
        interaction.update({
            embeds: [
                new MessageEmbed({
                    color: "GREEN", 
                    description: "Thank you for your report, this should be fixed soon.\nSorry for the inconvenience. If this command was a premium only feature you will be entitled to some compensation (1 Free Premium Code)"
                })
            ],
            components: []
        })
    }
}