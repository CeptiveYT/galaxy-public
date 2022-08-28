const {
    generate, date
} = require('better-output');
const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    warn
} = require("../../Storage/Schemas/warnSchema");
const {
    invisible
} = require("../../Storage/Colors/EmbedColors");
const moment = require('moment');

module.exports = {
    name: "warn",
    cooldown: 0,
    permissions: "MANAGE_MESSAGES",
    enabled: true,
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        let MyServer = await guildSchema.findOne({
            serverID: message.guild.id
        });

        if (MyServer) {

            const user = message.mentions.members.first();
            const reason = args.slice(1).join(" ") || "No reason given";
            if (!user) return message.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        description: "❌ You need to mention a user to warn!"
                    })
                ]
            })

            let i = generate.ranString(30);
            if (i.length > 30) return;
            if (i.length < 30) return;


            await warn.create({
                serverID: message.guild.id,
                warnID: i,
                userID: user.user.id,
                moderatorID: message.author.id, 
                reason: reason,
                timestamp: Date.now()
            }).then(() => {
                message.channel.send({
                    embeds: [
                        new MessageEmbed({
                            color: "GREEN",
                            description: `${user} has been warned for \`${reason}\`.`
                        })
                    ]
                });
                user.user.send({
                    embeds: [
                        new MessageEmbed({
                            color: "RED", 
                            title: `Warning from ${message.guild.name}`, 
                            description: `You have been warned in **${message.guild.name}** if you believe thhat this warn was unjustified. Please contact the moderator/admin that dealt the warning.`,
                            fields: [
                                {
                                    name: "Server Name", 
                                    value: `${message.guild.name}`,
                                    inline: true
                                }, 
                                {
                                    name: "Warned By",
                                    value: `<@${message.author.id}>`, 
                                    inline: true
                                }, 
                                {
                                    name: "Time Warned",
                                    value: `${moment(Date.now()).format("Do MMMM YYYY")}`,
                                    inline: true
                                }, 
                                {
                                    name: "Reason", 
                                    value: `\`\`\`${reason}\`\`\``
                                }
                            ]
                        })
                    ]
                }); 
                const log = message.guild.channels.cache.get(MyServer.logchannelID);
                if (!log) return;

                log.send({
                    embeds: [
                        new MessageEmbed({
                            color: `${invisible}`, 
                            title: "Mod Log | User Warned", 
                            description: `${user} has been warned!`, 
                            fields: [
                                {
                                    name: "Warn ID",
                                    value: `\`\`\`${i}\`\`\``, 
                                    inline: false
                                }, 
                                {
                                    name: "User Tag",
                                    value: `\`\`\`${user.user.tag}\`\`\``, 
                                    inline: true 
                                },
                                {
                                    name: "User ID", 
                                    value: `\`\`\`${user.user.id}\`\`\``, 
                                    inline: true
                                },
                                {
                                    name: "Date Warned", 
                                    value: `\`\`\`fix\n${moment(Date.now()).format("Do MMMM YYYY")}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Reason", 
                                    value: `\`\`\`${reason}\`\`\``, 
                                    inline: true
                                }
                            ], 
                            thumbnail: {
                                url: `${user.user.displayAvatarURL({dynamic: true})}`
                            }
                        })
                    ]
                })
            })

        } else {
            return message.channel.send("Please set up Galaxy Bot first. `!setup`");
        }
    }
}