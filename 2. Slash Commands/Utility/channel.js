const {
    Client,
    MessageEmbed,
    CommandInteraction,
    Message
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "channel",
    description: "Complete channel system",
    permission: "MANAGE_CHANNELS",
    enabled: true,
    options: [{
            name: "create",
            description: "Create a new channel",
            type: 1,
            options: [{
                    name: "channel-name",
                    description: "Enter a name for the channel",
                    type: 3,
                    required: true
                },
                {
                    name: "channel-type",
                    description: "Select a channel type",
                    type: 3,
                    required: true,
                    choices: [{
                            name: "text",
                            value: "text",
                        },
                        {
                            name: "voice",
                            value: "voice",
                        },
                        {
                            name: "stage",
                            value: "stage"
                        }
                    ]
                },
                {
                    name: "category",
                    description: "Select a category for the channel to be created in.",
                    type: 7,
                    channelTypes: "GUILD_CATEGORY",
                    required: false
                }
            ],
        },
        {
            name: "delete",
            description: "Delete a channel from the server",
            type: 1,
            options: [{
                name: "channel",
                description: "Select a channel to delete",
                type: 7,
                required: true,
            }]
        }
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        if (MyServer) {

            const {
                options,
                guild
            } = interaction;

            const sub = options.getSubcommand();

            const successEmbed = new MessageEmbed({
                color: "GREEN"
            });

            const errorEmbed = new MessageEmbed({
                color: "RED"
            });

            switch (sub) {
                case "create": {
                    let channelName = options.getString("channel-name");
                    let channelType = options.getString("channel-type");
                    let category = options.getChannel("category");

                    if (category.type !== "GUILD_CATEGORY") {
                        errorEmbed.setDescription("Please enter a category not a channel.");
                        return interaction.reply({
                            embeds: [errorEmbed],
                            ephemeral: true
                        })
                    }

                    switch (channelType) {

                        case "text": {

                            if (!category) {
                                let newTextChannel = await guild.channels.create(`${channelName}`, {
                                    type: "GUILD_TEXT"
                                }).catch((err) => {
                                    errorEmbed.setDescription("An error has occured;");
                                    return interaction.reply({
                                        embeds: [errorEmbed],
                                        ephemeral: true
                                    });
                                })

                                await successEmbed.setDescription(`Successfully Created <#${newTextChannel.id}>`);

                                interaction.reply({
                                    embeds: [successEmbed],
                                    ephemeral: true
                                })


                            } else {
                                let newTextChannel = await guild.channels.create(`${channelName}`, {
                                    type: "GUILD_TEXT",
                                    parent: `${category.id}`
                                }).catch((err) => {
                                    errorEmbed.setDescription("An error has occured;");
                                    return interaction.reply({
                                        embeds: [errorEmbed],
                                        ephemeral: true
                                    });
                                })

                                await successEmbed.setDescription(`Successfully Created <#${newTextChannel.id}> in **${category.name}**`);

                                interaction.reply({
                                    embeds: [successEmbed],
                                    ephemeral: true
                                })
                            }

                        }
                        break;

                    case "voice": {

                        if (!category) {
                            let newVoiceChannel = await guild.channels.create(`${channelName}`, {
                                type: "GUILD_VOICE"
                            }).catch((err) => {
                                errorEmbed.setDescription("An error has occured;");
                                return interaction.reply({
                                    embeds: [errorEmbed],
                                    ephemeral: true
                                });
                            })

                            await successEmbed.setDescription(`Successfully Created <#${newVoiceChannel.id}>`);

                            interaction.reply({
                                embeds: [successEmbed],
                                ephemeral: true
                            })


                        } else {
                            let newVoiceChannel = await guild.channels.create(`${channelName}`, {
                                type: "GUILD_VOICE",
                                parent: `${category.id}`
                            }).catch((err) => {
                                errorEmbed.setDescription("An error has occured;");
                                return interaction.reply({
                                    embeds: [errorEmbed],
                                    ephemeral: true
                                });
                            })

                            await successEmbed.setDescription(`Successfully Created <#${newVoiceChannel.id}> in **${category.name}**`);

                            interaction.reply({
                                embeds: [successEmbed],
                                ephemeral: true
                            })
                        }

                    }
                    break;

                    case "stage": {

                        if (!category) {
                            let newStageVoice = await guild.channels.create(`${channelName}`, {
                                type: "GUILD_STAGE_VOICE"
                            }).catch((err) => {
                                errorEmbed.setDescription("You need to setup discord community in your server settings in order to create stage channels.");
                                return interaction.reply({
                                    embeds: [errorEmbed],
                                    ephemeral: true
                                });
                            })

                            await successEmbed.setDescription(`Successfully Created ${newStageVoice}`);

                            interaction.reply({
                                embeds: [successEmbed],
                                ephemeral: true
                            })


                        } else {
                            let newStageVoice = await guild.channels.create(`${channelName}`, {
                                type: "GUILD_STAGE_VOICE",
                                parent: `${category.id}`
                            }).catch((err) => {
                                errorEmbed.setDescription("You need to setup discord community in your server settings in order to create stage channels.");
                                return interaction.reply({
                                    embeds: [errorEmbed],
                                    ephemeral: true
                                });
                            })

                            await successEmbed.setDescription(`Successfully Created ${newStageVoice} in **${category.name}**`);

                            interaction.reply({
                                embeds: [successEmbed],
                                ephemeral: true
                            })
                        }

                    }

                    }
                }
                break;

            case "delete": {

                let channel = options.getChannel("channel");

                if (channel.type === "GUILD_CATEGORY") {
                    errorEmbed.setDescription("You cannot delete a category");
                    return interaction.reply({
                        embeds: [errorEmbed],
                        ephemeral: true
                    })
                }

                await guild.channels.delete(channel).then(() => {
                    successEmbed.setDescription(`Successfully deleted **${channel.name}** from the server.`);
                    return interaction.reply({
                        embeds: [
                            successEmbed
                        ],
                        ephemeral: true
                    })
                })

            }

            }

        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }
    }
}