const { date } = require("better-output");
const { Client, CommandInteraction, MessageEmbed, MessageManager, MessageActionRow } = require("discord.js"); 
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "contact",
    description: "contact the support server.",
    enabled: true,
    options: [
        {
            name: "department",
            type: 3, 
            description: "Choose a department to contact.",
            required: true, 
            choices: [
                {
                    name: "Partnership Application Department",
                    value: "partnership"
                },
                {
                    name: "Staff Application Department", 
                    value: "staff-apps"
                }
            ]
        },
        {
            name: "message", 
            type: 3,
            description: "Enter the message you want to send to the department.",
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        if (MyServer) {

            const {
                guild, 
                member, 
                options
            } = interaction; 

            const department = options.getString("department"); 
            const message = options.getString("message");

            const StaffAppSupportChannel = client.channels.cache.get("1009814511345209374"); 
            const PartnershipAppSupportChannel = client.channels.cache.get("1009814938094686319"); 
            switch (department) {
                case "partnership": {
                    await PartnershipAppSupportChannel.send({
                        embeds: [
                            new MessageEmbed({
                                title: `${member.user.tag} | New message`,
                                description: `**User:** ${member}\n**Time Sent:** ${date.today()}`, 
                                color: "NAVY", 
                                fields: [
                                    {
                                        name: "Message", 
                                        value: `\`\`\`${message}\`\`\``
                                    }
                                ]
                            })
                        ]
                    }); 
                    await interaction.reply({
                        embeds: [
                            new MessageEmbed({
                                color: "GREEN", 
                                description: "Your message has been send to right department. Please keep your dms open so a member of the department can contact you!" 
                            })
                        ], 
                        ephemeral: true
                    })
                }
                break; 
                case "staff-apps": {
                    
                    await StaffAppSupportChannel.send({
                        embeds: [
                            new MessageEmbed({
                                title: `${member.user.tag} | New message`,
                                description: `**User:** ${member}\n**Time Sent:** ${date.today()}`, 
                                color: "NAVY", 
                                fields: [
                                    {
                                        name: "Message", 
                                        value: `\`\`\`${message}\`\`\``
                                    }
                                ]
                            })
                        ]
                    })
                    await interaction.reply({
                        embeds: [
                            new MessageEmbed({
                                description: "Your message has been send to right department. Please keep your dms open so a member of the department can contact you!",
                                color: "GREEN"
                            })
                        ], 
                        ephemeral: true
                    })

                }
            }

        } else {
            return interaction.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
