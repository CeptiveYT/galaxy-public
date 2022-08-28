const {
    Client,
    MessageEmbed,
    CommandInteraction,
    Message,
} = require("discord.js");
const ms = require("ms")
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "giveaway",
    description: "⭐ Complete Giveaway system.",
    permission: "ADMINISTRATOR",
    enabled: true,
    premium: true, 
    options: [
        {
            name: "start",
            description: "⭐ Start a new giveaway.",
            type: 1,
            options: [
                {
                    name: "duration",
                    description: "Set the duration of the giveaway. (1m, 1h, 1d)",
                    type: 3,
                    required: true,
                },
                {
                    name: "winners",
                    description: "Set the number of winners there will be.",
                    type: 4,
                    required: true,
                },
                {
                    name: "prize",
                    description: "Set the name of the prize for the giveaway.",
                    type: 3,
                    required: true,
                },
                {
                    name: "channel",
                    description: "Set the channel for the giveaway.",
                    type: 7,
                    channelTypes: ["GUILD_TEXT"],
                    required: false,
                },
            ],
        },
        {
            name: "actions",
            description: "⭐ Options for giveaways.",
            type: 1,
            options: [
                {
                    name: "options",
                    description: "Select an option",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "end",
                            value: "end",
                        },
                        {
                            name: "pause",
                            value: "pause",
                        },
                        {
                            name: "unpause",
                            value: "unpause",
                        },
                        {
                            name: "reroll",
                            value: "reroll",
                        },
                        {
                            name: "delete",
                            value: "delete",
                        },
                    ],
                }, 
                {
                    name: "message_id", 
                    description: "Provide the message id of the giveaway.",
                    type: 3,
                    required: true
                }
            ],
        },
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id,
        });

        if (MyServer) {
            const { options } = interaction;

            const Sub = options.getSubcommand();

            const errorEmbed = new MessageEmbed({
                color: "RED",
            });

            const successEmbed = new MessageEmbed({
                color: "GREEN",
            });

            switch (Sub) {
                case "start":
                    {

                        const gchannel = options.getChannel("channel") || interaction.channel;
                        const duration = options.getString("duration");
                        const winnerCount = options.getInteger("winners"); 
                        const prize = options.getString("prize");

                        client.giveawaysManager.start(gchannel, {
                            duration: ms(duration),
                            winnerCount,
                            prize,
                            messages: {
                                giveaway: "🎉 **Giveaway Started** 🎉",
                                giveawayEnded: "🎊 **GIVEAWAY HAS ENDED** 🎊",
                                winMessage: "Congradulations, {winners}! You won **{this.prize}**!"
                            }
                        }).then(async () => {
                            successEmbed.setDescription("Giveaway has successfully started.");
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occured.\n\`\`\`${err}\`\`\``);
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });




                    }
                    break;

                case "actions": {
                    const choice = options.getString("options");
                    const messageId = options.getString("message_id");
                    
                    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guild.id && g.messageId === messageId);
                    
                    if (!giveaway) {
                        errorEmbed.setDescription(`Unable to find the giveaway with the messageid : ${messageId} in this guild,`);
                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                    }; 

                    switch (choice) {
                        //============================
                        case "end":
                            {

                                client.giveawaysManager
                                    .end(messageId)
                                    .then(() => {
                                        successEmbed.setDescription("Giveaway has ended.");
                                        return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                                    })
                                    .catch((err) => {
                                        errorEmbed.setDescription(`An error has occured :\n\`\`\`${err}\`\`\``)
                                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                                    });
                            }
                            break;
                        //============================
                        case "pause":
                            {
                                client.giveawaysManager
                                    .pause(messageId)
                                    .then(() => {
                                        successEmbed.setDescription("Giveaway has been paused.");
                                        return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                                    })
                                    .catch((err) => {
                                        errorEmbed.setDescription(`An error has occured :\n\`\`\`${err}\`\`\``)
                                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                                    });
                            }
                            break;
                        //============================
                        case "unpause":
                            {
                                client.giveawaysManager
                                    .unpause(messageId)
                                    .then(() => {
                                        successEmbed.setDescription("Giveaway has been unpaused.");
                                        return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                                    })
                                    .catch((err) => {
                                        errorEmbed.setDescription(`An error has occured :\n\`\`\`${err}\`\`\``)
                                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                                    });
                            }
                            break;
                        //============================
                        case "reroll":
                            {
                                client.giveawaysManager
                                    .reroll(messageId)
                                    .then(() => {
                                        successEmbed.setDescription("Giveaway has been rerolled.");
                                        return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                                    })
                                    .catch((err) => {
                                        errorEmbed.setDescription(`An error has occured :\n\`\`\`${err}\`\`\``)
                                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                                    });
                            }
                            break;
                        //============================
                        case "delete":
                            {
                                client.giveawaysManager
                                    .delete(messageId)
                                    .then(() => {
                                        successEmbed.setDescription("Giveaway has been deleted.");
                                        return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                                    })
                                    .catch((err) => {
                                        errorEmbed.setDescription(`An error has occured :\n\`\`\`${err}\`\`\``)
                                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                                    });
                            }
                            break;
                        //============================
                    }
                }
                default: {
                    console.log("error in giveaway command");
                }
            }
        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }
    },
};
