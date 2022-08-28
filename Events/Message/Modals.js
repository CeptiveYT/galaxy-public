const { generate } = require("better-output");
const { Interaction, Client, MessageEmbed, Message } = require("discord.js");
const { PartnerApplication, StaffApplication } = require("../../Storage/Schemas/ApplicationSchema");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        if (!interaction.isModalSubmit()) return;

        if (interaction.customId == "partner-app") {

            await interaction.deferReply({ ephemeral: true })

            const ApplicationID = generate.ranString(15);
            const userid = interaction.member.user.id;

            await PartnerApplication.create({
                ApplicationID: ApplicationID,
                UserID: userid,
                usertag: interaction.fields.getTextInputValue("partner-usertag"),
                serverName: interaction.fields.getTextInputValue("partner-servername"),
                serverLink: interaction.fields.getTextInputValue("server-link"),
                partnerNSFW: interaction.fields.getTextInputValue("partner-nsfw"),
                partnerReason: interaction.fields.getTextInputValue("partner-reason")
            }).then(async () => {
                interaction.member.user.send({
                    content: "Here is the application you have filled out. For any more issues to fo with your application you can contact us using the **/contact** command in our server.",
                    embeds: [
                        new MessageEmbed({
                            title: `${interaction.member.user.username}'s Partnership Application`,
                            color: "YELLOW",
                            description: `**Application ID:** \`${ApplicationID}\`\n**User ID:** ${userid}\n**User Tag:** ${interaction.member.user.tag}`,
                            fields: [
                                {
                                    name: "Server Name",
                                    value: `\`\`\`${interaction.fields.getTextInputValue("partner-servername")}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Does the server have NSFW content?",
                                    value: `\`\`\`${interaction.fields.getTextInputValue("partner-nsfw")}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Server Link",
                                    value: `\`\`\`${interaction.fields.getTextInputValue("server-link")}\`\`\``,
                                },
                                {
                                    name: "Why do you want to partner with us?",
                                    value: `\`\`\`${interaction.fields.getTextInputValue("partner-reason")}\`\`\``,
                                }
                            ]
                        })
                    ]
                });

                const PartnerApplicationsChannel = interaction.guild.channels.cache.get("1009597321627041815");
                PartnerApplicationsChannel.send({
                    embeds: [
                        new MessageEmbed({
                            title: `${interaction.member.user.username}'s Partnership Application`,
                            color: "YELLOW",
                            description: `**Application ID:** \`${ApplicationID}\`\n**User ID:** ${userid}\n**User Tag:** ${interaction.member.user.tag}`,
                            fields: [
                                {
                                    name: "Server Name",
                                    value: `\`\`\`${interaction.fields.getTextInputValue("partner-servername")}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Does the server contain NSFW content?",
                                    value: `\`\`\`${interaction.fields.getTextInputValue("partner-nsfw")}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Server Link",
                                    value: `\`\`\`${interaction.fields.getTextInputValue("server-link")}\`\`\``,
                                },
                                {
                                    name: "Why do you want to partner with us?",
                                    value: `\`\`\`${interaction.fields.getTextInputValue("partner-reason")}\`\`\``,
                                }
                            ]
                        })
                    ]
                })

                await interaction.followUp({
                    embeds: [
                        new MessageEmbed({
                            title: "Your application has been submitted.",
                            description: "You will get a reply as soon as possible from one of our <@&1009610296836493312>!",
                            color: "GREEN"
                        })
                    ], ephemeral: true
                });
            })

        } else if (interaction.customId == "staff-app") {
            await interaction.deferReply({ ephemeral: true });

            const ApplicationID = generate.ranString(15);
            const userid = interaction.member.user.id;

            const usertag = interaction.fields.getTextInputValue("staff-usertag");
            const ModeratedBefore = interaction.fields.getTextInputValue("moderated-before");
            const StaffReason = interaction.fields.getTextInputValue("staff-reason");
            const scenario_1 = interaction.fields.getTextInputValue("scenario-1")
            const scenario_2 = interaction.fields.getTextInputValue("scenario-2");

            const staffAppChannels = interaction.guild.channels.cache.get("1009791028141764789");
            if (!staffAppChannels) return;

            await StaffApplication.create({
                ApplicationID: ApplicationID,
                UserID: userid,
                usertag: usertag,
                ModeratedBefore: ModeratedBefore,
                Reason: StaffReason,
                Scenario_1: scenario_1,
                Scenario_2: scenario_2
            }).then(async () => {
                interaction.member.user.send({
                    embeds: [
                        new MessageEmbed({
                            title: "🛠️ Staff Application",
                            author: {
                                name: `${interaction.guild.name}`,
                                iconURL: `${interaction.guild.iconURL({ dynamic: true })}`
                            },
                            description: "Thank you for applying for our staff team. We will message you back soon. Any issues please contact using the `/contact` command in out server.",
                            color: "BLUE",
                            fields: [
                                {
                                    name: "**__Application Information__**",
                                    value: `**Application ID:** \`${ApplicationID}\`\n**User Tag:** ${interaction.member.user.tag}\n**User ID:** ${interaction.member.user.id}`,
                                    inline: false
                                },
                                {
                                    name: "**Have you moderated any servers before?**",
                                    value: `\`\`\`${ModeratedBefore}\`\`\``,
                                },
                                {
                                    name: "**What is your reason in wanting to apply for staff/moderator?**",
                                    value: `\`\`\`${StaffReason}\`\`\``,
                                },
                                {
                                    name: "**If a member broke rule 5 what would you do?**",
                                    value: `\`\`\`${scenario_1}\`\`\``,
                                },
                                {
                                    name: "**If a member broke rule 4 what would you do?**",
                                    value: `\`\`\`${scenario_2}\`\`\``
                                }
                            ]
                        })
                    ]
                })

                staffAppChannels.send({
                    embeds: [
                        new MessageEmbed({
                            title: `${interaction.member.user.username}'s Staff Application`,
                            description: "Thank you for applying for our staff team. We will message you back soon. Any issues please contact using the `/contact` command in out server.",
                            color: "BLUE",
                            fields: [
                                {
                                    name: "**__Application Information__**",
                                    value: `**Application ID:** \`${ApplicationID}\`\n**User Tag:** ${interaction.member.user.tag}\n**User ID:** ${interaction.member.user.id}`,
                                    inline: false
                                },
                                {
                                    name: "**Have you moderated any servers before?**",
                                    value: `\`\`\`${ModeratedBefore}\`\`\``,
                                },
                                {
                                    name: "**What is your reason in wanting to apply for staff/moderator?**",
                                    value: `\`\`\`${StaffReason}\`\`\``,
                                },
                                {
                                    name: "**If a member broke rule 5 what would you do?**",
                                    value: `\`\`\`${scenario_1}\`\`\``,
                                },
                                {
                                    name: "**If a member broke rule 4 what would you do?**",
                                    value: `\`\`\`${scenario_2}\`\`\``
                                }
                            ]
                        })
                    ]
                })

                await interaction.followUp({
                    embeds: [
                        new MessageEmbed({
                            color: "BLUE", 
                            title: "Staff Application has been submitted.",
                            description: `Thank you for submitting an application with us! Any questions or issues please contact using the \`/contact\` command in our server.`
                        })
                    ]
                }); 
            })
        }

    }
}