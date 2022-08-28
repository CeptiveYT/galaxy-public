const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js")
const guildSchema = require("@schemas/guildSchema");
const {
    Blacklist
} = require("../../Storage/Schemas/UserBlacklist");
const {
    generate
} = require("better-output");
const moment = require("moment");

module.exports = {
    name: "blacklist",
    description: "⭐ Full blacklist system!",
    permission: "BAN_MEMBERS",
    enabled: true,
    premium: true,
    options: [{
            name: "add",
            type: 1,
            description: "⭐ Add a user to your servers blacklist.",
            options: [{
                    name: "add-user",
                    description: "Select a user to blacklist",
                    type: 6,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Enter a reason for the blacklist",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            name: "remove",
            type: 1,
            description: "⭐ Remove a user from the blacklist",
            options: [{
                name: "userid",
                type: 3,
                description: "enter a userid",
                required: true
            }]
        },
        {
            name: "list",
            type: 1,
            description: "⭐ List all of the people that are blacklisted in the server.",
        },
        {
            name: "get-user",
            type: 1,
            description: "⭐ Get a blacklisted user infomation",
            options: [{
                name: "user-id",
                type: 3,
                required: true,
                description: "Please enter a user id",
            }]
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
                channel,
                member,
                options
            } = interaction;

            const sub = options.getSubcommand();

            switch (sub) {
                case "add": {
                    const user = options.getUser("add-user");
                    let reason = options.getString("reason") || "No reason provided.";

                    const response = new MessageEmbed({
                        color: "LUMINOUS_VIVID_PINK",
                        description: `${user} has been blacklisted from the server.`,
                        title: "Blacklisted User",
                        timestamp: new Date()
                    });

                    const Target = guild.members.cache.get(user.id);
                    Target.kick().then(async () => {
                        await Blacklist.create({
                            Blacklist_ID: generate.ranString(20),
                            Server_ID: guild.id,
                            User_ID: user.id,
                            Username: user.username,
                            User_Tag: user.tag,
                            Reason: reason,
                            Date: moment(Date.now()).format("MMMM Do YYYY")
                        }).then(() => interaction.reply({
                            embeds: [response],
                            ephemeral: true
                        }))
                    }).then(() => {

                        const log = guild.channels.cache.get(MyServer.logchannelID);
                        if (!log) return;

                        log.send({
                            embeds: [new MessageEmbed({
                                color: "#ff66a7",
                                title: "Mod Log | User Blacklisted",
                                description: `${user} has been blacklisted`,
                                fields: [{
                                        name: "User",
                                        value: `${user}`,
                                        inline: true
                                    },
                                    {
                                        name: "Moderator",
                                        value: `${member}`,
                                        inline: true
                                    },
                                    {
                                        name: "Date",
                                        value: `${moment(Date.now()).format("MMMM Do YYYY")}`,
                                        inline: true
                                    },
                                    {
                                        name: "Reason",
                                        value: `${reason}`
                                    }
                                ]
                            })]
                        })

                    })
                }
                break;
            case "remove": {
                const id = options.getString("userid");

                let user = await Blacklist.findOne({
                    Server_ID: guild.id,
                    User_ID: id
                });

                if (isNaN(id)) return interaction.reply({
                    embeds: [new MessageEmbed({
                        color: "RED",
                        description: "Please provide a valid userid"
                    })]
                });

                if (!user) return interaction.reply({
                    embeds: [new MessageEmbed({
                        color: "RED",
                        description: "That user has not been blacklisted from the server!"
                    })]
                });

                try {

                    interaction.reply({
                        embeds: [new MessageEmbed({
                            color: "GREEN",
                            description: `<@${user.User_ID}> has been removed from the servers blacklist.`,
                            title: "User Removed from blacklist"
                        })]
                    }).then(() => {
                        const log = guild.channels.cache.get(MyServer.logchannelID);
                        if (!log) return
                        else log.send({
                            embeds: [new MessageEmbed({
                                color: "#ff66a7",
                                title: "Mod Log | Removed User from Blacklist",
                                description: `<@${user.User_ID}> has been removed from the blacklist`,
                                fields: [{
                                        name: "User",
                                        value: `<@${user.User_ID}>`,
                                        inline: true
                                    },
                                    {
                                        name: "Moderator",
                                        value: `${member}`,
                                        inline: true
                                    },
                                    {
                                        name: "Date",
                                        value: `${moment(Date.now()).format("MMMM Do YYYY")}`,
                                        inline: true
                                    }
                                ]
                            })]
                        })
                    });
                    await user.delete();

                } catch (err) {
                    console.log(err);
                }
            }
            break;
            case "list": {
                let users = await Blacklist.find({
                    Server_ID: guild.id,
                })

                interaction.reply({
                    embeds: [
                        new MessageEmbed({
                            description: `${users.map((user, index) => {
                                return `**${index + 1}.** <@${user.User_ID}> (${user.User_ID})`
                            }).join(`\n`)}`,
                            color: "LUMINOUS_VIVID_PINK",
                            title: `${guild.name}'s Blacklisted Users`
                        })
                    ],
                    ephemeral: true
                })
            }
            break;
            case "get-user": {
                const id = options.getString("user-id");
                if (isNaN(id)) return interaction.reply({
                    embeds: [
                        new MessageEmbed({
                            description: "You need to state a valid user id.",
                            color: "RED"
                        })
                    ]
                });

                const user = await Blacklist.findOne({
                    Server_ID: guild.id,
                    User_ID: id
                }); 
                if (!user) return interaction.reply({
                    embeds: [
                        new MessageEmbed({
                            description: "That user has not been blacklisted from your server.",
                            color: "RED"
                        })
                    ]
                });

                await interaction.reply({
                    embeds: [
                        new MessageEmbed({
                            title: `${user.Username}'s Blacklist Information`, 
                            color: "LUMINOUS_VIVID_PINK", 
                            description: `**Blacklist ID:** \`${user.Blacklist_ID}\`\n> **Username:** ${user.Username}\n> **User ID:** ${user.User_ID}\n> **Reason:** ${user.Reason}\n> **Date Blacklisted:** ${user.Date}\n`
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