const { generate } = require("better-output");
const { Client, CommandInteraction, MessageEmbed, Message } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const guildSchema = require("../../Storage/Schemas/guildSchema");
const { PremiumCode, PremiumGuild } = require("../../Storage/Schemas/premiumSchema");

module.exports = {
    name: "premium",
    description: "Complete Premium System for galaxy bot",
    enabled: true,
    options: [
        {
            name: "generate-code",
            type: 1,
            description: "Generate a new premium guild code.",
            options: [
                {
                    name: "max-uses",
                    type: 4,
                    description: "Please enter a number of max uses.",
                    required: true,
                }
            ]
        },
        {
            name: "redeem-code",
            type: 1,
            description: "Redeem a Galaxy Premium Code.",
            options: [
                {
                    name: "code",
                    type: 3,
                    description: "Enter the Premium Code you got.",
                    required: true
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = guildSchema.findOne({
            serverID: interaction.guild.id
        });

        if (MyServer) {

            const {
                guild,
                options
            } = interaction;

            const sub = options.getSubcommand();

            switch (sub) {
                case "generate-code": {
                    if (interaction.member.id !== "621358600933081088")
                        return interaction.reply({
                            embeds: [
                                new MessageEmbed({
                                    color: "RED",
                                    description: "❌ This command has been limited to the bot owner only."
                                })
                            ],
                            ephemeral: true
                        });

                    let code = `${generate.ranString(5)}-${generate.ranString(5)}-${generate.ranString(5)}`;
                    let uses = options.getInteger("max-uses");

                    await PremiumCode.create({
                        Code: code.toUpperCase(),
                        MaxUses: uses,
                    }).then(() => {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed({
                                    color: "GREEN",
                                    title: "Galaxy Bot Premium Code",
                                    description: "A new galaxy premium code has been generated.",
                                    fields: [
                                        {
                                            name: "Generated Code",
                                            value: `\`\`\`${code.toUpperCase()}\`\`\``,
                                            inline: true
                                        }
                                    ]
                                })
                            ],
                            ephemeral: true
                        })
                    })
                }
                    break;
                case "redeem-code": {

                    let code = options.getString("code");

                    const DB_Code = await PremiumCode.findOne({ Code: code });
                    if (!DB_Code) return interaction.reply({
                        embeds: [
                            new MessageEmbed({
                                color: "RED",
                                author: { name: "❌ Invalid Premium Code was entered." },
                                timestamp: new Date()
                            })
                        ],
                        ephemeral: true
                    });

                    if (interaction.guild.ownerId !== interaction.member.id) return interaction.reply({
                        embeds: [
                            new MessageEmbed({
                                author: { name: "❌ Only the server Owner can redeem the premium code." },
                                color: "RED",
                                timestamp: new Date()
                            })
                        ],
                        ephemeral: true
                    });

                    if (DB_Code.MaxUses <= 0) {
                        return interaction.reply({
                            embeds: [
                                new MessageEmbed({
                                    color: "RED",
                                    author: { name: "❌ This premium code no longer has any uses left." }
                                })
                            ],
                            ephemeral: true
                        }).then(async () => {
                            await PremiumCode.deleteOne({Code: code});
                        })
                    };

                    let PremiumServer = await PremiumGuild.findOne({
                        ServerID: guild.id
                    });

                    if (PremiumServer) {
                        return interaction.reply({
                            embeds: [
                                new MessageEmbed({
                                    color: "RED",
                                    author: { name: "❌ This Server alreay has premium." }
                                })
                            ],
                            ephemeral: true
                        });
                    }

                    await DB_Code.updateOne({
                        $inc: {
                            "MaxUses": -1,
                        }
                    }).then(async () => {
                        await PremiumGuild.create({
                            ServerID: guild.id,
                            ServerName: guild.name,
                            OwnerID: guild.ownerId,
                            Permanent: true
                        }).then(() => {
                            interaction.reply({
                                embeds: [
                                    new MessageEmbed({
                                        description: "**<:heaven:1006697863033663508> You have redeemed Galaxy Premium!**",
                                        color: "LUMINOUS_VIVID_PINK"
                                    })
                                ]
                            })
                        })
                    })
                }
            }

        } else {
            return interaction.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
